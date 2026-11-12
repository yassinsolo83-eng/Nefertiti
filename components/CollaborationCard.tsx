import Link from '@/components/LocLink'
import { ArrowUpRight } from 'lucide-react'
import Img from '@/components/Img'
import { fitUrl } from '@/sanity/lib/image'
import type { Collaboration } from '@/lib/data'
import s from '@/components/Collaborations.module.css'
import { useUi } from '@/components/LocaleProvider'

type Props = {
  item: Collaboration
  /** When set, the whole card opens this page (used on the home page). */
  href?: string
  /** Inner pages have no scroll animation, so the card must be visible straight away. */
  instant?: boolean
}

// One company or brand: logo, name, country, a short text and a link to its website
export default function CollaborationCard({ item, href, instant }: Props) {
  const t = useUi().collab
  const logo = item.logo ? fitUrl(item.logo, 480) : ''
  return (
    <article className={`${s.card} ${href ? s.cardLink : ''} reveal ${instant ? 'is-in' : ''}`}>
      {logo && (
        <div className={s.logoBox}>
          <Img src={logo} alt={t.logo(item.name)} />
        </div>
      )}
      <h3 className={s.name}>
        {href ? <Link href={href} className={s.cover}>{item.name}</Link> : item.name}
      </h3>
      {item.country && <p className={s.country}>{item.country}</p>}
      {item.description && <p className={s.text}>{item.description}</p>}
      {item.website && (
        <a className={s.visit} href={item.website} target="_blank" rel="noopener noreferrer">
          {t.visit} <ArrowUpRight size={13} />
        </a>
      )}
    </article>
  )
}
