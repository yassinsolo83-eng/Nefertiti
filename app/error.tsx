'use client'

import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// Shown when something fails while a page is loading (for example, the content service is unreachable).
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="inner-page">
      <SiteNav solid />
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '160px max(24px, 6vw) 80px',
          gap: 20,
        }}
      >
        <p className="eyebrow">◆ Something went wrong</p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 1.05,
            color: 'var(--primary)',
          }}
        >
          We could not load this page.
        </h1>
        <p style={{ maxWidth: 480, lineHeight: 1.7, opacity: 0.8 }}>
          Please try again in a moment. If it keeps happening, contact us and we will help right away.
        </p>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <button type="button" className="button button-gold" onClick={reset}>Try again</button>
          <Link href="/contact" className="text-link">Contact us</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
