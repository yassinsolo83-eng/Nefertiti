import { getSiteSettings } from '@/sanity/lib/queries'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

// "Save contact" file for the business card page (opens in the phone's contacts app).
export async function GET() {
  const settings = await getSiteSettings()
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Retreats;Nefertiti;;;',
    'FN:Nefertiti Retreats',
    'ORG:Nefertiti Retreats',
    'TITLE:Retreat Production and Destination Experiences in Egypt',
    ...(settings.whatsappNumber ? [`TEL;TYPE=CELL,VOICE:+${settings.whatsappNumber}`] : []),
    `EMAIL;TYPE=INTERNET:${settings.contactEmail}`,
    `URL:${SITE_URL}`,
    'ADR;TYPE=WORK:;;;Sheikh Zayed;;;Egypt',
    'X-ABShowAs:COMPANY',
    'END:VCARD',
  ]
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="nefertiti-retreats.vcf"',
    },
  })
}
