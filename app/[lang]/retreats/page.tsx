import type { Metadata } from 'next'
import Link from '@/components/LocLink'
import { ArrowUpRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { currentLocale, getPageImages, getPageTexts, getRetreats, getSiteSettings } from '@/sanity/lib/queries'
import { getUi } from '@/lib/ui'
import { splitRetreats } from '@/lib/retreat-utils'
import RetreatCard from '@/components/RetreatCard'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from './retreats.module.css'
import { Ornament } from '@/components/Motif'
import Img from '@/components/Img'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, pageImages, locale] = await Promise.all([getSiteSettings(), getPageImages(), currentLocale()])
  const t = getUi(locale).retreats
  return buildMetadata({
    seo: settings.seo.retreats,
    fallbackSeo: settings.seo.default,
    title: t.metaTitle,
    description: t.metaDescription,
    path: '/retreats',
    image: pageImages.retreatsHero,
  })
}

export default async function RetreatsPage() {
  const [retreats, pageImages, texts] = await Promise.all([getRetreats(), getPageImages(), getPageTexts()])
  const { upcoming, past } = splitRetreats(retreats)
  const t = getUi(await currentLocale()).retreats

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">{texts.retreatsEyebrow}</p>
<Ornament name="cartouche-ankh" />
          <h1 className="page-title">{texts.retreatsPageTitle}</h1>
          <p className="page-lead">{texts.retreatsLead}</p>
        </div>
        <div className="page-hero-image reveal is-in">
          <Img priority src={pageImages.retreatsHero} alt={t.heroAlt} />
        </div>
      </section>

      <section className={s.listSection}>
        <div className="section-heading">
          <p className="section-label">{texts.retreatsListLabel}</p>
        </div>

        {upcoming.length > 0 ? (
          <div className={s.grid}>
            {upcoming.map((r) => <RetreatCard key={r.id} r={r} />)}
          </div>
        ) : (
          <div className={s.empty}>
            <p>{texts.retreatsEmptyText}</p>
            <Link href="/pre-call" className="button button-gold">
              {texts.retreatsEmptyButton} <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className={`${s.listSection} ${s.pastSection}`}>
          <div className="section-heading">
            <p className="section-label">{t.pastLabel}</p>
          </div>
          <div className={s.grid}>
            {past.map((r) => <RetreatCard key={r.id} r={r} past />)}
          </div>
        </section>
      )}

      <section className={s.ctaBand}>
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
        <Link href="/services" className="button button-ghost-dark">
          {t.ctaButton} <ArrowUpRight size={16} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  )
}
