import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/env'

export const dynamic = 'force-dynamic'

// Submissions are private documents, so reading them needs the server token.
// Only the booked times are sent to the browser — never names or answers.
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_WRITE_TOKEN,
})

export async function GET() {
  try {
    const slots = await client.fetch<string[]>(
      `*[_type == "preCallSubmission" && defined(slot) && dateTime(slot) > dateTime(now())].slot`,
    )
    const booked = (slots || []).map((v) => Date.parse(v)).filter(Number.isFinite)
    return NextResponse.json({ booked }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ booked: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
