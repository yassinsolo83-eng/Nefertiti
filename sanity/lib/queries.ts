import { client } from './client'
import {
  featuredDestinations as staticFeatured,
  moreDestinations as staticMore,
  experiences as staticExperiences,
  partners as staticPartners,
  faqs as staticFaqs,
  serviceTiers as staticTiers,
  copy as staticCopy,
  destinationDetails as staticDetails,
  steps as staticSteps,
  combinations as staticCombinations,
  socialLinks as staticSocialLinks,
  whatsappNumber as staticWhatsappNumber,
  whatsappMessage as staticWhatsappMessage,
  appointmentServices as staticAppointmentServices,
  sampleRetreats as staticSampleRetreats,
} from '@/lib/data'
import type { Destination, DestDetail, Retreat } from '@/lib/data'
import type { SeoFields, SeoPageKey } from '@/lib/seo'

// ── Revalidation: Sanity data refreshes every 60 seconds ──
const REVALIDATE = 60

// ── Helper: safe fetch with fallback ──
async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    const result = await client.fetch(query, {}, { next: { revalidate: REVALIDATE } })
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback
    return result
  } catch {
    return fallback
  }
}

// ── Helper: merge Sanity data with local images ──
function mergeDestImage(sanityDest: any, staticList: Destination[]): Destination {
  const staticMatch = staticList.find(d => d.id === sanityDest.id)
  return {
    id: sanityDest.id,
    title: sanityDest.title,
    tagline: sanityDest.tagline || staticMatch?.tagline || '',
    feeling: sanityDest.feeling || staticMatch?.feeling || '',
    image: sanityDest.image || staticMatch?.image || '',
    video: sanityDest.video || staticMatch?.video,
    desc: sanityDest.desc || staticMatch?.desc || '',
    experiences: sanityDest.experiences || staticMatch?.experiences || [],
    idealFor: sanityDest.idealFor || staticMatch?.idealFor || [],
    seo: sanityDest.seo || undefined,
  }
}

// ══════════════════════════════════════
//  DESTINATIONS
// ══════════════════════════════════════

const DEST_QUERY = `*[_type == "destination"] | order(order asc) {
  "id": slug.current,
  title, tagline, feeling, desc, video,
  "image": image.asset->url,
  featured, order,
  experiences, idealFor,
  overview, bestTime,
  "highlights": highlights[] {
    _key, title, desc,
    "image": image.asset->url
  },
  "parallaxImage": parallaxImage.asset->url,
  "seo": seo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url }
}`

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  if (all.length === 0) return staticFeatured

  const featured = all.filter(d => d.featured)
  if (featured.length === 0) return staticFeatured

  return featured.map(d => mergeDestImage(d, staticFeatured))
}

export async function getMoreDestinations(): Promise<Destination[]> {
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  if (all.length === 0) return staticMore

  const more = all.filter(d => !d.featured)
  if (more.length === 0) return staticMore

  return more.map(d => mergeDestImage(d, staticMore))
}

export async function getDestinationBySlug(slug: string): Promise<{ dest: Destination; detail: DestDetail } | null> {
  const all = await safeFetch<any[]>(DEST_QUERY, [])
  const dest = all.find(d => d.id === slug)

  if (!dest) {
    const staticDest = staticFeatured.find(d => d.id === slug)
    const staticDetail = staticDetails[slug]
    if (!staticDest || !staticDetail) return null
    return { dest: staticDest, detail: staticDetail }
  }

  const staticDest = staticFeatured.find(d => d.id === dest.id)
  const staticDetail = staticDetails[slug]

  const mergedDest = mergeDestImage(dest, staticFeatured)

  const detail: DestDetail = {
    overview: dest.overview || staticDetail?.overview || '',
    bestTime: dest.bestTime || staticDetail?.bestTime || '',
    parallaxImage: dest.parallaxImage || staticDetail?.parallaxImage || '',
    highlights: (dest.highlights || []).map((h: any, i: number) => ({
      title: h.title,
      desc: h.desc,
      image: h.image || staticDetail?.highlights?.[i]?.image || '',
    })),
  }

  // If no highlights from Sanity, use static
  if (detail.highlights.length === 0 && staticDetail) {
    detail.highlights = staticDetail.highlights
  }

  return { dest: mergedDest, detail }
}

// ══════════════════════════════════════
//  EXPERIENCES
// ══════════════════════════════════════

const EXP_QUERY = `*[_type == "experience"] | order(order asc) {
  title, text, "image": image.asset->url, order
}`

export async function getExperiences() {
  const result = await safeFetch<any[]>(EXP_QUERY, [])
  if (result.length === 0) return staticExperiences

  return result.map((exp, i) => ({
    title: exp.title,
    text: exp.text || '',
    image: exp.image || staticExperiences[i]?.image || '',
  }))
}

// ══════════════════════════════════════
//  PARTNERS
// ══════════════════════════════════════

const PARTNER_QUERY = `*[_type == "partner"] | order(order asc) {
  "id": slug.current,
  name, category, tagline, bio,
  "image": image.asset->url,
  services, location, website,
  instagram, x, tiktok, order,
  "seo": seo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url }
}`

export async function getPartners() {
  const result = await safeFetch<any[]>(PARTNER_QUERY, [])
  if (result.length === 0) return staticPartners

  return result.map((p, i) => ({
    id: p.id || `partner-${i + 1}`,
    name: p.name,
    category: p.category || '',
    tagline: p.tagline || '',
    image: p.image || staticPartners[i]?.image || '',
    bio: p.bio || '',
    services: p.services || [],
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

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) { question, answer }`

export async function getFaqs(): Promise<[string, string][]> {
  const result = await safeFetch<any[]>(FAQ_QUERY, [])
  if (result.length === 0) return staticFaqs
  return result.map(f => [f.question, f.answer])
}

// ══════════════════════════════════════
//  SERVICE TIERS
// ══════════════════════════════════════

const TIER_QUERY = `*[_type == "serviceTier"] | order(order asc) {
  name, price, description, features
}`

export async function getServiceTiers() {
  const result = await safeFetch<any[]>(TIER_QUERY, [])
  if (result.length === 0) return staticTiers
  return result.map((t, i) => ({
    num: staticTiers[i]?.num || `${i + 1}`,
    title: t.name,
    desc: t.description || '',
    items: t.features || [],
  }))
}

// ══════════════════════════════════════
//  SITE CONTENT (hero, vision, CTA, etc.)
// ══════════════════════════════════════

const SITE_QUERY = `*[_type == "siteContent"] { section, heading, subheading, body, buttonText, buttonLink }`

export async function getSiteContent() {
  const result = await safeFetch<any[]>(SITE_QUERY, [])
  if (result.length === 0) return staticCopy.en

  // Build a map from Sanity, overlay on static copy
  const map = new Map(result.map(r => [r.section, r]))
  const t = { ...staticCopy.en }

  const hero = map.get('hero')
  if (hero) {
    if (hero.heading) t.hero = hero.heading
    if (hero.body) t.heroText = hero.body
    if (hero.buttonText) t.explore = hero.buttonText
  }

  const vision = map.get('vision')
  if (vision) {
    if (vision.heading) t.visionTitle = vision.heading
    if (vision.body) t.visionText = vision.body
    if (vision.buttonText) t.philosophy = vision.buttonText
  }

  const dest = map.get('destinations')
  if (dest) {
    if (dest.heading) t.destinations = dest.heading
    if (dest.subheading) t.destinationLabel = dest.subheading
    if (dest.body) t.destinationText = dest.body
  }

  const cta = map.get('cta')
  if (cta) {
    if (cta.heading) t.cta = cta.heading
    if (cta.body) t.ctaText = cta.body
    if (cta.buttonText) t.contact = cta.buttonText
  }

  const founder = map.get('founder')
  if (founder) {
    if (founder.heading) t.founderName = founder.heading
    if (founder.subheading) t.founderRole = founder.subheading
    if (founder.body) t.founderText = founder.body
  }

  return t
}

// ══════════════════════════════════════
//  STEPS (How It Works)
// ══════════════════════════════════════

const STEP_QUERY = `*[_type == "step"] | order(order asc) { title, description, order }`

export async function getSteps(): Promise<[string, string][]> {
  const result = await safeFetch<any[]>(STEP_QUERY, [])
  if (result.length === 0) return staticSteps
  return result.map(s => [s.title, s.description])
}

// ══════════════════════════════════════
//  SITE SETTINGS (WhatsApp, socials, etc.)
// ══════════════════════════════════════

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  whatsappNumber, whatsappMessage,
  socialLinks[] { label, url },
  appointmentServices,
  combinations,
  contactEmail,
  "defaultSeo": defaultSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "aboutSeo": aboutSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "servicesSeo": servicesSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "experiencesSeo": experiencesSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "howItWorksSeo": howItWorksSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "partnersSeo": partnersSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "contactSeo": contactSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url },
  "retreatsSeo": retreatsSeo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url }
}`

export async function getSiteSettings() {
  const result = await safeFetch<any>(SETTINGS_QUERY, null)

  const whatsappNumber = result?.whatsappNumber || staticWhatsappNumber
  const whatsappMessage = result?.whatsappMessage || staticWhatsappMessage
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return {
    whatsappNumber,
    whatsappMessage,
    whatsappLink,
    socialLinks: result?.socialLinks?.length
      ? result.socialLinks.map((l: any) => [l.label, l.url])
      : staticSocialLinks,
    appointmentServices: result?.appointmentServices?.length
      ? result.appointmentServices
      : staticAppointmentServices,
    combinations: result?.combinations?.length
      ? result.combinations
      : staticCombinations,
    contactEmail: result?.contactEmail || 'hello@nefertitiretreats.com',
    seo: {
      default: result?.defaultSeo || null,
      about: result?.aboutSeo || null,
      services: result?.servicesSeo || null,
      experiences: result?.experiencesSeo || null,
      howItWorks: result?.howItWorksSeo || null,
      partners: result?.partnersSeo || null,
      contact: result?.contactSeo || null,
      retreats: result?.retreatsSeo || null,
    } as Record<SeoPageKey, SeoFields | null>,
  }
}


// ══════════════════════════════════════
//  RETREATS
// ══════════════════════════════════════

const RETREAT_QUERY = `*[_type == "retreat" && defined(slug.current)] | order(startDate asc) {
  "id": slug.current,
  title, status, startDate, endDate, summary, description, included,
  "image": coverImage.asset->url,
  "destination": destination->{ "id": slug.current, title },
  "itinerary": itinerary[] { day, title, description },
  "facilitators": facilitators[]->{ "id": slug.current, name, category, "image": image.asset->url },
  "seo": seo { metaTitle, metaDescription, noIndex, "ogImage": ogImage.asset->url }
}`

function normalizeRetreat(r: any): Retreat {
  return {
    id: r.id,
    title: r.title || '',
    image: r.image || '/retreats-hero.webp',
    status: r.status || 'open',
    startDate: r.startDate || '',
    endDate: r.endDate || r.startDate || '',
    destination: r.destination?.id ? r.destination : null,
    summary: r.summary || '',
    description: r.description || '',
    itinerary: (r.itinerary || []).filter((d: any) => d?.title || d?.description),
    included: (r.included || []).filter(Boolean),
    facilitators: (r.facilitators || []).filter((f: any) => f?.id),
    seo: r.seo || undefined,
  }
}

// Sample retreats show only until the first real retreat exists in Sanity
export async function getRetreats(): Promise<Retreat[]> {
  const result = await safeFetch<any[]>(RETREAT_QUERY, [])
  if (result.length === 0) return staticSampleRetreats
  return result.map(normalizeRetreat)
}

export async function getRetreatBySlug(slug: string): Promise<Retreat | null> {
  const all = await getRetreats()
  return all.find((r) => r.id === slug) || null
}
