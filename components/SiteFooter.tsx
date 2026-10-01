'use client'

import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { images } from '@/lib/data'
import { useSiteSettings } from '@/components/SiteSettingsProvider'

const NAV = [
  ['About', '/about'],
  ['Why Egypt', '/#vision'],
  ['Destinations', '/#destinations'],
  ['Retreats', '/retreats'],
  ['Experiences', '/experiences'],
  ['Services', '/services'],
  ['Partners', '/partners'],
  ['How It Works', '/how-it-works'],
  ['Contact', '/contact'],
]

// Only real profile links (e.g. https://instagram.com/nefertiti), not bare placeholders
function isProfileLink(url: string) {
  try {
    return new URL(url).pathname.replace(/\/$/, '').length > 1
  } catch {
    return false
  }
}

export default function SiteFooter() {
  const { contactEmail, socialLinks } = useSiteSettings()
  const socials = socialLinks.filter(([, url]) => isProfileLink(url))

  return (
    <footer>
      <div className="footer-brand">
        <img src={images.logo} alt="Nefertiti Luxury Retreat Producer" />
        <p>You lead the transformation. We create the experience.</p>
        <p>Based between Egypt &amp; Italy.</p>
      </div>
      <div className="footer-links">
        <div>
          <p className="footer-label">Navigate</p>
          {NAV.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <a href={`mailto:${contactEmail}`}><Mail size={14} /> {contactEmail}</a>
          <p><MapPin size={14} /> Cairo · Siwa · Everywhere</p>
          {socials.map(([label, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight size={14} /> {label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Nefertiti Retreats</span>
        <span className="footer-legal">
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="/privacy">Privacy Policy</a>
        </span>
        <span className="notranslate">Translations powered by Google · Traduzioni offerte da Google</span>
        <span>Made with presence</span>
      </div>
    </footer>
  )
}
