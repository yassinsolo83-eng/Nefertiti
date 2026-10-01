import type { ReactNode } from 'react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './LegalPage.module.css'

export type LegalSection = {
  id: string
  heading: string
  body: ReactNode
}

type Props = {
  eyebrow: string
  title: string
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}

/**
 * Shared layout for the Terms & Conditions and Privacy Policy pages:
 * title, last-updated date, a sticky table of contents and numbered sections.
 */
export default function LegalPage({ eyebrow, title, updated, intro, sections }: Props) {
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={styles.header}>
        <BackButton />
        <p className="eyebrow">◆ {eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Last updated: {updated}</p>
        <div className={styles.intro}>{intro}</div>
      </section>

      <section className={styles.layout}>
        <nav className={styles.toc} aria-label="On this page">
          <p className={styles.tocLabel}>On this page</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>
          {sections.map((s, i) => (
            <article key={s.id} id={s.id} className={styles.block}>
              <h2>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              {s.body}
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
