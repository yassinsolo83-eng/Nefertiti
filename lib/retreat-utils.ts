import type { Retreat, RetreatStatus } from '@/lib/data'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parse(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return { y, m, d }
}

// Today's date in Egypt, as YYYY-MM-DD, so "past" flips at local midnight
function todayInEgypt() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date())
}

export function isPastRetreat(r: Retreat) {
  return Boolean(r.endDate) && r.endDate < todayInEgypt()
}

// "12 – 19 March 2027", "28 March – 4 April 2027", "30 Dec 2026 – 5 Jan 2027"
export function formatRetreatDates(start: string, end: string) {
  if (!start) return ''
  const a = parse(start)
  if (!end || end === start) return `${a.d} ${MONTHS[a.m - 1]} ${a.y}`
  const b = parse(end)
  if (a.y === b.y && a.m === b.m) return `${a.d} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m - 1]} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`
  return `${a.d} ${MONTHS[a.m - 1].slice(0, 3)} ${a.y} – ${b.d} ${MONTHS[b.m - 1].slice(0, 3)} ${b.y}`
}

export function retreatNights(start: string, end: string) {
  if (!start || !end) return 0
  const ms = Date.UTC(...toUtc(end)) - Date.UTC(...toUtc(start))
  return Math.max(0, Math.round(ms / 86_400_000))
}

function toUtc(date: string): [number, number, number] {
  const { y, m, d } = parse(date)
  return [y, m - 1, d]
}

export const STATUS_LABELS: Record<RetreatStatus, string> = {
  open: 'Open for booking',
  few: 'Few spots left',
  soldout: 'Sold out',
  soon: 'Coming soon',
}

export function splitRetreats(retreats: Retreat[]) {
  const upcoming = retreats.filter((r) => !isPastRetreat(r)).sort((a, b) => a.startDate.localeCompare(b.startDate))
  const past = retreats.filter(isPastRetreat).sort((a, b) => b.startDate.localeCompare(a.startDate))
  return { upcoming, past }
}
