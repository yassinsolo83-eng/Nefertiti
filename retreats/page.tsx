import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { getRetreats, getSiteSettings } from '@/sanity/lib/queries'
import type { Retreat } from '@/lib/data'
import { formatRetreatDates, retreatNights, splitRetreats, STATUS_LABELS } from '@/lib/retreat-utils'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from './retreats.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.retreats,
    fallbackSeo: settings.seo.default,
    title: 'Upcoming Wellness Retreats in Egypt',
    description:
      'Join a Nefertiti retreat in Egypt — yoga, sound healing and slow travel along the Nile, the Red Sea and the desert. See upcoming dates and past retreats.',
    path: '/retreats',
    image: '/retreats-hero.webp',
  })
}

function RetreatCard({ r, past }: { r: Retreat; past?: boolean }) {
  const nights = retreatNights(r.startDate, r.endDate)
  return (
    <Link href={`/retreats/${r.id}`} className={`${s.card} ${past ? s.cardPast : ''}`}>
      <div className={s.cardMedia}>
        <img src={r.image} alt={r.title} loading="lazy" />
        <span className={`${s.badge} ${past ? s.badgePast : s[`badge_${r.status}`]}`}>
          {past ? 'Past retreat' : STATUS_LABELS[r.status]}
        </span>
      </div>
      <div className={s.cardBody}>
        <div className={s.cardMeta}>
          {r.destination && (
            <span><MapPin size={13} /> {r.destination.title}</span>
          )}
          <span><Calendar size={13} /> {formatRetreatDates(r.startDate, r.endDate)}</span>
        </div>
        <h3 className={s.cardTitle}>{r.title}</h3>
        {r.summary && <p className={s.cardSummary}>{r.summary}</p>}
        <span className={s.cardLink}>
          {nights > 0 && <em>{nights} nights</em>}
          View retreat <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default async function RetreatsPage() {
  const { upcoming, past } = splitRetreats(await getRetreats())

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
          <img src="/retreats-hero.webp" alt="A group resting on yoga mats during an outdoor retreat session" />
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
