import type { Metadata } from 'next'
import { lang } from 'next/root-params'
import { SITE_NAME, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'
import { isLocale, localePath, type Locale } from '@/lib/i18n'

export type SeoFields = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: string | null
  noIndex?: boolean | null
}

export type SeoPageKey =
  | 'default'
  | 'about'
  | 'services'
  | 'experiences'
  | 'howItWorks'
  | 'partners'
  | 'contact'
  | 'retreats'
  | 'destinations'
  | 'preCall'

type BuildOptions = {
  seo?: SeoFields | null            // values from Sanity (win when filled)
  fallbackSeo?: SeoFields | null    // site-wide default from Sanity (image only)
  title: string                     // code fallback title
  description: string               // code fallback description
  path: string                      // e.g. '/about'
  image?: string                    // page-specific fallback image (e.g. destination cover)
  imageAlt?: string
  absoluteTitle?: boolean           // skip the "| Nefertiti Retreats" template
  type?: 'website' | 'profile'
}

// Sanity CDN images can be cropped on the fly to the ideal share size
function shareImageUrl(url: string) {
  if (url.includes('cdn.sanity.io')) {
    // Already cropped to the share size around the Studio hotspot: keep it as is
    if (url.includes('rect=')) return url
    // Drop the page-size parameters first, then crop to the share size
    return `${url.split('?')[0]}?w=1200&h=630&fit=crop&auto=format`
  }
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

// Both language versions of a page point at each other so search engines serve the right one
export function languageAlternates(path: string) {
  return {
    en: `${SITE_URL}${path}`,
    it: `${SITE_URL}${localePath('it', path)}`,
    'x-default': `${SITE_URL}${path}`,
  }
}

export async function buildMetadata(o: BuildOptions): Promise<Metadata> {
  const current = await lang()
  const locale: Locale = isLocale(current) ? current : 'en'
  const localized = localePath(locale, o.path)
  const customTitle = o.seo?.metaTitle?.trim()
  const description = (o.seo?.metaDescription?.trim() || o.description).slice(0, 170)

  const title: Metadata['title'] = customTitle
    ? { absolute: customTitle }
    : o.absoluteTitle
      ? { absolute: o.title }
      : o.title
  const shareTitle = customTitle || (o.absoluteTitle ? o.title : `${o.title} | ${SITE_NAME}`)

  const imageSrc = o.seo?.ogImage || o.image || o.fallbackSeo?.ogImage
  const images = imageSrc
    ? [{ url: shareImageUrl(imageSrc), width: 1200, height: 630, alt: o.imageAlt || shareTitle }]
    : [DEFAULT_OG_IMAGE]

  return {
    title,
    description,
    alternates: { canonical: localized, languages: languageAlternates(o.path) },
    robots: o.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: shareTitle,
      description,
      url: localized,
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      type: o.type || 'website',
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: images.map((i) => i.url),
    },
  }
}
