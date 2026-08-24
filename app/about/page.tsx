'use client'

import { ArrowUpRight } from 'lucide-react'
import { images, copy } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function AboutPage() {
  const t = copy.en
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className="page-hero page-hero-single">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">{t.founder}</p>
          <h1 className="page-title">About</h1>
          <p className="page-lead">The story and the people behind Nefertiti.</p>
        </div>
      </section>

      <section className="section founder inner-founder">
        <div className="founder-image reveal is-in">
          <img src={images.founder} alt="Founder at a waterfront event" />
        </div>
        <div className="founder-copy reveal is-in">
          <p className="eyebrow">{t.founder}</p>
          <h2>{t.founderText}</h2>
          <p className="founder-name">
            {t.founderName}<br />
            <span>{t.founderRole}</span>
          </p>
          <a href="/contact" className="text-link">LET&apos;S TALK ABOUT YOUR IDEA <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
