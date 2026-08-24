'use client'

import { ArrowUpRight } from 'lucide-react'
import { images, serviceTiers, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function ServicesPage() {
  const t = copy.en
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-single">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">04 / {t.bespokeLabel}</p>
          <h1 className="page-title">Services</h1>
          <p className="page-lead">{t.bespokeText}</p>
        </div>
      </section>

      <section className="bespoke inner-bespoke">
        <div className="bespoke-image">
          <img src={images.hero} alt="Guests practicing yoga outdoors" />
        </div>
        <div className="bespoke-copy reveal is-in">
          <p className="eyebrow">{t.bespokeLabel}</p>
          <h2>{t.bespoke.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
          <div className="service-tiers">
            {serviceTiers.map((tier) => (
              <div className="service-tier" key={tier.num}>
                <div className="tier-header">
                  <span className="tier-num">{tier.num}</span>
                  <span className="tier-title">{tier.title}</span>
                </div>
                <p className="tier-desc">{tier.desc}</p>
                <ul className="tier-list">
                  {tier.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <a href="/contact" className="button button-light">DISCUSS YOUR RETREAT<ArrowUpRight size={16} /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
