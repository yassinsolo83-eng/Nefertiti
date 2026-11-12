'use client'

import { ArrowUpRight, MapPin, Globe, Check } from 'lucide-react'
import Link from '@/components/LocLink'
import type { Partner } from '@/lib/data'
import { fitUrl } from '@/sanity/lib/image'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from '@/app/[lang]/partners/partners.module.css'
import Img from '@/components/Img'
import { useUi } from '@/components/LocaleProvider'

type Props = { partner: Partner | null }

export default function PartnerDetailPage({ partner }: Props) {
  const t = useUi().detail

  if (!partner) {
    return (
      <main className="inner-page">
        <SiteNav solid />
        <section className="page-hero page-hero-single">
          <div className="page-hero-text">
            <BackButton />
            <h1 className="page-title">{t.partnerNotFound}</h1>
            <Link href="/partners" className="button button-gold inner-cta">
              {t.allPartners} <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-split">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">{partner.category}</p>
          <h1 className="page-title">{partner.name}</h1>
          <p className="page-lead">{partner.tagline}</p>
          <div className={s.partnerMeta}>
            {partner.location && (
              <span className={s.partnerMetaItem}><MapPin size={14} /> {partner.location}</span>
            )}
            {partner.website && (
              <a className={s.partnerMetaItem} href={partner.website} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> {t.website}
              </a>
            )}
            {partner.instagram && (
              <a className={s.partnerMetaItem} href={`https://instagram.com/${partner.instagram}`} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> @{partner.instagram}
              </a>
            )}
          </div>
        </div>
        <div className="page-hero-image partner-hero-photo reveal is-in">
          <Img src={fitUrl(partner.image, 1000)} alt={partner.name} />
        </div>
      </section>

      <section className="section inner-section">
        <div className={s.partnerDetailGrid}>
          <div>
            <p className="eyebrow">{t.about}</p>
            <p className={s.partnerBioText}>{partner.bio}</p>
          </div>

          {partner.showServices !== false && (
            <div>
              <p className="eyebrow">{t.offer}</p>
              <ul className={s.partnerServiceList}>
                {partner.services.map((svc) => (
                  <li key={svc}><Check size={15} /> {svc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={s.partnerCtaRow}>
          <Link href="/pre-call" className="button button-gold">
            {t.workWith(partner.name)} <ArrowUpRight size={16} />
          </Link>
          <Link href="/pre-call" className="button button-ghost-dark">
            {t.askAbout}
          </Link>
        </div>

        <Link href="/partners" className={s.partnerBackLink}>{t.allPartnersLink}</Link>
      </section>

      <SiteFooter />
    </main>
  )
}
