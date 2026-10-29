import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/env'

// Never cache: every call must reach Sanity
export const dynamic = 'force-dynamic'

// Server-only client with write access. The token never reaches the browser.
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_WRITE_TOKEN,
})

// A dot in the ID keeps the document private (readable only with a token)
const COUNTER_ID = 'stats.visitors'

// Search engines, link previews and monitors should not inflate the number
const BOT_RE =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|facebookexternalhit|embedly|curl|wget|python|node-fetch/i

// The on/off switch and starting number change rarely: keep them for a minute
// so a visit costs one request to Sanity instead of two.
let cached: { at: number; show: boolean; start: number } | null = null

async function getSettings() {
  if (cached && Date.now() - cached.at < 60_000) return cached
  const r = await client.fetch<{ show?: boolean; start?: number } | null>(
    `*[_id == "siteSettings"][0]{ "show": showVisitorCounter, "start": visitorCounterStart }`,
  )
  cached = {
    at: Date.now(),
    show: r?.show !== false,
    start: typeof r?.start === 'number' && Number.isFinite(r.start) ? r.start : 1000,
  }
  return cached
}

// Atomic +1 (two visitors at the same moment are both counted)
async function increment(): Promise<number> {
  const bump = () =>
    client.patch(COUNTER_ID).setIfMissing({ count: 0 }).inc({ count: 1 }).commit<{ count: number }>()
  try {
    return (await bump()).count
  } catch {
    // First visit ever: the counter document does not exist yet
    await client.createIfNotExists({ _id: COUNTER_ID, _type: 'visitorCounter', count: 0 })
    return (await bump()).count
  }
}

export async function POST(req: Request) {
  const init = { headers: { 'Cache-Control': 'no-store' } }
  if (!process.env.SANITY_WRITE_TOKEN) return NextResponse.json({ enabled: false }, init)

  try {
    const settings = await getSettings()
    if (!settings.show) return NextResponse.json({ enabled: false }, init)

    const isBot = BOT_RE.test(req.headers.get('user-agent') || '')
    const counted = isBot
      ? Number(await client.fetch<number | null>(`*[_id == $id][0].count`, { id: COUNTER_ID })) || 0
      : await increment()

    return NextResponse.json({ enabled: true, count: settings.start + counted }, init)
  } catch (e) {
    // The counter is decoration: if anything fails the page simply shows nothing
    console.error('Visitor counter failed:', e instanceof Error ? e.message : String(e))
    return NextResponse.json({ enabled: false }, init)
  }
}
