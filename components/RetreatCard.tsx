import Link from 'next/link'
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react'
import type { Retreat } from '@/lib/data'
import { formatRetreatDates, retreatNights, STATUS_LABELS } from '@/lib/retreat-utils'
import s from '@/app/retreats/retreats.module.css'

// Shared retreat card — used on /retreats and on the home page
export default function RetreatCard({ r, past }: { r: Retreat; past?: boolean }) {
  const nights = retreatNights(r.startDate, r.endDate)
  return (
    <Link href={`/retreats/${r.id}`} className={`${s.card} ${past ? s.cardPast : ''}`}>
      <div className={s.cardMedia}>
        <img src={r.image} alt={r.title} loading="lazy" />
        <span className={`${s.badge} ${past ? s.badgePast : s[`badge_${r.status}`]}`}>
          {past ? 'Past retreat' : STATUS_LABELS[r.status]}
        </span>
      </div>
      <div className={s.cardBody}>
        <div className={s.cardMeta}>
          {r.destination && (
            <span><MapPin size={13} /> {r.destination.title}</span>
          )}
          <span><Calendar size={13} /> {formatRetreatDates(r.startDate, r.endDate)}</span>
        </div>
        <h3 className={s.cardTitle}>{r.title}</h3>
        {r.summary && <p className={s.cardSummary}>{r.summary}</p>}
        <span className={s.cardLink}>
          {nights > 0 && <em>{nights} nights</em>}
          View retreat <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  )
}
