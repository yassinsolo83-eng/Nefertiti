import { createClient } from 'next-sanity'

// Read-only use of the server client: just to look up where notifications go.
const client = createClient({
  projectId: '205jlscz',
  dataset: 'production',
  apiVersion: '2025-06-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const NOTIFY_QUERY = `*[_type == "siteSettings"][0]{ notifyWhatsappNumber, whatsappNumber }`

// The destination WhatsApp number is controlled from the Studio (Site Settings),
// never hardcoded here.
export async function getNotifyWhatsappNumber(): Promise<string> {
  try {
    const r = await client.fetch<{ notifyWhatsappNumber?: string; whatsappNumber?: string }>(NOTIFY_QUERY)
    // Falls back to the site's public WhatsApp number when no notification number is set
    return String(r?.notifyWhatsappNumber || r?.whatsappNumber || '').replace(/\D/g, '')
  } catch {
    return ''
  }
}

// Sends a WhatsApp message to the business via CallMeBot (free).
// The number comes from the Studio; CALLMEBOT_APIKEY is a one-time secret in Vercel.
// Throws on failure so the caller can log it — it must never block the response.
export async function sendWhatsApp(text: string, phone: string): Promise<void> {
  const apikey = process.env.CALLMEBOT_APIKEY
  if (!phone || !apikey) return // Not configured yet: skip silently, the submission is still saved
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text.slice(0, 900))}` +
    `&apikey=${encodeURIComponent(apikey)}`
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`CallMeBot responded ${res.status}`)
}

// A wa.me link that opens WhatsApp with the full details already typed in.
// The visitor's browser opens it right after submitting; the number never lives in the code.
export function buildWhatsappUrl(text: string, phone: string): string | undefined {
  if (!phone) return undefined
  return `https://wa.me/${phone}?text=${encodeURIComponent(text.slice(0, 1400))}`
}
