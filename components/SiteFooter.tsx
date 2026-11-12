'use client'

import BrandLogo from '@/components/BrandLogo'
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useSiteSettings } from '@/components/SiteSettingsProvider'
import { BrandBand } from '@/components/Motif'
import Link from '@/components/LocLink'
import { useUi } from '@/components/LocaleProvider'

const NAV_DEFAULT = [
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
  const t = useUi().footer
  const { contactEmail, socialLinks, whatsappLink, texts, menuItems } = useSiteSettings()
  const NAV = menuItems && menuItems.length ? menuItems : NAV_DEFAULT
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
          <p className="footer-label">{t.navigate}</p>
          {NAV.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </div>
        <div>
          <p className="footer-label">{t.contact}</p>
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
        <span>© {new Date().getFullYear()} {t.rights}</span>
        <span className="footer-legal">
          <Link href="/terms">{t.terms}</Link>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/privacy#cookies">{t.cookies}</Link>
        </span>
        <span>{texts?.footerSignoff}</span>
      </div>
    </footer>
  )
}
