'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { destinationCoords, destinationTravel } from '@/lib/data'
import type { Destination } from '@/lib/data'

type Props = {
  destinations: Destination[]
  /** Destinations with a full page of their own (bigger pin, "Explore" link) */
  featuredIds: string[]
  height?: number
  /** Called by the "View details" button of destinations without a page. When
   *  missing, that button links to /destinations?open=<id> instead. */
  onOpen?: (id: string) => void
}

type Marker = { marker: import('leaflet').Marker; lat: number; lng: number }

// Soft brand-tinted map of Egypt with one pin per destination.
// Tapping a pin opens a fixed detail card in the corner of the map (never a
// floating popup, so it is never clipped), and draws a line back to Cairo.
// Leaflet is loaded only when the map scrolls into view, so it never slows the page down.
export default function EgyptMap({ destinations, featuredIds, height = 520, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const LRef = useRef<typeof import('leaflet') | null>(null)
  const markersRef = useRef<Record<string, Marker>>({})
  const routeRef = useRef<import('leaflet').Polyline | null>(null)
  const [active, setActive] = useState<Destination | null>(null)
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  // ── Build the map once ──────────────────────────────────────────────
  useEffect(() => {
    const host = box.current
    if (!host) return
    let cancelled = false

    const build = async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !host) return
      LRef.current = L

      const touch = L.Browser.mobile
      const map = L.map(host, {
        zoomSnap: 0.25,
        minZoom: 5,
        maxZoom: 9,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // never trap the page scroll; enabled after a click
        dragging: !touch, // phones: one finger scrolls the page, two fingers move the map
        maxBounds: [[17.5, 19], [37.5, 42]],
        maxBoundsViscosity: 0.4,
      })
      mapRef.current = map
      map.fitBounds([[21.6, 24.4], [32.2, 36.8]], { padding: [6, 6] })
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // The map is drawn by us from country outlines (no map service, no keys, no tiles)
      try {
        const res = await fetch('/brand/egypt-map.json')
        const geo = await res.json()
        if (cancelled) return
        L.geoJSON(geo, {
          interactive: false,
          style: (f) =>
            f?.properties?.egypt
              ? { fillColor: '#fbf8ee', fillOpacity: 1, color: '#8d4c65', weight: 1.4, opacity: 0.55 }
              : { fillColor: '#e8e0d1', fillOpacity: 1, color: '#d3c6b3', weight: 0.8, opacity: 1 },
        }).addTo(map)
      } catch {
        /* the pins still work on the plain background */
      }

      // The Nile and its Delta, drawn lightly
      const nile: [number, number][] = [
        [22.0, 31.3], [22.8, 32.0], [23.97, 32.88], [24.09, 32.9], [25.0, 32.8], [25.69, 32.64], [26.17, 32.72],
        [26.55, 31.9], [27.18, 31.18], [28.1, 30.75], [29.07, 31.1], [29.9, 31.25], [30.2, 31.2],
      ]
      L.polyline(nile, { color: '#65c0b7', weight: 3, opacity: 0.55, smoothFactor: 1.5, interactive: false, lineCap: 'round' }).addTo(map)
      L.polyline([[30.2, 31.2], [30.9, 30.9], [31.4, 30.4]], { color: '#65c0b7', weight: 2.5, opacity: 0.55, interactive: false }).addTo(map)
      L.polyline([[30.2, 31.2], [30.9, 31.4], [31.42, 31.8]], { color: '#65c0b7', weight: 2.5, opacity: 0.55, interactive: false }).addTo(map)

      // Names of the neighbours (soft, so they never compete with the pins)
      const land = (text: string, lat: number, lng: number) =>
        L.marker([lat, lng], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({ className: 'egm-land', html: `<span>${text}</span>`, iconSize: [120, 16], iconAnchor: [60, 8] }),
        }).addTo(map)
      land('LIBYA', 27.0, 21.8)
      land('SUDAN', 20.6, 29.6)
      land('SAUDI ARABIA', 26.4, 38.4)
      land('JORDAN', 30.6, 36.9)

      // Sea names (the base map is label-free so it stays clean)
      const sea = (text: string, lat: number, lng: number) =>
        L.marker([lat, lng], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({ className: 'egm-sea', html: `<span>${text}</span>`, iconSize: [160, 20], iconAnchor: [80, 10] }),
        }).addTo(map)
      sea('Mediterranean Sea', 33.0, 28.0)
      sea('Red Sea', 22.6, 37.3)

      for (const d of destinations) {
        const fallback = destinationCoords[d.id]
        const lat = d.lat ?? fallback?.[0]
        const lng = d.lng ?? fallback?.[1]
        if (lat == null || lng == null) continue
        const featured = featuredIds.includes(d.id)

        const marker = L.marker([lat, lng], {
          title: d.title,
          riseOnHover: true,
          icon: L.divIcon({
            className: `egm-pin${featured ? ' egm-pin-main' : ''}`,
            html: '<i></i>',
            iconSize: featured ? [26, 26] : [18, 18],
            iconAnchor: featured ? [13, 13] : [9, 9],
          }),
        }).addTo(map)

        marker.bindTooltip(d.title, { direction: 'top', offset: [0, featured ? -12 : -9], className: 'egm-tip' })
        marker.on('click', () => setActive(d))
        markersRef.current[d.id] = { marker, lat, lng }
      }

      // Clicking empty map closes the card and frees the scroll wheel
      map.on('click', () => {
        setActive(null)
        map.scrollWheelZoom.enable()
      })
      map.on('mouseout', () => map.scrollWheelZoom.disable())
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
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [destinations, featuredIds])

  // ── React to the selected destination: highlight pin + line to Cairo ──
  useEffect(() => {
    const map = mapRef.current
    const L = LRef.current
    if (!map || !L) return

    Object.values(markersRef.current).forEach(({ marker }) => marker.getElement()?.classList.remove('is-active'))
    routeRef.current?.remove()
    routeRef.current = null
    if (!active) return

    const m = markersRef.current[active.id]
    if (!m) return
    m.marker.getElement()?.classList.add('is-active')

    if (active.id !== 'cairo') {
      routeRef.current = L.polyline([destinationCoords.cairo, [m.lat, m.lng]], {
        color: '#8d4c65', weight: 2, opacity: 0.6, dashArray: '2 7', lineCap: 'round', interactive: false,
      }).addTo(map)
    }

    // Keep the chosen pin clear of the card (card sits top-left on wide screens, bottom on phones)
    const wide = typeof window !== 'undefined' && window.innerWidth >= 760
    map.panInside([m.lat, m.lng], {
      paddingTopLeft: wide ? [360, 40] : [30, 40],
      paddingBottomRight: wide ? [40, 40] : [30, 320],
    })
  }, [active])

  const travel = active ? active.fromCairo || destinationTravel[active.id] : null
  const featured = active ? featuredIds.includes(active.id) : false

  return (
    <div className="egm-stage" style={{ height }}>
      <div ref={box} className="egm" style={{ height }} role="region" aria-label="Map of our destinations in Egypt" />

      {active && (
        <div className="egm-panel" role="dialog" aria-label={active.title}>
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
              <a className="egm-link" href={`/destinations/${active.id}`}>Explore ↗</a>
            ) : onOpenRef.current ? (
              <button className="egm-link" type="button" onClick={() => onOpenRef.current?.(active.id)}>View details ↗</button>
            ) : (
              <a className="egm-link" href={`/destinations?open=${encodeURIComponent(active.id)}`}>View details ↗</a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
