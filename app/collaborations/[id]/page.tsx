import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { getCollaborations, getSiteSettings } from '@/sanity/lib/queries'
import { fitUrl } from '@/sanity/lib/image'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import Img from '@/components/Img'
import s from '@/components/Collaborations.module.css'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const [items, settings] = await Promise.all([getCollaborations(), getSiteSettings()])
  const item = items.find((c) => c.id === id)
  if (!item) return { title: 'Collaboration not found', robots: { index: false } }
  return buildMetadata({
    seo: null,
    fallbackSeo: settings.seo.default,
    title: item.name,
    description: item.description || `${item.name}, a Nefertiti Retreats collaboration.`,
    path: `/collaborations/${id}`,
  })
}

// One company or brand: a big place for the logo and a place for the text
export default async function CollaborationDetailPage({ params }: Params) {
  const { id } = await params
  const items = await getCollaborations()
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
            {logo ? <Img src={logo} alt={`${item.name} logo`} /> : <span className={s.detailInitial}>{item.name.charAt(0)}</span>}
          </div>

          <div className={s.detailText}>
            {item.country && <p className={s.detailCountry}>{item.country}</p>}
            <h1 className={s.detailName}>{item.name}</h1>
            {item.description && <p className={s.detailBody}>{item.description}</p>}
            <div className={s.detailActions}>
              {item.website && (
                <a className="button button-gold inner-cta" href={item.website} target="_blank" rel="noopener noreferrer">
                  Visit website <ArrowUpRight size={16} />
                </a>
              )}
              <Link href="/collaborations" className={s.detailAll}>All collaborations</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
