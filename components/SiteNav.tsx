'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
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
  solid?: boolean
  hidden?: boolean
  scrolled?: boolean
  /** When true, the pill uses light logo + gold border (over dark intro).
   *  When false, uses dark logo + ivory background (over light content). */
  showVideo?: boolean
  onAnchor?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  onBrand?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function SiteNav({
  solid, hidden, scrolled, showVideo,
  onAnchor, onBrand,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const navRef = useRef<HTMLElement>(null)

  const isScrolled = solid || scrolled

  // Close the dropdown on outside click or Escape — a normal dropdown, not a trap.
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
    if (onAnchor && href.startsWith('/#')) onAnchor(e, href)
  }

  const handleBrand = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onBrand) onBrand(e)
  }

  return (
    <header
      ref={navRef}
      className={`site-nav ${isScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''} ${hidden ? 'nav-hidden' : ''} ${showVideo ? 'pill-video' : 'pill-solid'}`}
    >
      {/* The pill IS the navigation everywhere: logo (left) + menu toggle (right),
          with a dropdown panel below. On the home intro it shows a clear-video
          window; elsewhere it's a solid ivory bar. */}
      <div className="nav-pill">
        <a href="/#vision" className="nav-pill-brand" onClick={handleBrand} aria-label="Nefertiti — home">
          <img src={showVideo ? images.logo : images.logoDark} alt="Nefertiti Luxury Retreat Producer" />
        </a>

        <button
          className="nav-pill-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Dropdown panel — sits outside the pill so overflow:hidden doesn't clip it */}
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {NAV_ITEMS.map(([item, href]) => (
          <a key={item} href={href} onClick={(e) => handleClick(e, href)}>{item}</a>
        ))}
        <div className="nav-menu-lang">
          <button className="lang notranslate" onClick={() => { setGoogleLang('en'); closeMenu() }}>EN</button>
          <span className="lang-sep">/</span>
          <button className="lang notranslate" onClick={() => { setGoogleLang('it'); closeMenu() }}>IT</button>
        </div>
      </nav>
    </header>
  )
}
