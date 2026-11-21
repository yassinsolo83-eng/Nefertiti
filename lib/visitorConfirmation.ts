import { CAIRO_TZ, formatFull } from '@/lib/booking'
import { getUi } from '@/lib/ui'
import { SITE_URL } from '@/lib/site'
import type { Locale } from '@/lib/i18n'

// Confirmation email sent to the visitor after the Pre-Call form (English or Italian, formal).
// Sent from the verified nefertitiretreats.com domain through Resend; replies go to the Studio's notification address.

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const copy = {
  en: {
    subject: 'Your discovery call request | Nefertiti Retreats',
    greeting: (name: string) => (name ? `Dear ${name},` : 'Dear Sir or Madam,'),
    paragraphs: [
      'Thank you for completing our pre-call form. We have received your answers, together with the time you requested for our discovery call:',
    ],
    after: [
      'We will review your answers before the call and will contact you by email or telephone to confirm the details.',
      'Should you wish to change the time or add any information, please reply to this email.',
    ],
    closing: 'With kind regards,',
    cairo: 'Cairo time',
    viewCard: 'View our business card',
  },
  it: {
    subject: 'La sua richiesta di call conoscitiva | Nefertiti Retreats',
    greeting: (name: string) => (name ? `Gentile ${name},` : 'Gentile Signore/Signora,'),
    paragraphs: [
      'La ringraziamo per aver compilato il nostro modulo pre-call. Abbiamo ricevuto le sue risposte e l’orario da lei richiesto per la call conoscitiva:',
    ],
    after: [
      'Esamineremo le sue risposte prima della call e la contatteremo via email o telefono per confermare i dettagli.',
      'Qualora desiderasse modificare l’orario o aggiungere informazioni, la preghiamo di rispondere a questa email.',
    ],
    closing: 'Cordiali saluti,',
    cairo: 'ora del Cairo',
    viewCard: 'Vedi il nostro biglietto da visita',
  },
} as const

// "+393314486876" -> "+39 331 448 6876" (Italian mobile numbers); other numbers stay as "+digits"
function displayPhone(digits: string) {
  if (/^39\d{10}$/.test(digits)) return `+39 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  return `+${digits}`
}

type Input = {
  locale: Locale
  name: string
  email: string
  slot: number
  visitorTz: string
  replyTo: string
  contactEmail: string
  whatsappNumber: string
}

export async function sendVisitorConfirmation(i: Input) {
  const apiKey = process.env.RESEND_API_KEY
  // Email not set up yet, or no usable address: the booking is saved anyway, so just skip.
  if (!apiKey || !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(i.email)) return

  const t = copy[i.locale]
  const dateLocale = getUi(i.locale).preCall.booking.dateLocale
  const when = i.visitorTz
    ? `${formatFull(i.slot, i.visitorTz, dateLocale)} (${i.visitorTz})`
    : `${formatFull(i.slot, CAIRO_TZ, dateLocale)} (${t.cairo})`
  const name = i.name.replace(/[<>"\r\n]/g, '').trim()
  const cardUrl = `${SITE_URL}${i.locale === 'it' ? '/it' : ''}/card`
  const phone = i.whatsappNumber ? displayPhone(i.whatsappNumber) : ''

  const text = [
    t.greeting(name),
    '',
    ...t.paragraphs,
    '',
    when,
    '',
    ...t.after.flatMap((p) => [p, '']),
    t.closing,
    'Nefertiti Retreats',
    '',
    'Retreat Production & Destination Experiences in Egypt',
    ...(phone ? [phone] : []),
    i.contactEmail,
    SITE_URL,
    'Sheikh Zayed, Egypt',
    `${t.viewCard}: ${cardUrl}`,
  ].join('\n')

  const p = (v: string) => `<p style="margin:0 0 14px">${escapeHtml(v)}</p>`
  const link = (href: string, label: string, style = 'color:#A8647F;text-decoration:none') =>
    `<a href="${escapeHtml(href)}" style="${style}">${escapeHtml(label)}</a>`
  const html = `<div style="max-width:620px;margin:0 auto;padding:24px;font:15px/1.65 Georgia,'Times New Roman',serif;color:#444">
  ${p(t.greeting(name))}
  ${t.paragraphs.map(p).join('')}
  <p style="margin:0 0 18px;padding:12px 16px;border-left:3px solid #B8923D;background:#F3F0E8;color:#6B3A4E"><strong>${escapeHtml(when)}</strong></p>
  ${t.after.map(p).join('')}
  ${p(t.closing)}
  <table cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.5;margin-top:6px">
    <tr><td style="padding:0 0 10px 0">
      <a href="${escapeHtml(cardUrl)}" style="text-decoration:none"><img src="${SITE_URL}/brand/signature-logo.png" width="260" alt="Nefertiti Retreats" style="display:block;border:0;width:260px;height:auto"></a>
    </td></tr>
    <tr><td style="padding:0;border-top:1px solid #B8923D">
      <div style="padding-top:10px;color:#B8923D;font-style:italic">Retreat Production &amp; Destination Experiences in Egypt</div>
      <div style="padding-top:8px;color:#A8647F">
        ${phone ? `${link(`https://wa.me/${i.whatsappNumber}`, phone)}<br>` : ''}
        ${link(`mailto:${i.contactEmail}`, i.contactEmail)}<br>
        ${link(SITE_URL, SITE_URL.replace(/^https?:\/\//, ''))}<br>
        Sheikh Zayed, Egypt
      </div>
      <div style="padding-top:8px">${link(cardUrl, t.viewCard, 'color:#A8647F;text-decoration:underline')}</div>
    </td></tr>
  </table>
</div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Nefertiti Retreats <noreply@nefertitiretreats.com>',
      to: i.email,
      reply_to: i.replyTo || undefined,
      subject: t.subject,
      text,
      html,
    }),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}
