import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { getPageImages, getRetreats, getSiteSettings } from '@/sanity/lib/queries'
import { splitRetreats } from '@/lib/retreat-utils'
import RetreatCard from '@/components/RetreatCard'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from './retreats.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, pageImages] = await Promise.all([getSiteSettings(), getPageImages()])
  return buildMetadata({
    seo: settings.seo.retreats,
    fallbackSeo: settings.seo.default,
    title: 'Upcoming Wellness Retreats in Egypt',
    description:
      'Join a Nefertiti retreat in Egypt — yoga, sound healing and slow travel along the Nile, the Red Sea and the desert. See upcoming dates and past retreats.',
    path: '/retreats',
    image: pageImages.retreatsHero,
  })
}

export default async function RetreatsPage() {
  const [retreats, pageImages] = await Promise.all([getRetreats(), getPageImages()])
  const { upcoming, past } = splitRetreats(retreats)

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">◆ NEFERTITI RETREATS</p>
          <h1 className="page-title">Retreats</h1>
          <p className="page-lead">
            Our own retreats across Egypt — small groups, thoughtful programmes and places that
            stay with you long after you leave. Find your next journey below.
          </p>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={pageImages.retreatsHero} alt="A group resting on yoga mats during an outdoor retreat session" />
        </div>
      </section>

      <section className={s.listSection}>
        <div className="section-heading">
          <p className="section-label">UPCOMING RETREATS</p>
        </div>

        {upcoming.length > 0 ? (
          <div className={s.grid}>
            {upcoming.map((r) => <RetreatCard key={r.id} r={r} />)}
          </div>
        ) : (
          <div className={s.empty}>
            <p>New dates are being planned. Tell us what you are looking for and we will let you know first.</p>
            <Link href="/contact" className="button button-gold">
              Get in Touch <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className={`${s.listSection} ${s.pastSection}`}>
          <div className="section-heading">
            <p className="section-label">PAST RETREATS</p>
          </div>
          <div className={s.grid}>
            {past.map((r) => <RetreatCard key={r.id} r={r} past />)}
          </div>
        </section>
      )}

      <section className={s.ctaBand}>
        <h2>Dreaming of hosting your own?</h2>
        <p>We design and produce retreats for coaches and facilitators across Egypt.</p>
        <Link href="/services" className="button button-ghost-dark">
          Explore Our Services <ArrowUpRight size={16} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  )
}
