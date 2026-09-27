import type { Metadata } from 'next'
import { SITE_NAME, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

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
    return `${url}${url.includes('?') ? '&' : '?'}w=1200&h=630&fit=crop&auto=format`
  }
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

export function buildMetadata(o: BuildOptions): Metadata {
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
    alternates: { canonical: o.path },
    robots: o.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: shareTitle,
      description,
      url: o.path,
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
