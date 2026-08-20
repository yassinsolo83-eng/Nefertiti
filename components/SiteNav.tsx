'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { images } from '@/lib/data'
import { setGoogleLang } from '@/hooks/useGoogleTranslate'

type NavItem = [label: string, href: string]

const NAV_ITEMS: NavItem[] = [
  ['About', '/#about'],
  ['Why Egypt', '/#vision'],
  ['Destinations', '/#destinations'],
  ['Experiences', '/#experiences'],
  ['Services', '/#services'],
  ['How It Works', '/#process'],
  ['Appointment', '/appointment'],
  ['Contact', '/contact'],
]

type Props = {
  /** When true the nav paints its solid background permanently (inner pages). */
  solid?: boolean
  /** When true the nav is temporarily hidden (home-page intro). */
  hidden?: boolean
  /** When true the nav sits transparent over a hero and turns solid on scroll. */
  scrolled?: boolean
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

export default function SiteNav({ solid, hidden, scrolled, onAnchor, onBrand }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  const isScrolled = solid || scrolled

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
      className={`site-nav ${isScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''} ${hidden ? 'nav-hidden' : ''}`}
    >
      <a href="/" className="brand" onClick={handleBrand}>
        <span className="brand-badge notranslate">EGYPT</span>
        <img src={images.logoDark} alt="Nefertiti Luxury Retreat Producer" />
      </a>
      <nav className={`site-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {NAV_ITEMS.map(([item, href]) => (
          <a key={item} href={href} onClick={(e) => handleClick(e, href)}>{item}</a>
        ))}
      </nav>
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
