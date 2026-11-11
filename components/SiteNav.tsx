'use client'

import BrandLogo from '@/components/BrandLogo'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { setGoogleLang } from '@/hooks/useGoogleTranslate'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSiteSettings } from '@/components/SiteSettingsProvider'
import { menuDefaults, pageTextDefaults } from '@/lib/data'
import SocialIcons from '@/components/SocialIcons'

type NavItem = [label: string, href: string]
type SearchHit = { type: string; title: string; href: string; snippet: string }


type Props = {
  solid?: boolean
  /** Inner pages with an image hero: transparent at the top, cream once scrolled. */
  overHero?: boolean
  hidden?: boolean
  scrolled?: boolean
  /** When true, uses light logo + gold text (over dark intro).
   *  When false, uses dark logo + plum text (over light content). */
  showVideo?: boolean
  onAnchor?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  onBrand?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function SiteNav({
  hidden, showVideo: showVideoProp,
  onAnchor, onBrand,
}: Props) {
  const { menuItems, socialLinks, texts } = useSiteSettings()
  const NAV_ITEMS: NavItem[] = menuItems && menuItems.length ? menuItems : menuDefaults
  // All searchable pages — used for the client-side search overlay
  const SEARCH_PAGES = NAV_ITEMS.map(([label, href]) => ({ title: label, href, keywords: label.toLowerCase() }))
  // Main links shown in the bar on wide screens; everything else stays in the side menu
  const MAIN_LINKS = ['/destinations', '/retreats', '/experiences', '/services']
  const mainLinks = NAV_ITEMS.filter(([, href]) => MAIN_LINKS.includes(href))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [found, setFound] = useState<SearchHit[] | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // The bar is always transparent. Logo, icons and links switch between white (over video,
  // photos and dark areas) and plum (over light areas) depending on what is behind them.
  const navHidden = !!hidden
  const pathname = usePathname()
  const [tone, setTone] = useState<'light' | 'dark'>('dark')
  void showVideoProp

  useEffect(() => {
    const IGNORE = '.site-nav, .nav-sidebar, .nav-sidebar-overlay, .nav-search-overlay'
    const luminance = (c: string) => {
      const m = c.match(/rgba?\(([^)]+)\)/)
      if (!m) return null
      const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
      if (!(Number(a) > 0.5)) return null
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    // true when the first thing found behind the point is dark (video, photo, dark colour)
    const darkAt = (x: number, y: number) => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (el.closest(IGNORE)) continue
        const tag = el.tagName
        if (tag === 'VIDEO' || tag === 'IMG' || tag === 'CANVAS') return true
        const cs = getComputedStyle(el)
        const lum = luminance(cs.backgroundColor)
        if (lum !== null) return lum < 0.5
        if (cs.backgroundImage.includes('url(')) return true
      }
      return false
    }
    const measure = () => {
      // Home intro: the cream Ankh veil sits over the video until it opens
      if (document.body.dataset.khVeil === 'on') { setTone('dark'); return }
      const bar = navRef.current
      const h = bar ? bar.getBoundingClientRect().height : 72
      const y = Math.max(8, Math.min(h / 2, 60)) + (bar ? bar.getBoundingClientRect().top : 0)
      const w = window.innerWidth
      const votes = [0.12, 0.5, 0.88].map((f) => darkAt(w * f, y))
      setTone(votes.filter(Boolean).length >= 2 ? 'light' : 'dark')
    }
    let raf = 0
    const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    const timer = window.setInterval(measure, 500)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
      window.clearInterval(timer)
    }
  }, [pathname])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const closeSearch = useCallback(() => { setSearchOpen(false); setQuery('') }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeSidebar(); closeSearch() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeSidebar, closeSearch])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeSidebar()
    closeSearch()
    if (onAnchor && href.startsWith('/#')) onAnchor(e, href)
  }

  const handleBrand = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onBrand) onBrand(e)
  }

  // Site-wide search: ask the server, which looks through every text on the site
  useEffect(() => {
    const q = query.trim()
    if (!q) { setFound(null); return }
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        const data = await res.json()
        setFound(Array.isArray(data.results) ? data.results : [])
      } catch (err) {
        // If the request fails, fall back to matching the menu pages
        if ((err as Error).name !== 'AbortError') {
          setFound(
            SEARCH_PAGES.filter(p => p.keywords.includes(q.toLowerCase()))
              .map(p => ({ type: 'Page', title: p.title, href: p.href, snippet: '' })),
          )
        }
      }
    }, 200)
    return () => { clearTimeout(timer); ctrl.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const results = query.trim() ? found : null

  return (
    <>
      <header
        ref={navRef}
        className={`site-nav nav-clear tone-${tone} ${navHidden ? 'nav-hidden' : ''}`}
      >
        <div className="nav-bar">
          {/* Left — Hamburger */}
          <button
            className="nav-icon nav-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Center — Logo */}
          <Link href="/" className="nav-brand" onClick={handleBrand} aria-label="Nefertiti — home">
            <BrandLogo />
          </Link>

          {/* Main links — wide screens only */}
          <nav className="nav-links" aria-label="Main">
            {mainLinks.map(([label, href]) => (
              <Link key={href} href={href} onClick={(e) => handleClick(e, href)}>{label}</Link>
            ))}
          </nav>

          {/* Right — Search + call button */}
          <div className="nav-right">
            <button
              className="nav-icon nav-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <Link href="/pre-call" className="nav-cta" onClick={() => { closeSidebar(); closeSearch() }}>
              {texts?.navButton || pageTextDefaults.navButton}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <div className={`nav-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} />
      <aside className={`nav-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="nav-sidebar-header">
          <Link href="/" className="nav-sidebar-logo" onClick={(e) => { closeSidebar(); handleBrand(e) }}>
            <BrandLogo />
          </Link>
          <button className="nav-sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="nav-sidebar-links">
          {NAV_ITEMS.map(([item, href]) => (
            <Link key={item} href={href} onClick={(e) => handleClick(e, href)}>
              {item}
            </Link>
          ))}
        </nav>

        <div className="nav-sidebar-footer">
          <SocialIcons links={socialLinks} />
          <div className="nav-sidebar-lang">
            <button className="lang notranslate" onClick={() => { setGoogleLang('en'); closeSidebar() }}>EN</button>
            <span className="lang-sep">/</span>
            <button className="lang notranslate" onClick={() => { setGoogleLang('it'); closeSidebar() }}>IT</button>
          </div>
        </div>
      </aside>

      {/* ── Search overlay ── */}
      <div className={`nav-search-overlay ${searchOpen ? 'open' : ''}`}>
        <div className="nav-search-container">
          <div className="nav-search-bar">
            <Search size={18} className="nav-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="nav-search-input"
              placeholder="Search pages..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="nav-search-close" onClick={closeSearch} aria-label="Close search">
              <X size={20} />
            </button>
          </div>
          {query.trim() && results && (
            <div className="nav-search-results">
              {results.length > 0 ? results.map(r => (
                <Link key={`${r.href}-${r.title}-${r.snippet}`} href={r.href} className="nav-search-result" onClick={(e) => handleClick(e, r.href)}>
                  <span className="nav-search-result-title">{r.title}</span>
                  <span className="nav-search-result-type">{r.type}</span>
                  {r.snippet && <span className="nav-search-result-text">{r.snippet}</span>}
                </Link>
              )) : (
                <p className="nav-search-empty">No results found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
