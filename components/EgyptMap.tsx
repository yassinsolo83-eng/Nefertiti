'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { destinationCoords } from '@/lib/data'
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

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

// Soft brand-tinted map of Egypt with one pin per destination.
// Leaflet is loaded only when the map scrolls into view, so it never slows the page down.
export default function EgyptMap({ destinations, featuredIds, height = 520, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  useEffect(() => {
    const host = box.current
    if (!host) return
    let map: import('leaflet').Map | null = null
    let cancelled = false

    const build = async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !host) return

      const touch = L.Browser.mobile
      map = L.map(host, {
        zoomSnap: 0.25,
        minZoom: 5,
        maxZoom: 9,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // never trap the page scroll; enabled after a click
        dragging: !touch, // phones: one finger scrolls the page, two fingers move the map
        maxBounds: [[18, 20], [37, 40.5]],
        maxBoundsViscosity: 0.4,
      })
      map.fitBounds([[21.8, 24.6], [32.2, 36.6]], { padding: [10, 10] })
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

      // The Nile and Lake Nasser, drawn lightly
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
        }).addTo(map!)
      land('LIBYA', 27.0, 21.8)
      land('SUDAN', 20.6, 29.6)
      land('SAUDI ARABIA', 26.4, 38.4)
      land('ISRAEL · JORDAN', 30.2, 36.4)

      // Sea names (the base map is label-free so it stays clean)
      const sea = (text: string, lat: number, lng: number) =>
        L.marker([lat, lng], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({ className: 'egm-sea', html: `<span>${text}</span>`, iconSize: [160, 20], iconAnchor: [80, 10] }),
        }).addTo(map!)
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

        // Popup card
        const card = el('div', 'egm-card')
        if (d.image) {
          const img = el('img')
          img.src = d.image
          img.alt = d.title
          img.loading = 'lazy'
          card.appendChild(img)
        }
        const body = el('div', 'egm-body')
        if (d.feeling) body.appendChild(el('p', 'egm-feeling', d.feeling))
        body.appendChild(el('h4', undefined, d.title))
        if (d.tagline) body.appendChild(el('p', 'egm-tagline', d.tagline))
        if (d.idealFor?.length) {
          const chips = el('div', 'egm-chips')
          d.idealFor.slice(0, 3).forEach((c) => chips.appendChild(el('span', undefined, c)))
          body.appendChild(chips)
        }
        if (featured) {
          const a = el('a', 'egm-link', 'Explore ↗')
          a.href = `/destinations/${d.id}`
          body.appendChild(a)
        } else if (onOpenRef.current) {
          const b = el('button', 'egm-link', 'View details ↗')
          b.type = 'button'
          b.addEventListener('click', () => onOpenRef.current?.(d.id))
          body.appendChild(b)
        } else {
          const a = el('a', 'egm-link', 'View details ↗')
          a.href = `/destinations?open=${encodeURIComponent(d.id)}`
          body.appendChild(a)
        }
        card.appendChild(body)
        marker.bindPopup(card, { maxWidth: 260, minWidth: 220, className: 'egm-popup', autoPanPaddingTopLeft: [20, 70], autoPanPaddingBottomRight: [20, 20] })
      }

      map.on('click', () => map?.scrollWheelZoom.enable())
      map.on('mouseout', () => map?.scrollWheelZoom.disable())
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
      map?.remove()
    }
  }, [destinations, featuredIds])

  return (
    <div
      ref={box}
      className="egm"
      style={{ height }}
      role="region"
      aria-label="Map of our destinations in Egypt"
    />
  )
}
