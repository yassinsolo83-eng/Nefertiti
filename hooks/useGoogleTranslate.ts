'use client'

/**
 * Controls Google Translate, restricted to English + Italian.
 * Sets/clears the `googtrans` cookie then reloads so the widget re-applies.
 */

// Google Translate stores its cookie on the host AND on the parent domain
// (e.g. www.example.com and .example.com). To clear it reliably we must expire
// every variant, otherwise the leftover one keeps the page translated.
function cookieDomains() {
  const host = window.location.hostname
  const parts = host.split('.')
  const domains = new Set<string>([''])
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join('.')
    domains.add(d)
    domains.add('.' + d)
  }
  return Array.from(domains)
}

export function setGoogleLang(target: 'en' | 'it') {
  const domains = cookieDomains()
  const withDomain = (d: string) => (d ? `;domain=${d}` : '')

  // Always clear every existing variant first
  domains.forEach((d) => {
    document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=0;path=/${withDomain(d)}`
  })

  if (target === 'it') {
    document.cookie = `googtrans=/en/it;path=/`
  }
  window.location.reload()
}
