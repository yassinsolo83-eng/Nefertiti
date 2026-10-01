import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
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
        <p className="eyebrow">◆ 404</p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 1.05,
            color: 'var(--primary)',
          }}
        >
          This path leads nowhere.
        </h1>
        <p style={{ maxWidth: 480, lineHeight: 1.7, opacity: 0.8 }}>
          The page you are looking for may have moved or no longer exists. Let&apos;s guide you back.
        </p>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <a href="/" className="button button-gold">Back to home</a>
          <a href="/contact" className="text-link">Contact us</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
