import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ArrowUpRight } from 'lucide-react'
import { images } from '@/lib/data'
import { getSiteContent, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './about.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.about,
    fallbackSeo: settings.seo.default,
    title: 'About Nefertiti — The Story Behind the Retreats',
    description: 'Meet Azza, founder of Nefertiti, and discover the story behind our luxury wellness retreats across Egypt.',
    path: '/about',
  })
}

export default async function AboutPage() {
  const t = await getSiteContent()

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={styles.hero}>
        <div className={`${styles.backWrap} hero-back`}>
          <BackButton />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">◆ {t.founder}</p>
            <h1 className={styles.title}>The story and the people<br />behind Nefertiti.</h1>
          </div>

          <div className={styles.content}>
            <div className={styles.founderImg}>
              <img src={images.founder} alt={`${t.founderName}, founder of Nefertiti Retreats`} />
            </div>
            <h2 className={styles.founderText}>{t.founderText}</h2>
            <p className={styles.founderName}>
              {t.founderName}<br />
              <span>{t.founderRole}</span>
            </p>
            <a href="/contact" className="button button-gold">
              Let&apos;s Talk About Your Idea <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
