import type { Metadata } from 'next'
import Link from '@/components/LocLink'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Calendar, Check, MapPin, Moon } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { currentLocale, getRetreatBySlug, getSiteSettings } from '@/sanity/lib/queries'
import { getUi } from '@/lib/ui'
import { localePath } from '@/lib/i18n'
import { formatRetreatDates, isPastRetreat, retreatNights } from '@/lib/retreat-utils'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import RetreatGallery from '@/components/RetreatGallery'
import s from '../retreats.module.css'
import Img from '@/components/Img'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [r, settings, locale] = await Promise.all([getRetreatBySlug(slug), getSiteSettings(), currentLocale()])
  const t = getUi(locale).retreats
  if (!r) return { title: t.notFound, robots: { index: false } }

  const where = r.destination ? t.whereIn(r.destination.title) : t.whereEgypt
  return buildMetadata({
    seo: r.seo,
    fallbackSeo: settings.seo.default,
    title: r.title,
    description: r.summary || t.descFallback(where, formatRetreatDates(r.startDate, r.endDate, locale)),
    path: `/retreats/${r.id}`,
    image: r.image,
    imageAlt: r.title,
  })
}

export default async function RetreatDetailPage({ params }: Params) {
  const { slug } = await params
  const [r, locale] = await Promise.all([getRetreatBySlug(slug), currentLocale()])
  if (!r) return notFound()
  const t = getUi(locale).retreats

  const past = isPastRetreat(r)
  const dates = formatRetreatDates(r.startDate, r.endDate, locale)
  const nights = retreatNights(r.startDate, r.endDate)
  const paragraphs = r.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  const enquireLink = `/pre-call?retreat=${encodeURIComponent(r.title)}`

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
    url: `${SITE_URL}${localePath(locale, `/retreats/${r.id}`)}`,
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
            ◆ {r.destination ? `${r.destination.title.toUpperCase()} · ` : ''}{past ? t.pastWord : t.retreatWord}
          </p>
          <h1 className={s.detailTitle}>{r.title}</h1>
          <div className={s.detailMeta}>
            <span><Calendar size={14} /> {dates}</span>
            {nights > 0 && <span><Moon size={14} /> {t.nights(nights)}</span>}
            <span className={`${s.badge} ${s.badgeInline} ${past ? s.badgePast : s[`badge_${r.status}`]}`}>
              {past ? t.past : t.status[r.status]}
            </span>
          </div>
          {r.summary && <p className="page-lead">{r.summary}</p>}
          {!past && r.status !== 'soldout' && (
            <div className={s.ctaRow}>
              <Link href={enquireLink} className="button button-berry">
                {t.enquire} <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
        <div className="page-hero-image reveal is-in">
          <Img priority src={r.image} alt={r.title} />
        </div>
      </section>

      {r.highlights.length > 0 && (
        <div className={s.highlights} aria-label={t.highlights}>
          <div className={s.highlightsTrack}>
            {[0, 1].map((copy) => {
              // repeat short lists so one copy always fills the screen width
              const reps = Math.max(1, Math.ceil(8 / r.highlights.length))
              return (
                <ul key={copy} className={s.highlightsList} aria-hidden={copy === 1 ? true : undefined}>
                  {Array.from({ length: reps }).flatMap((_, k) =>
                    r.highlights.map((h, i) => <li key={`${k}-${i}`}>{h}</li>)
                  )}
                </ul>
              )
            })}
          </div>
        </div>
      )}

      {/* Body */}
      <section className={s.detailBody}>
        <div className={s.detailMain}>
          {paragraphs.length > 0 && (
            <div className={s.detailText}>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {r.gallery.length > 0 && (
            <div className={s.block}>
              <p className="section-label">{t.gallery}</p>
              <RetreatGallery images={r.gallery} title={r.title} />
            </div>
          )}

          {r.itinerary.length > 0 && (
            <div className={s.block}>
              <p className="section-label">{t.programme}</p>
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
              <p className="section-label">{t.facilitators}</p>
              <div className={s.facilitators}>
                {r.facilitators.map((f) => (
                  <Link key={f.id} href={`/partners/${f.id}`} className={s.facilitator}>
                    {f.image && <Img src={f.image} alt={f.name} loading="lazy" />}
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
          <p className="section-label">{t.glance}</p>
          <ul className={s.glance}>
            <li><Calendar size={15} /> {dates}</li>
            {nights > 0 && <li><Moon size={15} /> {t.nights(nights)}</li>}
            {r.destination && (
              <li>
                <MapPin size={15} />
                <Link href={`/destinations/${r.destination.id}`}>{t.inEgypt(r.destination.title)}</Link>
              </li>
            )}
          </ul>

          {r.included.length > 0 && (
            <>
              <p className="section-label">{t.included}</p>
              <ul className={s.included}>
                {r.included.map((item) => (
                  <li key={item}><Check size={15} /> {item}</li>
                ))}
              </ul>
            </>
          )}

          {past ? (
            <div className={s.asideNote}>
              <p>{t.ended}</p>
              <Link href="/retreats" className="button button-gold">
                {t.seeUpcoming} <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : r.status === 'soldout' ? (
            <div className={s.asideNote}>
              <p>{t.soldOutText}</p>
              <Link href={enquireLink} className="button button-gold">
                {t.waitlist} <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className={s.asideActions}>
              <Link href={enquireLink} className="button button-berry">
                {t.enquire} <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </aside>
      </section>

      <SiteFooter />
    </main>
  )
}
