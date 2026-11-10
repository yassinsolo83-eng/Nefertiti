import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getCollaborations, getPageTexts, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import CollaborationCard from '@/components/CollaborationCard'
import { Ornament } from '@/components/Motif'
import s from '@/components/Collaborations.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: null,
    fallbackSeo: settings.seo.default,
    title: 'Our Collaborations',
    description: 'The companies and brands around the world that Nefertiti collaborates with to create retreats in Egypt.',
    path: '/collaborations',
  })
}

export default async function CollaborationsPage() {
  const [items, texts] = await Promise.all([getCollaborations(), getPageTexts()])

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={s.hero}>
        <div className="dest-index-back"><BackButton /></div>
        <p className="eyebrow">{texts.collaborationsEyebrow}</p>
        <Ornament name="ankh" center />
        <h1 className={s.heroTitle}>
          {texts.collaborationsTitle.split('\n').map((line, i, a) => (
            <span key={i}>{line}{i < a.length - 1 && <br />}</span>
          ))}
        </h1>
        <p className={s.lead}>{texts.collaborationsLead}</p>
      </section>

      <section className="section inner-section">
        {items.length > 0 ? (
          <div className={s.grid}>
            {items.map((c) => <CollaborationCard key={c.id} item={c} instant />)}
          </div>
        ) : (
          <p className={s.empty}>Our collaborations will appear here soon.</p>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
