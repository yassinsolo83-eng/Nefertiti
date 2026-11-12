import type { Locale } from '@/lib/i18n'

const isEmpty = (v: unknown) =>
  v == null || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0)

/**
 * Sanity keeps the Italian text of a field next to the English one (title -> title_it).
 * For Italian pages the filled Italian value replaces the English one; an empty Italian field
 * falls back to English. The "_it" keys never reach the page.
 */
export function localize<T>(value: T, locale: Locale): T {
  if (Array.isArray(value)) return value.map((v) => localize(v, locale)) as T
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(src)) {
      if (k.endsWith('_it')) continue
      out[k] = localize(v, locale)
    }
    if (locale === 'it') {
      for (const [k, v] of Object.entries(src)) {
        if (k.endsWith('_it') && !isEmpty(v)) out[k.slice(0, -3)] = localize(v, locale)
      }
    }
    return out as T
  }
  return value
}
