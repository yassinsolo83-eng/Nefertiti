'use client'

import { createContext, useContext } from 'react'
import { SITE_EMAIL } from '@/lib/site'

// Site-wide settings from Sanity that client components (e.g. the footer) need.
// Filled once in app/layout.tsx.
type SiteSettingsValue = {
  contactEmail: string
  socialLinks: [string, string][]
}

const SiteSettingsContext = createContext<SiteSettingsValue>({
  contactEmail: SITE_EMAIL,
  socialLinks: [],
})

export function SiteSettingsProvider({ value, children }: { value: SiteSettingsValue; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
