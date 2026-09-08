import { ArrowUpRight } from 'lucide-react'
import { images } from '@/lib/data'
import { getSiteContent } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './about.module.css'

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
              <img src={images.founder} alt="Founder" />
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
