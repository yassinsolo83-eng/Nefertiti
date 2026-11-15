// ── Booking calendar (last step of the Pre-Call Form) ──
// Times are set in Cairo time in the Studio. Visitors see them in their own time zone.
// Shared by the browser (calendar) and the API (checks the chosen time).

export const CAIRO_TZ = 'Africa/Cairo'

export const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
export type Weekday = (typeof WEEKDAYS)[number]

export type BookingSettings = {
  title: string
  description: string
  days: Weekday[]
  startHour: number // first time, Cairo hour (0–23)
  endHour: number // times end at this Cairo hour (1–24)
  daysAhead: number
  blockedDates: string[] // YYYY-MM-DD (Cairo dates)
}

export const defaultBooking: BookingSettings = {
  title: 'Choose a time',
  description: 'Pick a day and a time that suits you.',
  days: ['sun', 'mon', 'tue', 'wed', 'thu'],
  startHour: 10,
  endHour: 18,
  daysAhead: 60,
  blockedDates: [],
}

export const italianBookingTexts = {
  title: 'Scegli un orario',
  description: 'Scegli il giorno e l’orario che preferisci.',
}

// Key used for the booking step inside the form
export const BOOKING_STEP_KEY = '__booking'

const HOUR = 3600_000
const DAY = 24 * HOUR

const pad = (n: number) => String(n).padStart(2, '0')

// Date and time of an instant in a time zone
function partsIn(tz: string, ms: number) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(ms))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0)
  return { year: get('year'), month: get('month') - 1, day: get('day'), hour: get('hour') % 24, minute: get('minute'), second: get('second') }
}

// Difference between the time zone's clock and UTC at an instant (follows summer time)
function offsetMs(tz: string, ms: number) {
  const p = partsIn(tz, ms)
  const asUtc = Date.UTC(p.year, p.month, p.day, p.hour, p.minute, p.second)
  return asUtc - Math.floor(ms / 1000) * 1000
}

// A Cairo date + hour → the exact instant (UTC milliseconds)
export function cairoToUtc(year: number, month: number, day: number, hour: number) {
  const guess = Date.UTC(year, month, day, hour)
  let ts = guess - offsetMs(CAIRO_TZ, guess)
  ts = guess - offsetMs(CAIRO_TZ, ts)
  return ts
}

// Every bookable time from now on (UTC milliseconds), oldest first
export function generateSlots(settings: BookingSettings, now = Date.now()): number[] {
  const today = partsIn(CAIRO_TZ, now)
  const blocked = new Set(settings.blockedDates)
  const out: number[] = []
  for (let i = 0; i <= settings.daysAhead; i++) {
    const date = new Date(Date.UTC(today.year, today.month, today.day) + i * DAY)
    const y = date.getUTCFullYear()
    const m = date.getUTCMonth()
    const d = date.getUTCDate()
    if (!settings.days.includes(WEEKDAYS[date.getUTCDay()])) continue
    if (blocked.has(`${y}-${pad(m + 1)}-${pad(d)}`)) continue
    for (let h = settings.startHour; h < settings.endHour; h++) {
      const ts = cairoToUtc(y, m, d, h)
      if (ts > now) out.push(ts)
    }
  }
  return out
}

export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || !tz || tz.length > 64) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

// YYYY-MM-DD of an instant in a time zone
export function dateKey(ms: number, tz: string) {
  const p = partsIn(tz, ms)
  return `${p.year}-${pad(p.month + 1)}-${pad(p.day)}`
}

// e.g. "Sunday, 16 November 2026, 10:00"
export function formatFull(ms: number, tz: string, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(ms))
}

export const formatCairo = (ms: number) => `${formatFull(ms, CAIRO_TZ)} (Cairo time)`

// Studio values → clean settings. Empty fields use the defaults.
export function normalizeBooking(raw: any): BookingSettings {
  const d = defaultBooking
  const hour = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : fallback
  const days = Array.isArray(raw?.bookingDays) ? raw.bookingDays.filter((v: unknown): v is Weekday => WEEKDAYS.includes(v as Weekday)) : []
  const startHour = hour(raw?.bookingStartHour, 0, 23, d.startHour)
  let endHour = hour(raw?.bookingEndHour, 1, 24, d.endHour)
  if (endHour <= startHour) endHour = Math.min(24, startHour + 1)
  const daysAhead = hour(raw?.bookingDaysAhead, 1, 365, d.daysAhead)
  const blockedDates = Array.isArray(raw?.bookingBlockedDates)
    ? raw.bookingBlockedDates.filter((v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v))
    : []
  return {
    title: d.title,
    description: d.description,
    days: days.length ? days : d.days,
    startHour,
    endHour,
    daysAhead,
    blockedDates,
  }
}
