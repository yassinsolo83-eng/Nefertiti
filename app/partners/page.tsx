import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { getPartners, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import s from './partners.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.partners,
    fallbackSeo: settings.seo.default,
    title: 'Our Practitioners & Partners',
    description: 'Meet the yoga teachers, healers and wellness practitioners who bring Nefertiti retreats in Egypt to life.',
    path: '/partners',
  })
}

export default async function PartnersPage() {
  const partners = await getPartners()

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={s.partnersHero}>
        <p className="eyebrow">◆ OUR TEAM</p>
        <h1 className={s.partnersHeroTitle}>
          Meet the Practitioners Behind<br />Your Healing Journey
        </h1>
      </section>

      <section className="section inner-section">
        <div className="team-grid">
          {partners.map((p) => (
            <div className="team-card reveal is-in" key={p.id}>
              <Link href={`/partners/${p.id}`} className="team-card-media">
                <img src={p.image} alt={p.name} />
              </Link>
              <Link href={`/partners/${p.id}`} className="team-card-name">{p.name}</Link>
              <p className="team-card-role">{p.category}</p>
              {(p.instagram || p.x || p.tiktok) && (
                <div className="team-card-socials">
                  {p.instagram && <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on Instagram`}>IN</a>}
                  {p.x && <a href={`https://x.com/${p.x}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on X`}>X</a>}
                  {p.tiktok && <a href={`https://tiktok.com/@${p.tiktok}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on TikTok`}>TT</a>}
                </div>
              )}
            </div>
          ))}
        </div>

        <a href="/contact" className="button button-gold inner-cta">
          Become a Partner <ArrowUpRight size={16} />
        </a>
      </section>

      <SiteFooter />
    </main>
  )
}
