'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: { translate: { TranslateElement: new (opts: object, id: string) => unknown } }
  }
}

// Google Translate (about 250 KB of scripts) is only needed when the visitor has chosen Italian.
// Choosing a language sets the "googtrans" cookie and reloads, so the scripts load on that reload;
// everyone else never downloads them.
export default function GoogleTranslate() {
  useEffect(() => {
    if (!document.cookie.includes('googtrans=/en/it')) return
    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,it', autoDisplay: false },
        'google_translate_element',
      )
    }
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return <div id="google_translate_element" aria-hidden="true" />
}
