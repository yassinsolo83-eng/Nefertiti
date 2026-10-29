'use client'

import BrandLogo from '@/components/BrandLogo'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { setGoogleLang } from '@/hooks/useGoogleTranslate'
import Link from 'next/link'
import { useSiteSettings } from '@/components/SiteSettingsProvider'
import { menuDefaults } from '@/lib/data'

type NavItem = [label: string, href: string]


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
  solid, overHero, hidden, scrolled, showVideo: showVideoProp,
  onAnchor, onBrand,
}: Props) {
  const { menuItems } = useSiteSettings()
  const NAV_ITEMS: NavItem[] = menuItems && menuItems.length ? menuItems : menuDefaults
  // All searchable pages — used for the client-side search overlay
  const SEARCH_PAGES = NAV_ITEMS.map(([label, href]) => ({ title: label, href, keywords: label.toLowerCase() }))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [pastTop, setPastTop] = useState(false)
  useEffect(() => {
    if (!overHero) return
    const onScroll = () => setPastTop(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  const isScrolled = solid || scrolled || (overHero && pastTop)
  const showVideo = showVideoProp || (overHero && !pastTop)

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

  // Filter search results
  const results = query.trim()
    ? SEARCH_PAGES.filter(p => p.keywords.includes(query.toLowerCase().trim()))
    : []

  return (
    <>
      <header
        ref={navRef}
        className={`site-nav ${isScrolled ? 'is-scrolled' : ''} ${hidden ? 'nav-hidden' : ''} ${showVideo ? 'nav-video' : 'nav-solid'}`}
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

          {/* Right — Search */}
          <button
            className="nav-icon nav-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
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
          {query.trim() && (
            <div className="nav-search-results">
              {results.length > 0 ? results.map(r => (
                <Link key={r.href} href={r.href} className="nav-search-result" onClick={(e) => handleClick(e, r.href)}>
                  {r.title}
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
