import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from 'next-sanity'

// Server-only client with write access. The token never reaches the browser.
const writeClient = createClient({
  projectId: '205jlscz',
  dataset: 'production',
  apiVersion: '2025-06-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(req: Request) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Enquiry failed: SANITY_WRITE_TOKEN is not set')
    return NextResponse.json({ error: 'Server is not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: real visitors never see or fill this field, bots usually do.
  // Pretend it worked so the bot moves on.
  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const phone = clean(body.phone, 40)
  const practice = clean(body.practice, 120)
  const message = clean(body.message, 5000)
  const retreat = clean(body.retreat, 200)

  const errors: Record<string, string> = {}
  if (!name) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10) errors.message = 'Please tell us a little more (at least 10 characters).'
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  try {
    // An ID containing a dot keeps the document private: it can only be read
    // with a token (e.g. inside the Studio), never through the public API,
    // so visitors' emails and phone numbers are not exposed.
    await writeClient.create({
      _id: `enquiries.${randomUUID()}`,
      _type: 'enquiry',
      status: 'new',
      name,
      email,
      phone,
      practice,
      retreat: retreat || undefined,
      message,
      submittedAt: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Enquiry failed:', e?.message)
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 })
  }
}
