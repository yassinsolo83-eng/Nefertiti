import { NextResponse } from 'next/server'
import {
  getFeaturedDestinations,
  getMoreDestinations,
  getDestinationBySlug,
  getExperiences,
  getPartners,
  getCollaborations,
  getFaqs,
  getServiceTiers,
  getSteps,
  getRetreats,
  getPageTexts,
  getSiteContent,
  getSiteSettings,
} from '@/sanity/lib/queries'
import { menuDefaults } from '@/lib/data'

// Site-wide search: builds one index of every text on the site (pages, destinations,
// retreats, experiences, partners, services, steps, FAQs and page texts) and matches
// the visitor's words against it.

type Entry = { type: string; title: string; href: string; text: string }
export type SearchResult = { type: string; title: string; href: string; snippet: string }

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/destinations': 'Destinations',
  '/retreats': 'Retreats',
  '/experiences': 'Experiences',
  '/services': 'Services',
  '/partners': 'Partners',
  '/collaborations': 'Collaborations',
  '/how-it-works': 'How It Works',
  '/contact': 'Contact',
  '/pre-call': 'Book a call',
}

function pageForTextKey(key: string): string | null {
  if (key.startsWith('footer') || key === 'navButton') return null
  if (key.startsWith('howItWorks') || key === 'labelHowItWorks') return '/how-it-works'
  if (key.startsWith('experiences')) return '/experiences'
  if (key.startsWith('services')) return '/services'
  if (key.startsWith('about')) return '/about'
  if (key.startsWith('partners')) return '/partners'
  if (key.startsWith('collaborations')) return '/collaborations'
  if (key.startsWith('retreats') || key === 'labelRetreats' || key === 'taglineRetreats') return '/retreats'
  if (key.startsWith('destPage') || key === 'taglineDestinations') return '/destinations'
  return '/'
}

function homeHrefForCopyKey(key: string): string {
  if (key.startsWith('founder')) return '/about'
  if (key.startsWith('dest')) return '/#destinations'
  if (key.startsWith('vision') || key === 'philosophy') return '/#vision'
  return '/'
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : '')).filter(Boolean) : [])

async function buildIndex(): Promise<Entry[]> {
  const entries: Entry[] = []
  const add = (type: string, title: string, href: string, ...parts: unknown[]) => {
    const text = parts.flatMap((p) => (Array.isArray(p) ? list(p) : [str(p)])).filter(Boolean).join(' · ')
    if (title || text) entries.push({ type, title: title || text.slice(0, 60), href, text })
  }

  const [featured, more, experiences, partners, collaborations, faqs, tiers, steps, retreats, pageTexts, siteContent, settings] =
    await Promise.all([
      getFeaturedDestinations(),
      getMoreDestinations(),
      getExperiences(),
      getPartners(),
      getCollaborations(),
      getFaqs(),
      getServiceTiers(),
      getSteps(),
      getRetreats(),
      getPageTexts(),
      getSiteContent(),
      getSiteSettings(),
    ])

  // Pages (menu)
  const menu: [string, string][] = settings?.menuItems?.length ? settings.menuItems : menuDefaults
  for (const [label, href] of menu) add('Page', label, href)
  add('Page', 'Book a call', '/pre-call', 'Pre-call form discovery call')

  // Destinations (with their detail page text)
  const allDests = [...featured, ...more]
  const details = await Promise.all(allDests.map((d) => getDestinationBySlug(d.id).catch(() => null)))
  allDests.forEach((d, i) => {
    const detail = details[i]?.detail
    add(
      'Destination',
      d.title,
      `/destinations/${d.id}`,
      d.tagline, d.feeling, d.desc, d.experiences, d.idealFor,
      detail?.overview, detail?.bestTime,
      (detail?.highlights || []).flatMap((h) => [h.title, h.desc]),
    )
  })

  // Retreats
  for (const r of retreats) {
    add(
      'Retreat',
      r.title,
      `/retreats/${r.id}`,
      r.summary, r.description, r.highlights, r.included, r.destination?.title,
      r.itinerary.flatMap((day) => [day.title, day.description]),
      r.facilitators.flatMap((f) => [f.name, f.category]),
    )
  }

  // Experiences, services, steps
  for (const e of experiences) add('Experience', e.title, '/experiences', e.text)
  for (const t of tiers) add('Service', t.title, '/services', t.desc, t.items)
  for (const s of steps) add('How it works', s.title, '/how-it-works', s.description)

  // Partners
  for (const p of partners) {
    add('Partner', p.name, `/partners/${p.id}`, p.category, p.tagline, p.bio, p.services, p.location)
  }

  // Collaborations (companies and brands)
  for (const c of collaborations) add('Collaboration', c.name, '/collaborations', c.country, c.description)

  // FAQs (shown on the contact page)
  for (const [q, a] of faqs) add('FAQ', q, '/contact', a)

  // Fixed page texts and home page texts
  for (const [key, value] of Object.entries(pageTexts)) {
    const href = pageForTextKey(key)
    if (href && typeof value === 'string') add(PAGE_LABELS[href] || 'Page', PAGE_LABELS[href] || 'Page', href, value)
  }
  for (const [key, value] of Object.entries(siteContent)) {
    if (typeof value !== 'string') continue
    const href = homeHrefForCopyKey(key)
    add('Page', PAGE_LABELS[href.split('#')[0] || '/'] || 'Home', href, value)
  }

  return entries
}

// The index is rebuilt at most once a minute (same freshness as the rest of the site)
let cache: { at: number; entries: Entry[] } | null = null
async function getIndex() {
  if (cache && Date.now() - cache.at < 60_000) return cache.entries
  const entries = await buildIndex()
  cache = { at: Date.now(), entries }
  return entries
}

// Lower case, no accents, so "Cafe" finds "Café"
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function snippetFor(text: string, tokens: string[]) {
  if (!text) return ''
  const n = norm(text)
  let at = -1
  for (const t of tokens) {
    const i = n.indexOf(t)
    if (i !== -1 && (at === -1 || i < at)) at = i
  }
  if (at === -1) return text.slice(0, 110)
  const start = Math.max(0, at - 40)
  const end = Math.min(text.length, at + 90)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.slice(0, 80) || ''
  const tokens = norm(q).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return NextResponse.json({ results: [] })

  const entries = await getIndex()
  const scored: { score: number; entry: Entry }[] = []

  for (const entry of entries) {
    const title = norm(entry.title)
    const body = norm(entry.text)
    const all = `${title} ${body}`
    if (!tokens.every((t) => all.includes(t))) continue

    let score = 0
    if (title.includes(norm(q).trim())) score += 10
    for (const t of tokens) {
      if (title.includes(t)) score += 4
      if (title.split(/\s+/).some((w) => w.startsWith(t))) score += 2
      if (body.includes(t)) score += 1
    }
    scored.push({ score, entry })
  }

  scored.sort((a, b) => b.score - a.score)

  // At most 3 results per page so one page cannot fill the list
  const perHref = new Map<string, number>()
  const results: SearchResult[] = []
  for (const { entry } of scored) {
    const used = perHref.get(entry.href) || 0
    if (used >= 3) continue
    perHref.set(entry.href, used + 1)
    results.push({
      type: entry.type,
      title: entry.title,
      href: entry.href,
      snippet: snippetFor(entry.text, tokens),
    })
    if (results.length >= 8) break
  }

  return NextResponse.json({ results })
}
