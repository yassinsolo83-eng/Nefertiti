'use client'

import { Camera, Mail, MapPin } from 'lucide-react'
import { images } from '@/lib/data'

const NAV = [
  ['About', '/#about'],
  ['Why Egypt', '/#vision'],
  ['Destinations', '/#destinations'],
  ['Experiences', '/#experiences'],
  ['Services', '/#services'],
  ['How It Works', '/#process'],
  ['Contact', '/contact'],
]

export default function SiteFooter() {
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
          <a href="mailto:hello@nefertitiretreats.com"><Mail size={14} /> hello@nefertitiretreats.com</a>
          <p><MapPin size={14} /> Cairo · Siwa · Everywhere</p>
          <a href="/contact"><Camera size={14} /> Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nefertiti Retreats</span>
        <span className="notranslate">Translations powered by Google · Traduzioni offerte da Google</span>
        <span>Made with presence</span>
      </div>
    </footer>
  )
}
