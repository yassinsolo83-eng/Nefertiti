'use client'

import { createContext, useContext } from 'react'
import { SITE_EMAIL } from '@/lib/site'
import { pageTextDefaults, menuDefaults, type PageTexts } from '@/lib/data'

// Site-wide settings from Sanity that client components (e.g. the footer) need.
// Filled once in app/layout.tsx.
type SiteSettingsValue = {
  contactEmail: string
  socialLinks: [string, string][]
  whatsappLink?: string
  texts?: PageTexts
  menuItems?: [string, string][]
  /** Pages with nothing published yet (e.g. '/partners'): hidden from the menu and the home page */
  hiddenPaths?: string[]
}

const SiteSettingsContext = createContext<SiteSettingsValue>({
  contactEmail: SITE_EMAIL,
  socialLinks: [],
  texts: pageTextDefaults,
  menuItems: menuDefaults,
  hiddenPaths: [],
})

export function SiteSettingsProvider({ value, children }: { value: SiteSettingsValue; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
