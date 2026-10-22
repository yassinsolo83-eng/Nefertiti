import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from 'next-sanity'
import { buildWhatsappUrl, getNotifyWhatsappNumber, sendWhatsApp } from '@/lib/notify'
import {
  OTHER_LABEL,
  PRE_CALL_FORM_QUERY,
  normalizePreCallForm,
  otherKey,
  validateQuestion,
  type PreCallAnswers,
  type PreCallForm,
} from '@/lib/preCallForm'

// Server-only client with write access. The token never reaches the browser.
const writeClient = createClient({
  projectId: '205jlscz',
  dataset: 'production',
  apiVersion: '2025-06-01',
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_WRITE_TOKEN,
})

// Keep only plain strings / string lists, with sensible length limits
function cleanAnswers(raw: unknown): PreCallAnswers {
  const out: PreCallAnswers = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [key, value] of Object.entries(raw as Record<string, unknown>).slice(0, 200)) {
    const k = key.slice(0, 100)
    if (typeof value === 'string') out[k] = value.trim().slice(0, 5000)
    else if (Array.isArray(value)) out[k] = value.filter((v) => typeof v === 'string').map((v) => v.slice(0, 300)).slice(0, 50)
  }
  return out
}

type Row = { step: string; question: string; answer: string }

// One readable line per question, in the order of the form
function buildRows(form: PreCallForm, answers: PreCallAnswers): Row[] {
  const rows: Row[] = []
  for (const step of form.steps) {
    for (const q of step.questions) {
      const v = answers[q._key]
      const other = answers[otherKey(q._key)]
      const list = (Array.isArray(v) ? v : v ? [v] : [])
        .filter((item) => item === OTHER_LABEL || !q.options?.length || q.options.includes(item))
        .map((item) => (item === OTHER_LABEL && typeof other === 'string' && other ? `Other: ${other}` : item))
      const answer = list.join(q.type === 'multiple' ? ', ' : '').trim()
      if (answer) rows.push({ step: step.title, question: q.label, answer })
    }
  }
  return rows
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function sendNotification(form: PreCallForm, rows: Row[], name: string, email: string) {
  const apiKey = process.env.RESEND_API_KEY
  const to = form.notificationEmail
  // Email not set up yet (no API key, or no notification address in the Studio):
  // the submission is still saved in the Studio, so just skip.
  if (!apiKey || !to) return

  // Sender on the verified nefertitiretreats.com domain (verified in Resend).
  const from = 'Nefertiti Website <noreply@nefertitiretreats.com>'

  let lastStep = ''
  const htmlRows = rows
    .map((r) => {
      const heading =
        r.step !== lastStep
          ? `<tr><td colspan="2" style="padding:22px 0 8px;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8923D">${escapeHtml(r.step)}</td></tr>`
          : ''
      lastStep = r.step
      return `${heading}<tr><td style="padding:8px 0;border-bottom:1px solid #eee;vertical-align:top">
        <div style="font:600 13px Arial,sans-serif;color:#8D4C65;margin-bottom:4px">${escapeHtml(r.question)}</div>
        <div style="font:14px/1.6 Arial,sans-serif;color:#333;white-space:pre-wrap">${escapeHtml(r.answer)}</div>
      </td></tr>`
    })
    .join('')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email ? `${name.replace(/[<>"]/g, '')} <${email}>` : undefined,
      subject: `New pre-call form: ${name || email || 'New submission'}`,
      text: rows.map((r) => `${r.question}\n${r.answer}`).join('\n\n'),
      html: `<div style="max-width:640px;margin:0 auto;padding:24px">
      <h2 style="font:500 24px Georgia,serif;color:#8D4C65;margin:0 0 6px">New pre-call form</h2>
      <p style="font:13px Arial,sans-serif;color:#666;margin:0">Reply to this email to answer ${escapeHtml(name || 'them')} directly.</p>
      <table style="width:100%;border-collapse:collapse">${htmlRows}</table>
    </div>`,
    }),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}

export async function POST(req: Request) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Pre-call form failed: SANITY_WRITE_TOKEN is not set')
    return NextResponse.json({ error: 'Server is not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: pretend it worked so the bot moves on
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true })
  }

  // Check the answers against the form as published right now
  let form: PreCallForm
  try {
    form = normalizePreCallForm(await writeClient.fetch(PRE_CALL_FORM_QUERY))
  } catch {
    form = normalizePreCallForm(null)
  }

  const answers = cleanAnswers(body.answers)
  const errors: Record<string, string> = {}
  for (const step of form.steps) {
    for (const q of step.questions) {
      const err = validateQuestion(q, answers)
      if (err) errors[q._key] = err
    }
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  const all = form.steps.flatMap((s) => s.questions)
  const pick = (type: 'name' | 'email') => {
    const q = all.find((qq) => qq.type === type && typeof answers[qq._key] === 'string' && answers[qq._key])
    return q ? (answers[q._key] as string).slice(0, 200) : ''
  }
  const name = pick('name')
  const email = pick('email')
  const rows = buildRows(form, answers)

  try {
    // An ID containing a dot keeps the document private (readable only with a token)
    await writeClient.create({
      _id: `preCall.${randomUUID()}`,
      _type: 'preCallSubmission',
      status: 'new',
      name,
      email,
      answers: rows.map((r) => ({ _key: randomUUID().slice(0, 12), _type: 'answer', ...r })),
      submittedAt: new Date().toISOString(),
    })
  } catch (e: any) {
    console.error('Pre-call form failed:', e?.message)
    return NextResponse.json({ error: 'Could not send the form' }, { status: 500 })
  }

  // The answers are already saved: an email problem must not show an error to the visitor
  try {
    await sendNotification(form, rows, name, email)
  } catch (e: any) {
    console.error('Pre-call email failed:', e?.message)
  }

  // Same rule for WhatsApp: already saved, so a failure is only logged
  let whatsappUrl: string | undefined
  try {
    const notifyPhone = await getNotifyWhatsappNumber()
    const header = `🌸 New pre-call form — Nefertiti\n` + (name ? `From: ${name}\n` : '') + (email ? `Email: ${email}\n` : '')
    const body = rows.map((r) => `• ${r.question}\n${r.answer}`).join('\n\n')
    whatsappUrl = buildWhatsappUrl(`${header}\n${body}`, notifyPhone)
    await sendWhatsApp(`${header}\n${body}`, notifyPhone)
  } catch (e: any) {
    console.error('Pre-call WhatsApp failed:', e?.message)
  }

  return NextResponse.json({ ok: true, whatsappUrl })
}
