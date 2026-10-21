// Opens WhatsApp with the submitted details ready to send.
// Returns false when the browser blocked the new tab, so the form can show a button instead.
export function openWhatsapp(url?: string): boolean {
  if (!url || typeof window === 'undefined') return false
  // (not "noopener": that always returns null, which would look like a blocked tab)
  const w = window.open(url, '_blank')
  if (!w) return false
  try {
    w.opener = null
  } catch {
    /* ignore */
  }
  return true
}
