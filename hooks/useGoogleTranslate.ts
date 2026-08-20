'use client'

/**
 * Controls Google Translate, restricted to English + Italian.
 * Sets/clears the `googtrans` cookie then reloads so the widget re-applies.
 */
export function setGoogleLang(target: 'en' | 'it') {
  const domain = window.location.hostname
  const cookieDomains = ['', domain, '.' + domain]
  if (target === 'en') {
    // clear the translate cookie to return to the original (English)
    cookieDomains.forEach((d) => {
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${d ? ';domain=' + d : ''}`
    })
  } else {
    cookieDomains.forEach((d) => {
      document.cookie = `googtrans=/en/it;path=/${d ? ';domain=' + d : ''}`
    })
  }
  window.location.reload()
}
