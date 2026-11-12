import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { ArrowUpRight } from 'lucide-react'
import { currentLocale, getPageImages, getPageTexts, getSiteContent, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './about.module.css'
import { Ornament } from '@/components/Motif'
import Link from '@/components/LocLink'
import Img from '@/components/Img'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.about
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.about,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/about',
  })
}

export default async function AboutPage() {
  const [t, pageImages, texts, locale] = await Promise.all([getSiteContent(), getPageImages(), getPageTexts(), currentLocale()])
  const m = getUi(locale).meta.about

  return (
    <main className="inner-page">
      <SiteNav overHero />

      <section className="phero" style={{ backgroundImage: `url('${pageImages.aboutHero}')`, backgroundPosition: 'center bottom' }}>
        <div className="phero-shade" />
        <div className="phero-back hero-back">
          <BackButton />
        </div>
        <div className="phero-content">
          <Ornament name="cartouche-ankh" />
          <h1>{texts.aboutTitle}</h1>
          <p className="phero-sub">{texts.aboutSubtitle}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.founderImg}>
              <Img src={pageImages.founderPhoto} alt={m.founderAlt(t.founderName)} />
            </div>
            <h2 className={styles.founderText}>{t.founderText}</h2>
            <p className={styles.founderName}>
              {t.founderName}<br />
              <span>{t.founderRole}</span>
            </p>
            <Link href="/pre-call" className="button button-gold">
              {m.talk} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
