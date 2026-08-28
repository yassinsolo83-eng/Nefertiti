'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, MapPin } from 'lucide-react'
import { images } from '@/lib/data'
import { setGoogleLang } from '@/hooks/useGoogleTranslate'

type NavItem = [label: string, href: string]

const NAV_ITEMS: NavItem[] = [
  ['About', '/about'],
  ['Why Egypt', '/#vision'],
  ['Destinations', '/#destinations'],
  ['Experiences', '/experiences'],
  ['Services', '/services'],
  ['How It Works', '/how-it-works'],
  ['Contact', '/contact'],
]

type Props = {
  /** When true the nav paints its solid background permanently (inner pages). */
  solid?: boolean
  /** When true the nav is temporarily hidden (home-page intro). */
  hidden?: boolean
  /** When true the nav sits transparent over a hero and turns solid on scroll. */
  scrolled?: boolean
  /** When true, the horizontal link row is replaced by a hamburger-only trigger
   *  (used while the hero/intro is on screen, so nothing competes with it). */
  compact?: boolean
  /**
   * Optional smooth-scroll handler for same-page anchor links (home page only).
   * If omitted, links behave as normal navigations.
   */
  onAnchor?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  /**
   * Optional handler for the brand/logo click (home page only). When provided,
   * clicking the logo scrolls to the revealed hero instead of reloading to the intro.
   */
  onBrand?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function SiteNav({ solid, hidden, scrolled, compact, onAnchor, onBrand }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const navRef = useRef<HTMLElement>(null)

  const isScrolled = solid || scrolled

  // Close the dropdown when clicking outside it, or on Escape — so the compact
  // pill menu behaves like a normal dropdown, not a trap the user can't exit.
  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu()
    // Only intercept in-page anchors on the home page
    if (onAnchor && href.startsWith('/#')) onAnchor(e, href)
  }

  const handleBrand = (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu()
    if (onBrand) onBrand(e)
  }

  return (
    <header
      ref={navRef}
      className={`site-nav ${isScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''} ${hidden ? 'nav-hidden' : ''} ${compact ? 'nav-compact' : ''}`}
    >
      <a href="/" className="brand" onClick={handleBrand}>
        <span className="brand-badge notranslate"><MapPin size={9} strokeWidth={2.5} />EGYPT</span>
        <img src={isScrolled ? images.logoDark : images.logo} alt="Nefertiti Luxury Retreat Producer" />
      </a>
      <nav className={`site-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {NAV_ITEMS.map(([item, href]) => (
          <a key={item} href={href} onClick={(e) => handleClick(e, href)}>{item}</a>
        ))}
      </nav>

      {/* Compact mode (hero/intro): a single centered pill replaces the hamburger
          in the corner — brand name on the left, menu icon on the right. */}
      {compact && (
        <button
          className="nav-pill-trigger notranslate"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="nav-pill-label">Nefertiti</span>
          <span className="nav-pill-icon">{menuOpen ? <X size={16} /> : <Menu size={16} />}</span>
        </button>
      )}

      <div className="nav-actions">
        <div className="lang-switch">
          <button className="lang notranslate" onClick={() => setGoogleLang('en')} aria-label="English">EN</button>
          <span className="lang-sep">/</span>
          <button className="lang notranslate" onClick={() => setGoogleLang('it')} aria-label="Italiano">IT</button>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
