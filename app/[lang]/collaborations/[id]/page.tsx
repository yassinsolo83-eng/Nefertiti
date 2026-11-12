import type { Metadata } from 'next'
import Link from '@/components/LocLink'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { currentLocale, getCollaborations, getSiteSettings } from '@/sanity/lib/queries'
import { getUi } from '@/lib/ui'
import { fitUrl } from '@/sanity/lib/image'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import Img from '@/components/Img'
import s from '@/components/Collaborations.module.css'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const [items, settings, locale] = await Promise.all([getCollaborations(), getSiteSettings(), currentLocale()])
  const m = getUi(locale).meta.collaborations
  const item = items.find((c) => c.id === id)
  if (!item) return { title: m.notFound, robots: { index: false } }
  return buildMetadata({
    seo: null,
    fallbackSeo: settings.seo.default,
    title: item.name,
    description: item.description || m.fallback(item.name),
    path: `/collaborations/${id}`,
  })
}

// One company or brand: a big place for the logo and a place for the text
export default async function CollaborationDetailPage({ params }: Params) {
  const { id } = await params
  const [items, locale] = await Promise.all([getCollaborations(), currentLocale()])
  const t = getUi(locale).detail
  const item = items.find((c) => c.id === id)
  if (!item) return notFound()

  const logo = item.logo ? fitUrl(item.logo, 900) : ''

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={s.detail}>
        <div className="dest-index-back"><BackButton /></div>

        <div className={s.detailGrid}>
          <div className={s.detailImage}>
            {logo ? <Img src={logo} alt={t.collabLogo(item.name)} /> : <span className={s.detailInitial}>{item.name.charAt(0)}</span>}
          </div>

          <div className={s.detailText}>
            {item.country && <p className={s.detailCountry}>{item.country}</p>}
            <h1 className={s.detailName}>{item.name}</h1>
            {item.description && <p className={s.detailBody}>{item.description}</p>}
            <div className={s.detailActions}>
              {item.website && (
                <a className="button button-gold inner-cta" href={item.website} target="_blank" rel="noopener noreferrer">
                  {t.visit} <ArrowUpRight size={16} />
                </a>
              )}
              <Link href="/collaborations" className={s.detailAll}>{t.allCollabs}</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
