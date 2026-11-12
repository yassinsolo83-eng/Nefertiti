// Languages of the site. English lives at the root (/about), Italian under /it (/it/about).
export const locales = ['en', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v)

/** '/about' -> '/it/about' for Italian; English paths stay as they are. External links are left alone. */
export function localePath(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (href === '/it' || href.startsWith('/it/') || href.startsWith('/it?') || href.startsWith('/it#')) return href
  if (href === '/') return '/it'
  if (href.startsWith('/#') || href.startsWith('/?')) return `/it${href.slice(1)}`
  return `/it${href}`
}

/** '/it/about' -> '/about' (the English path of any page) */
export function stripLocale(path: string): string {
  if (path === '/it') return '/'
  return path.startsWith('/it/') ? path.slice(3) : path
}

/** Locale of the page a path belongs to */
export function localeOfPath(path: string): Locale {
  return path === '/it' || path.startsWith('/it/') ? 'it' : 'en'
}
