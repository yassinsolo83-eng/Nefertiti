'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { dateKey, generateSlots, type BookingSettings } from '@/lib/booking'
import s from '@/app/[lang]/pre-call/pre-call.module.css'
import { useUi } from '@/components/LocaleProvider'

type Props = {
  settings: BookingSettings
  booked: number[] | null // null while loading
  value: number | null
  onChange: (slot: number) => void
  error?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function BookingCalendar({ settings, booked, value, onChange, error }: Props) {
  const t = useUi().preCall.booking
  const lang = t.dateLocale
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])

  // All open times, grouped by the visitor's own date
  const byDay = useMemo(() => {
    const map = new Map<string, number[]>()
    for (const ts of generateSlots(settings)) {
      const key = dateKey(ts, tz)
      const list = map.get(key)
      if (list) list.push(ts)
      else map.set(key, [ts])
    }
    return map
  }, [settings, tz])

  const keys = useMemo(() => [...byDay.keys()].sort(), [byDay])
  const bookedSet = useMemo(() => new Set(booked || []), [booked])

  const [day, setDay] = useState<string | null>(value ? dateKey(value, tz) : null)
  const firstKey = day || keys[0]
  const [month, setMonth] = useState(() => (firstKey ? { y: Number(firstKey.slice(0, 4)), m: Number(firstKey.slice(5, 7)) - 1 } : null))

  useEffect(() => {
    if (!month && keys[0]) setMonth({ y: Number(keys[0].slice(0, 4)), m: Number(keys[0].slice(5, 7)) - 1 })
  }, [keys, month])

  if (!keys.length || !month) return <p className={s.calEmpty}>{t.noTimes}</p>

  const monthKey = (y: number, m: number) => `${y}-${pad(m + 1)}`
  const firstMonth = keys[0].slice(0, 7)
  const lastMonth = keys[keys.length - 1].slice(0, 7)
  const current = monthKey(month.y, month.m)
  const shift = (n: number) => {
    const d = new Date(Date.UTC(month.y, month.m + n, 1))
    setMonth({ y: d.getUTCFullYear(), m: d.getUTCMonth() })
  }

  const monthLabel = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(month.y, month.m, 1)))
  // Weekday headers, Monday first (1 Jan 2024 was a Monday)
  const weekdayFmt = new Intl.DateTimeFormat(lang, { weekday: 'short', timeZone: 'UTC' })
  const weekdays = Array.from({ length: 7 }, (_, i) => weekdayFmt.format(new Date(Date.UTC(2024, 0, 1 + i))))
  const lead = (new Date(Date.UTC(month.y, month.m, 1)).getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate()

  const timeFmt = new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz })
  const dayFmt = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  const times = day ? byDay.get(day) || [] : []

  return (
    <div className={`${s.calendar} ${error ? s.hasError : ''}`} id="q-booking">
      <div className={s.calHead}>
        <button type="button" className={s.calNav} onClick={() => shift(-1)} disabled={current <= firstMonth} aria-label={t.prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <span className={s.calMonth}>{monthLabel}</span>
        <button type="button" className={s.calNav} onClick={() => shift(1)} disabled={current >= lastMonth} aria-label={t.nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={s.calGrid}>
        {weekdays.map((w) => (
          <span key={w} className={s.calWeekday}>{w}</span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const key = `${current}-${pad(i + 1)}`
          const open = byDay.has(key)
          return (
            <button
              key={key}
              type="button"
              disabled={!open}
              onClick={() => setDay(key)}
              className={`${s.calDay} ${open ? s.calDayOpen : ''} ${day === key ? s.calDayOn : ''}`}
              aria-pressed={day === key}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <p className={s.qHelp}>{t.tzNote(tz)}</p>

      {day ? (
        <div className={s.calTimes}>
          <span className={s.qLabel}>{dayFmt.format(new Date(`${day}T00:00:00Z`))}</span>
          {booked === null ? (
            <p className={s.qHelp}>{t.loading}</p>
          ) : (
            <div className={s.choices} role="radiogroup">
              {times.map((ts) => {
                const taken = bookedSet.has(ts)
                const on = value === ts
                return (
                  <button
                    key={ts}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={taken}
                    onClick={() => onChange(ts)}
                    className={`${s.choice} ${on ? s.choiceOn : ''} ${taken ? s.choiceTaken : ''}`}
                  >
                    {timeFmt.format(new Date(ts))}
                    {taken && <span className={s.takenLabel}>{t.booked}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <p className={s.qHelp}>{t.pickDay}</p>
      )}

      {error && <p className={s.qError} role="alert">{error}</p>}
    </div>
  )
}
