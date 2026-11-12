'use client'

import { createContext, useContext } from 'react'
import { defaultLocale, localePath, type Locale } from '@/lib/i18n'
import { getUi } from '@/lib/ui'

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

/** Returns a function that turns '/about' into the right path for the current language */
export function useLocalePath() {
  const locale = useLocale()
  return (href: string) => localePath(locale, href)
}

/** The fixed texts of the site in the visitor's language */
export function useUi() {
  return getUi(useLocale())
}
