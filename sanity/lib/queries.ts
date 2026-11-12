import { lang } from 'next/root-params'
import { AsyncLocalStorage } from 'node:async_hooks'
import { client } from './client'
import { localize } from '@/lib/localize'
import { isLocale, type Locale } from '@/lib/i18n'
import * as itData from '@/lib/data.it'
import {
  featuredDestinations as staticFeatured,
  moreDestinations as staticMore,
  experiences as staticExperiences,
  faqs as staticFaqs,
  serviceTiers as staticTiers,
  copy as staticCopy,
  destinationDetails as staticDetails,
  steps as staticSteps,
  combinations as staticCombinations,
  socialLinks as staticSocialLinks,
  whatsappMessage as staticWhatsappMessage,
  appointmentServices as staticAppointmentServices,
  stepImages as staticStepImages,
  pageImageDefaults,
  pageTextDefaults,
  menuDefaults,
  menuPages,
  homeStats as staticHomeStats,
} from '@/lib/data'
import type { Destination, DestDetail, Retreat, PageImages, PageTexts, HomeStat, Testimonial, Collaboration } from '@/lib/data'
import type { SeoFields, SeoPageKey } from '@/lib/seo'
import { PRE_CALL_FORM_QUERY, normalizePreCallForm, type PreCallForm } from '@/lib/preCallForm'

// ── Revalidation: Sanity data refreshes every 60 seconds ──
const REVALIDATE = 60

// ── Helper: light Sanity images ──
// Images are stored in Sanity at the size they were uploaded (often several MB from a phone).
// Every image URL is rewritten so Sanity's CDN serves a resized, compressed copy instead:
// at most 2000px wide (never enlarged), WebP/AVIF when the browser supports it, quality 75.
// The original file in the Studio is never changed.
const SANITY_IMAGE_PREFIX = 'https://cdn.sanity.io/images/'
const IMAGE_PARAMS = 'w=2000&fit=max&auto=format&q=75'

function optimizeImageUrls<T>(value: T): T {
  if (typeof value === 'string') {
    return (value.startsWith(SANITY_IMAGE_PREFIX) && !value.includes('?') ? `${value}?${IMAGE_PARAMS}` : value) as T
  }
  if (Array.isArray(value)) return value.map(optimizeImageUrls) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = optimizeImageUrls(v)
    return out as T
  }
  return value
}

// Language of the page being rendered; English when there is no page (e.g. the sitemap)
// Route handlers (like /api/search) have no page language: they set it explicitly here
export const localeOverride = new AsyncLocalStorage<Locale>()

export async function currentLocale(): Promise<Locale> {
  const forced = localeOverride.getStore()
  if (forced) return forced
  try {
    const l = await lang()
    return isLocale(l) ? l : 'en'
  } catch {
    return 'en'
  }
}

// For Italian pages: a text from the Studio that is still the built-in English default
// is shown in its built-in Italian version (Italian typed in the Studio always wins).
function tr<T>(locale: Locale, value: T, en: T | undefined, italian: T | undefined): T {
  if (locale === 'it' && italian !== undefined && en !== undefined && JSON.stringify(value) === JSON.stringify(en)) return italian
  return value
}

// ── Helper: safe fetch with fallback ──
async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    const result = await client.fetch(query, {}, { next: { revalidate: REVALIDATE } })
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback
    return optimizeImageUrls(localize(result, await currentLocale()))
  } catch {
    return fallback
  }
}

// ── Helper: merge Sanity data with local images ──
function staticDestinations(list: Destination[], locale: Locale): Destination[] {
  return locale === 'it' ? list.map((d) => ({ ...d, ...(itData.destinationsIt[d.id] || {}) })) : list
}

function mergeDestImage(sanityDest: any, staticList: Destination[], locale: Locale): Destination {
  const staticMatch = staticList.find(d => d.id === sanityDest.id)
  const italian = itData.destinationsIt[sanityDest.id]
  return {
    id: sanityDest.id,
    title: tr(locale, sanityDest.title, staticMatch?.title, italian?.title),
    tagline: tr(locale, sanityDest.tagline || staticMatch?.tagline || '', staticMatch?.tagline, italian?.tagline),
    feeling: tr(locale, sanityDest.feeling || staticMatch?.feeling || '', staticMatch?.feeling, italian?.feeling),
    image: sanityDest.image || staticMatch?.image || '',
    video: sanityDest.video || staticMatch?.video,
    desc: tr(locale, sanityDest.desc || staticMatch?.desc || '', staticMatch?.desc, italian?.desc),
    experiences: tr(locale, sanityDest.experiences || staticMatch?.experiences || [], staticMatch?.experiences, italian?.experiences),
    idealFor: tr(locale, sanityDest.idealFor || staticMatch?.idealFor || [], staticMatch?.idealFor, italian?.idealFor),
    seo: sanityDest.seo || undefined,
    lat: typeof sanityDest.lat === 'number' ? sanityDest.lat : undefined,
    lng: typeof sanityDest.lng === 'number' ? sanityDest.lng : undefined,
    fromCairo: sanityDest.fromCairo || undefined,
  }
}

// ══════════════════════════════════════
//  DESTINATIONS
// ══════════════════════════════════════

const DEST_QUERY = `*[_type == "destination"] | order(order asc) {
  "id": slug.current,
  title, tagline, feeling, desc, video,
  title_it, tagline_it, feeling_it, desc_it, experiences_it, idealFor_it, overview_it, bestTime_it, fromCairo_it,
  "image": image.asset->url,
  featured, order, lat, lng, fromCairo,
  experiences, idealFor,
  overview, bestTime,
  "highlights": highlights[] {
    _key, title, desc, title_it, desc_it,
    "image": image.asset->url
  },
  "parallaxImage": parallaxImage.asset->url,
  "seo": seo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url }
}`

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const locale = await currentLocale()
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  if (all.length === 0) return staticDestinations(staticFeatured, locale)

  const featured = all.filter(d => d.featured)
  if (featured.length === 0) return staticDestinations(staticFeatured, locale)

  return featured.map(d => mergeDestImage(d, staticFeatured, locale))
}

export async function getMoreDestinations(): Promise<Destination[]> {
  const locale = await currentLocale()
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  if (all.length === 0) return staticDestinations(staticMore, locale)

  const more = all.filter(d => !d.featured)
  if (more.length === 0) return staticDestinations(staticMore, locale)

  return more.map(d => mergeDestImage(d, staticMore, locale))
}

// Built-in detail text in the visitor's language
function staticDetail(slug: string, locale: Locale): DestDetail | undefined {
  const en = staticDetails[slug]
  const italian = itData.destinationDetailsIt[slug]
  if (!en || locale !== 'it' || !italian) return en
  return {
    ...en,
    overview: italian.overview,
    bestTime: italian.bestTime,
    highlights: en.highlights.map((h, i) => ({ ...h, ...(italian.highlights[i] || {}) })),
  }
}

export async function getDestinationBySlug(slug: string): Promise<{ dest: Destination; detail: DestDetail } | null> {
  const locale = await currentLocale()
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  const dest = all.find(d => d.id === slug)

  if (!dest) {
    const staticDest = staticDestinations(staticFeatured, locale).find(d => d.id === slug)
    const fallbackDetail = staticDetail(slug, locale)
    if (!staticDest || !fallbackDetail) return null
    return { dest: staticDest, detail: fallbackDetail }
  }

  const enDetail = staticDetails[slug]
  const itDetail = itData.destinationDetailsIt[slug]

  const mergedDest = mergeDestImage(dest, staticFeatured, locale)

  const detail: DestDetail = {
    overview: tr(locale, dest.overview || enDetail?.overview || '', enDetail?.overview, itDetail?.overview),
    bestTime: tr(locale, dest.bestTime || enDetail?.bestTime || '', enDetail?.bestTime, itDetail?.bestTime),
    parallaxImage: dest.parallaxImage || enDetail?.parallaxImage || '',
    highlights: (dest.highlights || []).map((h: any, i: number) => ({
      title: tr(locale, h.title, enDetail?.highlights?.[i]?.title, itDetail?.highlights?.[i]?.title),
      desc: tr(locale, h.desc, enDetail?.highlights?.[i]?.desc, itDetail?.highlights?.[i]?.desc),
      image: h.image || enDetail?.highlights?.[i]?.image || '',
    })),
  }

  // If no highlights from Sanity, use static
  const fallback = staticDetail(slug, locale)
  if (detail.highlights.length === 0 && fallback) {
    detail.highlights = fallback.highlights
  }

  return { dest: mergedDest, detail }
}

// ══════════════════════════════════════
//  EXPERIENCES
// ══════════════════════════════════════

const EXP_QUERY = `*[_type == "experience"] | order(order asc) {
  title, text, title_it, text_it, "image": image.asset->url, order
}`

export async function getExperiences() {
  const locale = await currentLocale()
  const result = await safeFetch<any[]>(EXP_QUERY, [])
  if (result.length === 0) {
    return locale === 'it' ? staticExperiences.map((e, i) => ({ ...e, ...(itData.experiencesIt[i] || {}) })) : staticExperiences
  }

  // An experience without its own image falls back to the built-in image with the same title
  const byTitle = new Map(staticExperiences.map((e) => [e.title.toLowerCase(), e.image]))
  return result.map((exp, i) => {
    const idx = staticExperiences.findIndex((e) => e.title.toLowerCase() === String(exp.title || '').toLowerCase())
    const staticMatch = idx >= 0 ? staticExperiences[idx] : undefined
    const italian = idx >= 0 ? itData.experiencesIt[idx] : undefined
    return {
    title: tr(locale, exp.title, staticMatch?.title, italian?.title),
    text: tr(locale, exp.text || '', staticMatch?.text, italian?.text),
    image:
      exp.image ||
      byTitle.get(String(exp.title || '').toLowerCase()) ||
      staticExperiences[i % staticExperiences.length].image,
    }
  })
}

// ══════════════════════════════════════
//  PARTNERS
// ══════════════════════════════════════

const PARTNER_QUERY = `*[_type == "partner"] | order(order asc) {
  "id": slug.current,
  name, category, tagline, bio,
  category_it, tagline_it, bio_it, services_it, location_it,
  image,
  services, showServices, location, website,
  instagram, x, tiktok, order,
  "seo": seo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url }
}`

// ══════════════════════════════════════
//  COLLABORATIONS (companies and brands)
// ══════════════════════════════════════

const COLLAB_QUERY = `*[_type == "collaboration"] | order(order asc) {
  "id": _id,
  name, logo, country, description, country_it, description_it, website, order
}`

// Collaborations come only from Sanity — there is no built-in fallback list
export async function getCollaborations(): Promise<Collaboration[]> {
  const result = await safeFetch<any[]>(COLLAB_QUERY, [])
  return result
    .filter((c) => c?.name)
    .map((c) => ({
      id: String(c.id),
      name: c.name,
      logo: c.logo?.asset ? c.logo : null,
      country: c.country || '',
      description: c.description || '',
      website: c.website || '',
    }))
}

export async function getPartners() {
  const result = await safeFetch<any[]>(PARTNER_QUERY, [])

  // Partners come only from Sanity — there is no built-in sample list
  return result.map((p, i) => ({
    id: p.id || `partner-${i + 1}`,
    name: p.name,
    category: p.category || '',
    tagline: p.tagline || '',
    image: p.image || '',
    bio: p.bio || '',
    services: p.services || [],
    showServices: p.showServices !== false,
    location: p.location || '',
    website: p.website || '',
    instagram: p.instagram || '',
    x: p.x || '',
    tiktok: p.tiktok || '',
    seo: p.seo || undefined,
  }))
}

// ══════════════════════════════════════
//  FAQs
// ══════════════════════════════════════

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) { question, answer, question_it, answer_it }`

export async function getFaqs(): Promise<[string, string][]> {
  const locale = await currentLocale()
  const result = await safeFetch<any[]>(FAQ_QUERY, [])
  if (result.length === 0) return locale === 'it' ? itData.faqsIt : staticFaqs
  return result.map((f) => {
    const idx = staticFaqs.findIndex(([q]) => q === f.question)
    const italian = idx >= 0 ? itData.faqsIt[idx] : undefined
    return [tr(locale, f.question, staticFaqs[idx]?.[0], italian?.[0]), tr(locale, f.answer, staticFaqs[idx]?.[1], italian?.[1])]
  })
}

// ══════════════════════════════════════
//  SERVICE TIERS
// ══════════════════════════════════════

const TIER_QUERY = `*[_type == "serviceTier"] | order(order asc) {
  name, price, description, features, name_it, description_it, features_it, "image": image.asset->url
}`

// Compare titles loosely: ignore case and a leading number like "I." / "2."
// Remove a leading number like "I. " / "2. " — the page already shows the tier number
function stripNumber(v: unknown) {
  return String(v || '').trim().replace(/^([ivx]+|\d+)\s*[.\-–—:)]\s*/i, '')
}

function sameTitle(a: unknown, b: unknown) {
  return stripNumber(a).toLowerCase() === stripNumber(b).toLowerCase()
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export type ServiceTier = { num: string; title: string; desc: string; items: string[]; image: string }

export async function getServiceTiers(): Promise<ServiceTier[]> {
  const locale = await currentLocale()
  const result = await safeFetch<any[]>(TIER_QUERY, [])
  if (result.length === 0) {
    return locale === 'it' ? staticTiers.map((t, i) => ({ ...t, ...(itData.serviceTiersIt[i] || {}) })) : staticTiers
  }
  return result.map((t, i) => {
    const idx = staticTiers.findIndex((x) => sameTitle(x.title, t.name))
    const staticMatch = idx >= 0 ? staticTiers[idx] : undefined
    const italian = idx >= 0 ? itData.serviceTiersIt[idx] : undefined
    return {
    num: ROMAN[i] || `${i + 1}`,
    title: tr(locale, stripNumber(t.name), staticMatch?.title, italian?.title),
    desc: tr(locale, t.description || '', staticMatch?.desc, italian?.desc),
    items: tr(locale, t.features || [], staticMatch?.items, italian?.items),
    image:
      t.image ||
      staticTiers.find((x) => sameTitle(x.title, t.name))?.image ||
      staticTiers[i % staticTiers.length].image,
    }
  })
}

// ══════════════════════════════════════
//  SITE CONTENT (hero, vision, CTA, etc.)
// ══════════════════════════════════════

const SITE_QUERY = `*[_type == "siteContent"] { section, heading, subheading, body, buttonText, buttonLink, heading_it, subheading_it, body_it, buttonText_it }`

export async function getSiteContent() {
  const locale = await currentLocale()
  const base = staticCopy[locale] as typeof staticCopy.en
  const result = await safeFetch<any[]>(SITE_QUERY, [])
  if (result.length === 0) return base

  // A Studio text overrides the built-in one, unless it is still the built-in English text
  const t = { ...base }
  const set = (key: keyof typeof staticCopy.en, value: unknown) => {
    if (typeof value !== 'string' || !value) return
    if (locale === 'it' && value === staticCopy.en[key]) return
    ;(t as Record<string, unknown>)[key] = value
  }
  const map = new Map(result.map((r) => [r.section, r]))

  const hero = map.get('hero')
  if (hero) { set('hero', hero.heading); set('heroText', hero.body); set('explore', hero.buttonText) }

  const vision = map.get('vision')
  if (vision) { set('visionTitle', vision.heading); set('visionText', vision.body); set('philosophy', vision.buttonText) }

  const dest = map.get('destinations')
  if (dest) { set('destinations', dest.heading); set('destinationLabel', dest.subheading); set('destinationText', dest.body) }

  const cta = map.get('cta')
  if (cta) { set('cta', cta.heading); set('ctaText', cta.body); set('contact', cta.buttonText) }

  const founder = map.get('founder')
  if (founder) { set('founderName', founder.heading); set('founderRole', founder.subheading); set('founderText', founder.body) }

  return t
}

// ══════════════════════════════════════
//  STEPS (How It Works)
// ══════════════════════════════════════

const STEP_QUERY = `*[_type == "step"] | order(order asc) { title, description, title_it, description_it, order, "image": image.asset->url }`

export type Step = { title: string; description: string; image: string }

export async function getSteps(): Promise<Step[]> {
  const locale = await currentLocale()
  const result = await safeFetch<any[]>(STEP_QUERY, [])
  const fallbackImage = (i: number) => staticStepImages[i % staticStepImages.length]
  if (result.length === 0) {
    const list = locale === 'it' ? itData.stepsIt : staticSteps
    return list.map(([title, description], i) => ({ title, description, image: fallbackImage(i) }))
  }
  const byTitle = new Map(staticSteps.map(([title], i) => [title.toLowerCase(), staticStepImages[i]]))
  return result.map((s, i) => {
    const idx = staticSteps.findIndex(([title]) => title.toLowerCase() === String(s.title || '').toLowerCase())
    const italian = idx >= 0 ? itData.stepsIt[idx] : undefined
    return {
      title: tr(locale, s.title || '', staticSteps[idx]?.[0], italian?.[0]),
      description: tr(locale, s.description || '', staticSteps[idx]?.[1], italian?.[1]),
      image: s.image || byTitle.get(String(s.title || '').toLowerCase()) || fallbackImage(i),
    }
  })
}

// ══════════════════════════════════════
//  PAGE IMAGES (banners and fixed photos on each page)
// ══════════════════════════════════════

const PAGE_IMAGES_QUERY = `*[_id == "pageImages"][0] {
  "aboutHero": aboutHero.asset->url,
  "founderPhoto": founderPhoto.asset->url,
  "servicesHero": servicesHero.asset->url,
  "experiencesHero": experiencesHero.asset->url,
  "howItWorksHero": howItWorksHero.asset->url,
  "retreatsHero": retreatsHero.asset->url,
  "contactHero": contactHero.asset->url,
  "contactSide": contactSide.asset->url,
  "contactFaq": contactFaq.asset->url
}`

// Any image not set in the Studio keeps the original one
export async function getPageImages(): Promise<PageImages> {
  const result = await safeFetch<Partial<PageImages> | null>(PAGE_IMAGES_QUERY, null)
  const merged = { ...pageImageDefaults }
  if (result) {
    for (const key of Object.keys(merged) as (keyof PageImages)[]) {
      if (result[key]) merged[key] = result[key] as string
    }
  }
  return merged
}

// ══════════════════════════════════════
//  SITE SETTINGS (WhatsApp, socials, etc.)
// ══════════════════════════════════════

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  whatsappNumber, whatsappMessage, whatsappMessage_it, notifyWhatsappNumber,
  socialLinks[] { label, url },
  menuItems[] { label, label_it, page },
  appointmentServices, appointmentServices_it,
  combinations, combinations_it,
  contactEmail,
  showRetreatBar,
  "defaultSeo": defaultSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "aboutSeo": aboutSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "servicesSeo": servicesSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "experiencesSeo": experiencesSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "howItWorksSeo": howItWorksSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "partnersSeo": partnersSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "contactSeo": contactSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "retreatsSeo": retreatsSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "destinationsSeo": destinationsSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url },
  "preCallSeo": preCallSeo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url }
}`

export async function getSiteSettings() {
  const locale = await currentLocale()
  const result = await safeFetch<any>(SETTINGS_QUERY, null)

  // Keep digits only: wa.me links break with "+", spaces or dashes (e.g. "+39 331 448 6876")
  const whatsappNumber = String(result?.whatsappNumber || '').replace(/\D/g, '')
  const whatsappMessage = tr(locale, result?.whatsappMessage || staticWhatsappMessage, staticWhatsappMessage, itData.whatsappMessageIt)
  // No number set in the Studio: no link, so the WhatsApp buttons are hidden instead of pointing nowhere
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}` : ''

  // Menu names: a Studio name that is still the built-in English one is shown in Italian
  const menuName = (label: string, href: string) =>
    locale === 'it' && menuDefaults.some(([l, h]) => h === href && l === label) ? itData.menuLabelsIt[href] || label : label
  const studioMenu = ((result?.menuItems || []) as any[])
    .filter((m) => m?.label && menuPages[m.page])
    .map((m) => [menuName(m.label, menuPages[m.page]), menuPages[m.page]] as [string, string])
  const menuItems: [string, string][] = studioMenu.length
    ? studioMenu
    : menuDefaults.map(([label, href]) => [locale === 'it' ? itData.menuLabelsIt[href] || label : label, href])

  return {
    whatsappNumber,
    whatsappMessage,
    whatsappLink,
    socialLinks: result?.socialLinks?.length
      ? result.socialLinks.map((l: any) => [l.label, l.url])
      : staticSocialLinks,
    menuItems,
    appointmentServices: result?.appointmentServices?.length
      ? tr(locale, result.appointmentServices, staticAppointmentServices, itData.appointmentServicesIt)
      : locale === 'it' ? itData.appointmentServicesIt : staticAppointmentServices,
    combinations: result?.combinations?.length
      ? tr(locale, result.combinations, staticCombinations, itData.combinationsIt)
      : locale === 'it' ? itData.combinationsIt : staticCombinations,
    contactEmail: result?.contactEmail || 'hello@nefertitiretreats.com',
    showRetreatBar: result?.showRetreatBar !== false,
    seo: {
      default: result?.defaultSeo || null,
      about: result?.aboutSeo || null,
      services: result?.servicesSeo || null,
      experiences: result?.experiencesSeo || null,
      howItWorks: result?.howItWorksSeo || null,
      partners: result?.partnersSeo || null,
      contact: result?.contactSeo || null,
      retreats: result?.retreatsSeo || null,
      destinations: result?.destinationsSeo || null,
      preCall: result?.preCallSeo || null,
    } as Record<SeoPageKey, SeoFields | null>,
  }
}


// ══════════════════════════════════════
//  RETREATS
// ══════════════════════════════════════

const RETREAT_QUERY = `*[_type == "retreat" && defined(slug.current)] | order(startDate asc) {
  "id": slug.current,
  title, status, startDate, endDate, summary, description, included, highlights,
  title_it, summary_it, description_it, included_it, highlights_it,
  "image": coverImage.asset->url,
  "gallery": gallery[].asset->url,
  "destination": destination->{ "id": slug.current, title, title_it },
  "itinerary": itinerary[] { day, title, description, day_it, title_it, description_it },
  "facilitators": facilitators[]->{ "id": slug.current, name, category, category_it, "image": image.asset->url },
  "seo": seo { metaTitle, metaDescription, metaTitle_it, metaDescription_it, noIndex, "ogImage": ogImage.asset->url }
}`

function normalizeRetreat(r: any): Retreat {
  return {
    id: r.id,
    title: r.title || '',
    image: r.image || '/retreats-hero.webp',
    gallery: (r.gallery || []).filter((u: any) => typeof u === 'string' && u),
    status: r.status || 'open',
    startDate: r.startDate || '',
    endDate: r.endDate || r.startDate || '',
    destination: r.destination?.id ? r.destination : null,
    summary: r.summary || '',
    description: r.description || '',
    itinerary: (r.itinerary || []).filter((d: any) => d?.title || d?.description),
    included: (r.included || []).filter(Boolean),
    highlights: (r.highlights || []).filter(Boolean),
    facilitators: (r.facilitators || []).filter((f: any) => f?.id),
    seo: r.seo || undefined,
  }
}

// Retreats come only from Sanity — there is no built-in fallback list
export async function getRetreats(): Promise<Retreat[]> {
  const result = await safeFetch<any[]>(RETREAT_QUERY, [])
  return result.map(normalizeRetreat)
}

export async function getRetreatBySlug(slug: string): Promise<Retreat | null> {
  const all = await getRetreats()
  return all.find((r) => r.id === slug) || null
}

// ══════════════════════════════════════
//  PRE-CALL FORM
// ══════════════════════════════════════

// The notification email stays on the server: it is removed before reaching the page
export async function getPreCallForm(): Promise<PreCallForm> {
  const locale = await currentLocale()
  const result = await safeFetch<any>(PRE_CALL_FORM_QUERY, null)
  const form = normalizePreCallForm(result, locale)
  return { ...form, notificationEmail: undefined }
}

// ══════════════════════════════════════
//  HOME NUMBERS (Why Egypt)
// ══════════════════════════════════════

const STATS_QUERY = `*[_type == "siteContent" && section == "vision"][0].stats[]{ value, label, label_it, autoDestinations }`

// destinationCount fills the number marked "count destinations automatically"
export async function getHomeStats(destinationCount: number): Promise<HomeStat[]> {
  const locale = await currentLocale()
  const result = await safeFetch<any[]>(STATS_QUERY, [])
  const list: HomeStat[] = (result || [])
    .filter((st) => st && (st.label || st.value))
    .map((st) => ({ value: st.value || '', label: st.label || '', autoDestinations: !!st.autoDestinations }))
  const stats = (list.length ? list : staticHomeStats).map((st) => {
    const idx = staticHomeStats.findIndex((x) => x.label === st.label)
    return { ...st, label: tr(locale, st.label, staticHomeStats[idx]?.label, itData.homeStatLabelsIt[idx]) }
  })
  return stats
    .map((st) => (st.autoDestinations ? { ...st, value: String(destinationCount) } : st))
    .filter((st) => st.value)
}

// ══════════════════════════════════════
//  TESTIMONIALS (Sanity only)
// ══════════════════════════════════════

const TESTIMONIAL_QUERY = `*[_type == "testimonial" && defined(quote) && defined(name)] | order(order asc, _createdAt asc) {
  "id": _id, quote, name, role, quote_it, role_it, "image": image.asset->url
}`

export async function getTestimonials(): Promise<Testimonial[]> {
  const result = await safeFetch<any[]>(TESTIMONIAL_QUERY, [])
  return result.map((t) => ({
    id: t.id,
    quote: t.quote || '',
    name: t.name || '',
    role: t.role || '',
    image: t.image || '',
  }))
}

// ══════════════════════════════════════
//  PAGE TEXTS (taglines, banners, footer)
// ══════════════════════════════════════

const PAGE_TEXTS_QUERY = `*[_id == "pageTexts"][0] { ${Object.keys(pageTextDefaults).flatMap((k) => [k, `${k}_it`]).join(', ')} }`

// Any text not set in the Studio keeps the original one
export async function getPageTexts(): Promise<PageTexts> {
  const locale = await currentLocale()
  const result = await safeFetch<Partial<PageTexts> | null>(PAGE_TEXTS_QUERY, null)
  const merged = { ...(locale === 'it' ? itData.pageTextDefaultsIt : pageTextDefaults) }
  if (result) {
    for (const key of Object.keys(merged) as (keyof PageTexts)[]) {
      const v = typeof result[key] === 'string' ? (result[key] as string).trim() : ''
      if (v && !(locale === 'it' && v === pageTextDefaults[key])) merged[key] = v
    }
  }
  return merged
}
