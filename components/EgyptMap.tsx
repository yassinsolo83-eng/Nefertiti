'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { destinationCoords, destinationTravel } from '@/lib/data'
import type { Destination } from '@/lib/data'
import Link from 'next/link'

type Props = {
  destinations: Destination[]
  /** Destinations with a full page of their own (bigger pin, "Explore" link) */
  featuredIds: string[]
  /** Called by the "View details" button of destinations without a page. When
   *  missing, that button links to /destinations?open=<id> instead. */
  onOpen?: (id: string) => void
}

type Geo = Record<string, unknown>
type AtlasLabel = {
  k: 'city' | 'far' | 'land' | 'region' | 'water' | 'gov' | 'peak' | 'poi'
  n: string
  y: number
  x: number
  p: number // priority, lower wins a collision
  z: number // zoom level (above the fitted view) from which the label may show
  s?: string
  r?: number
  side?: string
}
type Atlas = {
  bbox: [number, number, number, number]
  shelf: Geo[]
  countries: { features: { properties: { e: number } }[] } & Geo
  green: Geo
  lakes: Geo
  gov: Geo
  govFar: Geo
  rail: Geo
  roads: { hwy: Geo; minor: Geo }
  water: Geo
  labels: AtlasLabel[]
}

type Pin = { marker: import('leaflet').Marker; lat: number; lng: number; featured: boolean }
type Side = 'r' | 'l' | 't' | 'b' | 'c'
type Lab = {
  marker: import('leaflet').Marker
  lat: number
  lng: number
  prio: number
  z: number
  sides: Side[]
  rot: number
  pinId?: string
  w: number
  h: number
}

// The whole of Egypt, with a little sea above and a little Sudan below, so the land fills the frame
const FIT: [[number, number], [number, number]] = [[21.7, 24.5], [32.3, 37.0]]
const ZOOM_RANGE = 3

// Brand-tinted atlas of Egypt, drawn by us from open map data (no map service, no keys, no tiles):
// coast and neighbours, the 27 governorates, the Nile and its Delta, lakes, oases, roads, railways
// and ~100 place names. Every name is a collision-checked label, so the map is as detailed as the
// space allows and never a pile of overlapping text.
// Tapping a pin opens a fixed detail card in the corner of the map (never a floating popup, so it
// is never clipped), and draws a line back to Cairo.
// Leaflet and the atlas are loaded only when the map scrolls into view, so they never slow the page down.
export default function EgyptMap({ destinations, featuredIds, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const LRef = useRef<typeof import('leaflet') | null>(null)
  const pinsRef = useRef<Record<string, Pin>>({})
  const labelsRef = useRef<Lab[]>([])
  const baseZoomRef = useRef(6)
  const placeRef = useRef<() => void>(() => {})
  const activeIdRef = useRef<string | null>(null)
  const routeRef = useRef<import('leaflet').Polyline | null>(null)
  const [active, setActive] = useState<Destination | null>(null)
  const [touchHint, setTouchHint] = useState(false)
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen
  activeIdRef.current = active?.id ?? null

  // ── Build the map once ──────────────────────────────────────────────
  useEffect(() => {
    const host = box.current
    if (!host) return
    let cancelled = false
    let ro: ResizeObserver | null = null
    let raf = 0
    let hintTimer: ReturnType<typeof setTimeout> | undefined

    const build = async () => {
      const atlasReq: Promise<Atlas | null> = fetch('/brand/egypt-atlas.json')
        .then((r) => r.json() as Promise<Atlas>)
        .catch(() => null) // the pins still work on the plain background
      const L = (await import('leaflet')).default
      const atlas = await atlasReq
      if (cancelled || !host) return
      LRef.current = L

      const touch = L.Browser.mobile
      const map = L.map(host, {
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // never trap the page scroll; enabled after a click
        dragging: !touch, // phones: one finger scrolls the page, two fingers move the map
        maxBounds: atlas ? [[atlas.bbox[0], atlas.bbox[1]], [atlas.bbox[2], atlas.bbox[3]]] : [[17.5, 19], [37.5, 42]],
        maxBoundsViscosity: 0.7,
        renderer: L.svg({ padding: 0.5 }),
      })
      mapRef.current = map

      // Frame all of Egypt exactly: the fitted zoom is the most zoomed-out view allowed
      const bounds = L.latLngBounds(FIT)
      const fit = (animate = false) => {
        map.invalidateSize({ animate: false })
        map.setMinZoom(0)
        map.setMaxZoom(18)
        const snap = map.options.zoomSnap
        map.options.zoomSnap = 0 // an exact fit, not rounded down to the next 0.25
        map.fitBounds(bounds, { padding: [8, 8], animate })
        map.options.zoomSnap = snap
        baseZoomRef.current = map.getZoom()
        map.setMinZoom(baseZoomRef.current)
        map.setMaxZoom(baseZoomRef.current + ZOOM_RANGE)
      }
      fit()

      const zoomCtl = L.control.zoom({ position: 'bottomright' }).addTo(map)
      const Reset = L.Control.extend({
        onAdd() {
          const bar = L.DomUtil.create('div', 'leaflet-bar egm-reset')
          const a = L.DomUtil.create('a', '', bar)
          a.href = '#'
          a.role = 'button'
          a.title = 'Show all of Egypt'
          a.setAttribute('aria-label', 'Show all of Egypt')
          a.innerHTML =
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'
          L.DomEvent.disableClickPropagation(bar)
          L.DomEvent.on(a, 'click', (e) => {
            L.DomEvent.preventDefault(e)
            map.flyToBounds(bounds, { padding: [8, 8], duration: 0.6 })
          })
          return bar
        },
      })
      new Reset({ position: 'bottomright' }).addTo(map)
      zoomCtl.getContainer()?.classList.add('egm-zoom')

      // ── The atlas ───────────────────────────────────────────────────
      const labelDefs: Lab[] = []
      if (atlas) {
        const draw = (data: unknown, style: import('leaflet').PathOptions | ((f?: { properties?: unknown }) => import('leaflet').PathOptions)) =>
          L.geoJSON(data as never, { interactive: false, style: style as never }).addTo(map)

        // shallow water around the coast
        draw(atlas.shelf[0], { fillColor: '#dce9e4', fillOpacity: 1, stroke: false })
        draw(atlas.shelf[1], { fillColor: '#e7f1ed', fillOpacity: 1, stroke: false })
        // countries
        draw(atlas.countries, (f) =>
          (f?.properties as { e?: number } | undefined)?.e
            ? { fillColor: '#fbf8ee', fillOpacity: 1, color: '#8d4c65', weight: 1.4, opacity: 0.6 }
            : { fillColor: '#e9e1d2', fillOpacity: 1, color: '#d3c6b3', weight: 0.9, opacity: 1 },
        )
        // soft glow along Egypt's border so the country reads first
        draw(
          { type: 'FeatureCollection', features: atlas.countries.features.filter((f) => f.properties.e) },
          { fill: false, color: '#8d4c65', weight: 5, opacity: 0.06, lineJoin: 'round' },
        )
        // fertile land: Nile valley, Delta, Faiyum and the oases
        draw(atlas.green, { fillColor: '#d6e7cc', fillOpacity: 1, stroke: false })
        draw(atlas.lakes, { fillColor: '#bfe0dc', fillOpacity: 1, color: '#7cc7bf', weight: 0.8, opacity: 0.9 })
        draw(atlas.govFar, { fill: false, color: '#b19a86', weight: 0.8, opacity: 0.5, dashArray: '2 5' })
        draw(atlas.gov, { fill: false, color: '#8d4c65', weight: 0.8, opacity: 0.3, dashArray: '3 4', className: 'egm-gov' })
        draw(atlas.rail, { fill: false, color: '#a58a74', weight: 1, dashArray: '5 3', className: 'egm-rail' })
        draw(atlas.roads.minor, { fill: false, color: '#c4b39c', weight: 0.9, className: 'egm-road-minor' })
        draw(atlas.roads.hwy, { fill: false, color: '#b9a48a', weight: 1.3, opacity: 0.9, className: 'egm-road' })
        // the Nile, its two Delta branches and the Suez Canal
        draw(atlas.water, (f) =>
          (f?.properties as { k?: string } | undefined)?.k === 'canal'
            ? { fill: false, color: '#65c0b7', weight: 1.8, opacity: 0.85, lineCap: 'round', className: 'egm-canal' }
            : { fill: false, color: '#65c0b7', weight: 3, opacity: 0.7, lineCap: 'round', lineJoin: 'round', className: 'egm-nile' },
        )

        // place names (kept as plain markers; the collision pass decides which are visible)
        for (const l of atlas.labels) {
          const point = l.k === 'city' || l.k === 'far' || l.k === 'peak' || l.k === 'poi'
          const glyph = l.k === 'peak' ? '<b class="egm-peak"></b>' : l.k === 'poi' ? '<b class="egm-poi"></b>' : point ? '<b></b>' : ''
          const marker = L.marker([l.y, l.x], {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: `egm-l egm-k-${l.k}${l.s ? ` egm-s-${l.s}` : ''}`,
              html: `${glyph}<span>${l.n}</span>`,
              iconSize: [0, 0],
            }),
          }).addTo(map)
          const sides: Side[] = l.side === 'r' ? ['r'] : point ? ['r', 'l'] : ['c']
          labelDefs.push({ marker, lat: l.y, lng: l.x, prio: l.p, z: l.z, sides, rot: l.r ?? 0, w: 0, h: 0 })
          const el = marker.getElement()
          if (el) {
            el.dataset.side = sides[0]
            el.style.setProperty('--rot', `${l.r ?? 0}deg`)
            el.style.setProperty('--off', '8px')
          }
        }
      }

      // ── Destination pins ────────────────────────────────────────────
      const pinHit = touch ? 40 : 30
      for (const d of destinations) {
        const fallback = destinationCoords[d.id]
        const lat = d.lat ?? fallback?.[0]
        const lng = d.lng ?? fallback?.[1]
        if (lat == null || lng == null) continue
        const featured = featuredIds.includes(d.id)

        const marker = L.marker([lat, lng], {
          title: d.title,
          riseOnHover: true,
          zIndexOffset: featured ? 1200 : 1000,
          icon: L.divIcon({
            className: `egm-pin${featured ? ' egm-pin-main' : ''}`,
            html: '<i></i>',
            iconSize: [pinHit, pinHit],
            iconAnchor: [pinHit / 2, pinHit / 2],
          }),
        }).addTo(map)
        marker.on('click', () => setActive(d))
        pinsRef.current[d.id] = { marker, lat, lng, featured }

        // permanent name beside the pin (when there is room); on phones only the part before "&" is kept
        const cut = d.title.search(/ (&|and) /)
        const head = cut > 0 ? d.title.slice(0, cut) : d.title
        const tail = cut > 0 ? d.title.slice(cut) : ''
        const label = L.marker([lat, lng], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({
            className: `egm-l egm-k-pin${featured ? ' egm-s-main' : ''}`,
            html: `<span>${head}<s>${tail}</s></span>`,
            iconSize: [0, 0],
          }),
        }).addTo(map)
        labelDefs.push({
          marker: label, lat, lng, prio: featured ? 5 : 8, z: 0, sides: ['r', 'l', 't', 'b'], rot: 0, pinId: d.id, w: 0, h: 0,
        })
        const el = label.getElement()
        if (el) {
          el.dataset.side = 'r'
          el.style.setProperty('--off', `${(featured ? 15 : 11) + 3}px`)
        }
      }
      labelsRef.current = labelDefs.sort((a, b) => a.prio - b.prio)

      // ── Label collision pass ────────────────────────────────────────
      const place = () => {
        raf = 0
        const m = mapRef.current
        if (!m) return
        const size = m.getSize()
        const rel = m.getZoom() - baseZoomRef.current
        const small = window.innerWidth < 760
        host.classList.toggle('egm-z1', rel >= 0.5)
        host.classList.toggle('egm-z2', rel >= 1.25)

        const taken: number[][] = []
        const clash = (b: number[]) => taken.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])
        const pinR = (p: Pin) => (p.featured ? (small ? 12 : 15) : small ? 9 : 11)
        for (const p of Object.values(pinsRef.current)) {
          const c = m.latLngToContainerPoint([p.lat, p.lng])
          const r = pinR(p)
          taken.push([c.x - r, c.y - r, c.x + r, c.y + r])
        }

        const order = [...labelsRef.current]
        const act = activeIdRef.current
        if (act) order.sort((a, b) => (a.pinId === act ? -1 : 0) - (b.pinId === act ? -1 : 0) || a.prio - b.prio)

        const shownPin: Record<string, boolean> = {}
        for (const l of order) {
          const el = l.marker.getElement()
          if (!el) continue
          const span = el.querySelector('span') as HTMLElement | null
          if (!span) continue
          if (!l.w) {
            l.w = span.offsetWidth
            l.h = span.offsetHeight || 14
          }
          let ok = false
          if (rel >= l.z - 0.001 || l.pinId) {
            const c = m.latLngToContainerPoint([l.lat, l.lng])
            if (c.x > -80 && c.y > -30 && c.x < size.x + 80 && c.y < size.y + 30) {
              const pin = l.pinId ? pinsRef.current[l.pinId] : null
              const r = pin ? pinR(pin) : 0
              const off = pin ? r + 3 : 8
              const hw = l.w / 2
              const hh = l.h / 2
              for (const s of l.sides) {
                let b: number[]
                if (s === 'r') b = pin ? [c.x + off, c.y - hh, c.x + off + l.w, c.y + hh] : [c.x - 4, c.y - hh, c.x + off + l.w, c.y + hh]
                else if (s === 'l') b = pin ? [c.x - off - l.w, c.y - hh, c.x - off, c.y + hh] : [c.x - off - l.w, c.y - hh, c.x + 4, c.y + hh]
                else if (s === 't') b = [c.x - hw, c.y - r - 3 - l.h, c.x + hw, c.y - r - 3]
                else if (s === 'b') b = [c.x - hw, c.y + r + 3, c.x + hw, c.y + r + 3 + l.h]
                else {
                  const a = (l.rot * Math.PI) / 180
                  const bw = Math.abs(l.w * Math.cos(a)) + Math.abs(l.h * Math.sin(a))
                  const bh = Math.abs(l.w * Math.sin(a)) + Math.abs(l.h * Math.cos(a))
                  b = [c.x - bw / 2, c.y - bh / 2, c.x + bw / 2, c.y + bh / 2]
                }
                const inside = b[0] >= 4 && b[1] >= 4 && b[2] <= size.x - 4 && b[3] <= size.y - 4
                // labels sit a little apart from each other
                const padded = [b[0] - 3, b[1] - 2, b[2] + 3, b[3] + 2]
                if (inside && !clash(padded)) {
                  el.dataset.side = s
                  taken.push(padded)
                  ok = true
                  break
                }
              }
            }
          }
          el.classList.toggle('is-off', !ok)
          if (l.pinId) {
            shownPin[l.pinId] = ok
            el.classList.toggle('is-active', l.pinId === act)
          }
        }

        // a hover tooltip is only needed for a pin whose name is not already written beside it
        for (const [id, p] of Object.entries(pinsRef.current)) {
          const d = destinations.find((x) => x.id === id)
          if (!d) continue
          if (shownPin[id]) {
            if (p.marker.getTooltip()) p.marker.unbindTooltip()
          } else if (!p.marker.getTooltip()) {
            p.marker.bindTooltip(d.title, { direction: 'top', offset: [0, p.featured ? -12 : -9], className: 'egm-tip' })
          }
        }
      }
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(place)
      }
      placeRef.current = schedule
      map.on('zoomend moveend resize', schedule)
      schedule()
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          labelsRef.current.forEach((l) => (l.w = 0))
          schedule()
        })
      }

      // Clicking empty map closes the card and frees the scroll wheel
      map.on('click', () => {
        setActive(null)
        map.scrollWheelZoom.enable()
      })
      map.on('mouseout', () => map.scrollWheelZoom.disable())

      // Phones: tell people how to move the map (one finger keeps scrolling the page)
      if (touch) {
        setTouchHint(true)
        hintTimer = setTimeout(() => setTouchHint(false), 4500)
        map.once('zoomstart click', () => setTouchHint(false))
      }

      // Re-frame when the box changes shape (rotating a phone, resizing the window)
      let first = true
      ro = new ResizeObserver(() => {
        if (first) {
          first = false
          return
        }
        fit()
        labelsRef.current.forEach((l) => (l.w = 0))
        schedule()
      })
      ro.observe(host)
    }

    // Start loading just before the map comes into view
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          build()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(host)

    return () => {
      cancelled = true
      io.disconnect()
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      if (hintTimer) clearTimeout(hintTimer)
      mapRef.current?.remove()
      mapRef.current = null
      pinsRef.current = {}
      labelsRef.current = []
    }
  }, [destinations, featuredIds])

  // ── React to the selected destination: highlight pin + line to Cairo ──
  useEffect(() => {
    const map = mapRef.current
    const L = LRef.current
    if (!map || !L) return

    Object.values(pinsRef.current).forEach(({ marker }) => marker.getElement()?.classList.remove('is-active'))
    routeRef.current?.remove()
    routeRef.current = null
    placeRef.current()
    if (!active) return

    const m = pinsRef.current[active.id]
    if (!m) return
    m.marker.getElement()?.classList.add('is-active')

    if (active.id !== 'cairo') {
      routeRef.current = L.polyline([destinationCoords.cairo, [m.lat, m.lng]], {
        color: '#8d4c65', weight: 2, opacity: 0.6, dashArray: '2 7', lineCap: 'round', interactive: false,
      }).addTo(map)
    }

    // Keep the chosen pin clear of the card (card sits top-left on wide screens, bottom on phones)
    const wide = window.innerWidth >= 760
    const panel = panelRef.current
    const pw = panel?.offsetWidth ?? 330
    const ph = panel?.offsetHeight ?? 200
    map.panInside([m.lat, m.lng], {
      paddingTopLeft: wide ? [pw + 50, 40] : [30, 50],
      paddingBottomRight: wide ? [50, 40] : [30, ph + 30],
    })
  }, [active])

  const travel = active ? active.fromCairo || destinationTravel[active.id] : null
  const featured = active ? featuredIds.includes(active.id) : false

  return (
    <div className="egm-stage">
      <div ref={box} className="egm" role="region" aria-label="Map of our destinations in Egypt" />

      {touchHint && !active && <div className="egm-touch">Pinch to zoom · two fingers to move the map</div>}

      {active && (
        <div ref={panelRef} className="egm-panel" role="dialog" aria-label={active.title}>
          <button className="egm-panel-x" type="button" onClick={() => setActive(null)} aria-label="Close">×</button>
          {active.image && <img src={active.image} alt={active.title} loading="lazy" />}
          <div className="egm-body">
            {active.feeling && <p className="egm-feeling">{active.feeling}</p>}
            <h4>{active.title}</h4>
            {active.tagline && <p className="egm-tagline">{active.tagline}</p>}
            {travel && (
              <p className="egm-travel">
                <span>From Cairo</span>
                {travel}
              </p>
            )}
            {active.idealFor?.length ? (
              <div className="egm-chips">
                {active.idealFor.slice(0, 3).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            ) : null}
            {featured ? (
              <Link className="egm-link" href={`/destinations/${active.id}`}>Explore ↗</Link>
            ) : onOpenRef.current ? (
              <button className="egm-link" type="button" onClick={() => onOpenRef.current?.(active.id)}>View details ↗</button>
            ) : (
              <Link className="egm-link" href={`/destinations?open=${encodeURIComponent(active.id)}`}>View details ↗</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
