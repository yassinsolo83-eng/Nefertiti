import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Calendar, Check, MapPin, MessageCircle, Moon } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { getRetreatBySlug, getSiteSettings } from '@/sanity/lib/queries'
import { formatRetreatDates, isPastRetreat, retreatNights, STATUS_LABELS } from '@/lib/retreat-utils'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from '../retreats.module.css'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [r, settings] = await Promise.all([getRetreatBySlug(slug), getSiteSettings()])
  if (!r) return { title: 'Retreat not found', robots: { index: false } }

  const where = r.destination ? ` in ${r.destination.title}` : ' in Egypt'
  return buildMetadata({
    seo: r.seo,
    fallbackSeo: settings.seo.default,
    title: r.title,
    description: r.summary || `A Nefertiti retreat${where}, ${formatRetreatDates(r.startDate, r.endDate)}.`,
    path: `/retreats/${r.id}`,
    image: r.image,
    imageAlt: r.title,
  })
}

export default async function RetreatDetailPage({ params }: Params) {
  const { slug } = await params
  const [r, settings] = await Promise.all([getRetreatBySlug(slug), getSiteSettings()])
  if (!r) return notFound()

  const past = isPastRetreat(r)
  const dates = formatRetreatDates(r.startDate, r.endDate)
  const nights = retreatNights(r.startDate, r.endDate)
  const paragraphs = r.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  const whatsappText = `Hi! I'm interested in the retreat "${r.title}" (${dates}). Could you share more details?`
  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`
  const enquireLink = `/contact?retreat=${encodeURIComponent(r.title)}#enquiry`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: r.title,
    description: r.summary || paragraphs[0] || undefined,
    startDate: r.startDate,
    endDate: r.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: r.image.startsWith('http') ? r.image : `${SITE_URL}${r.image}`,
    url: `${SITE_URL}/retreats/${r.id}`,
    location: {
      '@type': 'Place',
      name: r.destination ? `${r.destination.title}, Egypt` : 'Egypt',
      address: { '@type': 'PostalAddress', addressLocality: r.destination?.title, addressCountry: 'EG' },
    },
    organizer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    performer: r.facilitators.length ? r.facilitators.map((f) => ({ '@type': 'Person', name: f.name })) : undefined,
  }

  return (
    <main className="inner-page">
      <SiteNav solid />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="page-hero page-hero-split">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">
            ◆ {r.destination ? `${r.destination.title.toUpperCase()} · ` : ''}{past ? 'PAST RETREAT' : 'RETREAT'}
          </p>
          <h1 className={s.detailTitle}>{r.title}</h1>
          <div className={s.detailMeta}>
            <span><Calendar size={14} /> {dates}</span>
            {nights > 0 && <span><Moon size={14} /> {nights} nights</span>}
            <span className={`${s.badge} ${s.badgeInline} ${past ? s.badgePast : s[`badge_${r.status}`]}`}>
              {past ? 'Past retreat' : STATUS_LABELS[r.status]}
            </span>
          </div>
          {r.summary && <p className="page-lead">{r.summary}</p>}
          {!past && r.status !== 'soldout' && (
            <div className={s.ctaRow}>
              <Link href={enquireLink} className="button button-berry">
                Enquire Now <ArrowUpRight size={16} />
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost-dark">
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </div>
          )}
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={r.image} alt={r.title} />
        </div>
      </section>

      {/* Body */}
      <section className={s.detailBody}>
        <div className={s.detailMain}>
          {paragraphs.length > 0 && (
            <div className={s.detailText}>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {r.itinerary.length > 0 && (
            <div className={s.block}>
              <p className="section-label">THE PROGRAMME</p>
              <ol className={s.timeline}>
                {r.itinerary.map((d, i) => (
                  <li key={i}>
                    {d.day && <span className={s.timelineDay}>{d.day}</span>}
                    <h3>{d.title}</h3>
                    {d.description && <p>{d.description}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {r.facilitators.length > 0 && (
            <div className={s.block}>
              <p className="section-label">YOUR FACILITATORS</p>
              <div className={s.facilitators}>
                {r.facilitators.map((f) => (
                  <Link key={f.id} href={`/partners/${f.id}`} className={s.facilitator}>
                    {f.image && <img src={f.image} alt={f.name} loading="lazy" />}
                    <span>
                      <strong>{f.name}</strong>
                      {f.category && <small>{f.category}</small>}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={s.aside}>
          <p className="section-label">AT A GLANCE</p>
          <ul className={s.glance}>
            <li><Calendar size={15} /> {dates}</li>
            {nights > 0 && <li><Moon size={15} /> {nights} nights</li>}
            {r.destination && (
              <li>
                <MapPin size={15} />
                <Link href={`/destinations/${r.destination.id}`}>{r.destination.title}, Egypt</Link>
              </li>
            )}
          </ul>

          {r.included.length > 0 && (
            <>
              <p className="section-label">WHAT&apos;S INCLUDED</p>
              <ul className={s.included}>
                {r.included.map((item) => (
                  <li key={item}><Check size={15} /> {item}</li>
                ))}
              </ul>
            </>
          )}

          {past ? (
            <div className={s.asideNote}>
              <p>This retreat has ended.</p>
              <Link href="/retreats" className="button button-gold">
                See Upcoming Retreats <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : r.status === 'soldout' ? (
            <div className={s.asideNote}>
              <p>This retreat is sold out. Want to hear about the next one?</p>
              <Link href={enquireLink} className="button button-gold">
                Join the Waitlist <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className={s.asideActions}>
              <Link href={enquireLink} className="button button-berry">
                Enquire Now <ArrowUpRight size={16} />
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-ghost-dark">
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </div>
          )}
        </aside>
      </section>

      <SiteFooter />
    </main>
  )
}
