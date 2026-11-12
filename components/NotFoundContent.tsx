import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from '@/components/LocLink'
import { getUi } from '@/lib/ui'
import type { Locale } from '@/lib/i18n'

export default function NotFoundContent({ locale }: { locale: Locale }) {
  const { notFound: t } = getUi(locale)
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
          {t.heading}
        </h1>
        <p style={{ maxWidth: 480, lineHeight: 1.7, opacity: 0.8 }}>{t.text}</p>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <Link href="/" className="button button-gold">{t.home}</Link>
          <Link href="/contact" className="text-link">{t.contact}</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
