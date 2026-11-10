import { ArrowUpRight } from 'lucide-react'
import Img from '@/components/Img'
import { fitUrl } from '@/sanity/lib/image'
import type { Collaboration } from '@/lib/data'
import s from '@/components/Collaborations.module.css'

// One company or brand: logo, name, country, a short text and a link to its website
export default function CollaborationCard({ item }: { item: Collaboration }) {
  const logo = item.logo ? fitUrl(item.logo, 480) : ''
  return (
    <article className={`${s.card} reveal`}>
      {logo && (
        <div className={s.logoBox}>
          <Img src={logo} alt={`${item.name} logo`} />
        </div>
      )}
      <h3 className={s.name}>{item.name}</h3>
      {item.country && <p className={s.country}>{item.country}</p>}
      {item.description && <p className={s.text}>{item.description}</p>}
      {item.website && (
        <a className={s.visit} href={item.website} target="_blank" rel="noopener noreferrer">
          Visit website <ArrowUpRight size={13} />
        </a>
      )}
    </article>
  )
}
