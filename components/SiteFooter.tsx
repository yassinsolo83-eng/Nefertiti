'use client'

import BrandLogo from '@/components/BrandLogo'
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useSiteSettings } from '@/components/SiteSettingsProvider'
import { BrandBand } from '@/components/Motif'
import Link from 'next/link'

const NAV = [
  ['About', '/about'],
  ['Why Egypt', '/#vision'],
  ['Destinations', '/destinations'],
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
  const { contactEmail, socialLinks, whatsappLink, texts } = useSiteSettings()
  const socials = socialLinks.filter(([, url]) => isProfileLink(url))

  return (
    <footer>
      <BrandBand className="footer-band" />
      <div className="footer-brand">
        <BrandLogo className="brand-logo-footer" />
        <p className="footer-tagline">{texts?.footerTagline}</p>
        <p>{texts?.footerLine1}</p>
        <p>{texts?.footerLine2}</p>
      </div>
      <div className="footer-links">
        <div>
          <p className="footer-label">Navigate</p>
          {NAV.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <a href={`mailto:${contactEmail}`}><Mail size={14} /> {contactEmail}</a>
          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> WhatsApp</a>
          )}
          <p><MapPin size={14} /> {texts?.footerLocation}</p>
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
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/privacy#cookies">Cookies</Link>
        </span>
        <span className="notranslate">Translations powered by Google · Traduzioni offerte da Google</span>
        <span>{texts?.footerSignoff}</span>
      </div>
    </footer>
  )
}
