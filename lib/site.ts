// Central SEO config. Set NEXT_PUBLIC_SITE_URL in Vercel once the custom domain is live
// (e.g. https://www.nefertitiretreats.com) — no trailing slash.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nefertiti-mu.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'Nefertiti Retreats'
export const SITE_EMAIL = 'hello@nefertitiretreats.com'
export const DEFAULT_DESCRIPTION =
  'Nefertiti produces luxury wellness retreats in Egypt for coaches, facilitators and retreat leaders — from the Pyramids of Giza and Luxor to the Red Sea, Siwa and the desert.'
// Next.js replaces (does not merge) a parent's openGraph object, so pages that set
// their own openGraph must include the image again.
export const DEFAULT_OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Nefertiti Luxury Retreat Producer' }
