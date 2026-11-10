'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Motif from '@/components/Motif'

const KEY = 'nef-comfort'

type Prefs = {
  text: 'standard' | 'large' | 'largest'
  contrast: 'standard' | 'high'
  motion: 'standard' | 'still'
  links: 'standard' | 'underlined'
}

const DEFAULTS: Prefs = { text: 'standard', contrast: 'standard', motion: 'standard', links: 'standard' }

function apply(p: Prefs) {
  const d = document.documentElement
  d.dataset.cText = p.text
  d.dataset.cContrast = p.contrast
  d.dataset.cMotion = p.motion
  d.dataset.cLinks = p.links
}

function load(): Prefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULTS
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M8 1.5 3.5 6 8 10.5' : 'M4 1.5 8.5 6 4 10.5'} />
    </svg>
  )
}

function Group<K extends keyof Prefs>({
  label, note, name, value, options, onPick,
}: {
  label: string
  note?: string
  name: K
  value: Prefs[K]
  options: [Prefs[K], string][]
  onPick: (name: K, v: Prefs[K]) => void
}) {
  return (
    <div className="cf-group" role="group" aria-label={label}>
      <h3 className="cf-label">{label}</h3>
      <div className="cf-opts">
        {options.map(([v, text]) => (
          <button
            key={String(v)}
            type="button"
            className="cf-opt"
            aria-pressed={value === v}
            onClick={() => onPick(name, v)}
          >
            {text}
          </button>
        ))}
      </div>
      {note && <p className="cf-note">{note}</p>}
    </div>
  )
}

export default function ComfortPanel() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'left' | 'right'>('left')
  const [tucked, setTucked] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  const [reading, setReading] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const [hasSelection, setHasSelection] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const p = load()
    setPrefs(p)
    apply(p)
    try {
      const d = JSON.parse(localStorage.getItem(KEY + '-dock') || '{}')
      if (d.side === 'right') setSide('right')
      if (d.tucked) setTucked(true)
    } catch {}
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  const stop = useCallback(() => {
    try { window.speechSynthesis.cancel() } catch {}
    setReading(false)
  }, [])

  useEffect(() => () => { try { window.speechSynthesis?.cancel() } catch {} }, [])

  const close = useCallback(() => {
    setOpen(false)
    btnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const pick = <K extends keyof Prefs>(name: K, v: Prefs[K]) => {
    const next = { ...prefs, [name]: v }
    setPrefs(next)
    apply(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  }

  const reset = () => {
    setPrefs(DEFAULTS)
    apply(DEFAULTS)
    try { localStorage.removeItem(KEY) } catch {}
  }

  const dock = (nextSide: 'left' | 'right', nextTucked: boolean) => {
    setSide(nextSide)
    setTucked(nextTucked)
    if (nextTucked) setOpen(false)
    try { localStorage.setItem(KEY + '-dock', JSON.stringify({ side: nextSide, tucked: nextTucked })) } catch {}
  }

  const toggle = () => {
    if (!open) setHasSelection(!!window.getSelection()?.toString().trim())
    setOpen((o) => !o)
  }

  const read = () => {
    if (reading) return stop()
    const sel = window.getSelection()?.toString().trim()
    const source = sel || (document.querySelector('main') as HTMLElement | null)?.innerText || document.body.innerText
    const text = source.replace(/\s+/g, ' ').trim()
    if (!text) return
    // Long utterances get cut off by some browsers, so speak sentence-sized pieces in order.
    const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text]
    const chunks: string[] = []
    let cur = ''
    for (const s of parts) {
      if ((cur + s).length > 220 && cur) { chunks.push(cur); cur = s } else cur += s
    }
    if (cur) chunks.push(cur)
    window.speechSynthesis.cancel()
    setReading(true)
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c)
      u.lang = 'en-GB'
      u.rate = 0.95
      if (i === chunks.length - 1) { u.onend = () => setReading(false); u.onerror = () => setReading(false) }
      window.speechSynthesis.speak(u)
    })
  }

  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULTS)

  return (
    <div className="nef-comfort">
      <div className={`cf-dock cf-${side}${tucked ? ' is-tucked' : ''}`}>
        <button
          type="button"
          className="cf-arrow cf-arrow-out"
          aria-label={tucked ? 'Bring the comfort button back' : `Tuck the comfort button into the ${side} edge`}
          onClick={() => dock(side, !tucked)}
        >
          <Chevron dir={tucked ? (side === 'left' ? 'right' : 'left') : side} />
        </button>
        <button
          ref={btnRef}
          type="button"
          className="cf-ball"
          aria-expanded={open}
          aria-controls="cf-panel"
          aria-label="Comfort settings"
          tabIndex={tucked ? -1 : 0}
          onClick={toggle}
        >
          <span className="cf-ball-icon" aria-hidden="true"><Motif name="sun" height={24} /></span>
          {changed && <span className="cf-dot" aria-label="Custom settings on" />}
        </button>
        <button
          type="button"
          className="cf-arrow cf-arrow-in"
          aria-label={`Move the comfort button to the ${side === 'left' ? 'right' : 'left'} side`}
          tabIndex={tucked ? -1 : 0}
          onClick={() => dock(side === 'left' ? 'right' : 'left', false)}
        >
          <Chevron dir={side === 'left' ? 'right' : 'left'} />
        </button>
      </div>

      {open && (
        <>
          <div className="cf-back" onClick={close} />
          <div
            id="cf-panel"
            ref={panelRef}
            tabIndex={-1}
            className={`cf-panel cf-panel-${side}`}
            role="dialog"
            aria-label="Comfort settings"
          >
            <div className="cf-band" aria-hidden="true" />
            <div className="cf-head">
              <div>
                <p className="cf-eyebrow">Comfort</p>
                <h2 className="cf-title">Make this page easier on the eyes</h2>
              </div>
              <button type="button" className="cf-close" onClick={close} aria-label="Close comfort settings">×</button>
            </div>

            <div className="cf-body">
              {canSpeak && (
                <div className="cf-group">
                  <h3 className="cf-label">Listen</h3>
                  <button type="button" className="cf-read" onClick={read}>
                    {reading ? 'Stop reading' : hasSelection ? 'Read the selected text' : 'Read this page aloud'}
                  </button>
                  <p className="cf-note">Highlight a passage before opening this panel to hear only that part.</p>
                </div>
              )}

              <Group label="Text size" name="text" value={prefs.text} onPick={pick}
                options={[['standard', 'Standard'], ['large', 'Larger'], ['largest', 'Largest']]} />

              <Group label="Contrast" name="contrast" value={prefs.contrast} onPick={pick}
                options={[['standard', 'As designed'], ['high', 'Stronger']]} />

              <Group label="Links" name="links" value={prefs.links} onPick={pick}
                options={[['standard', 'As designed'], ['underlined', 'Underline all']]} />

              <Group label="Motion" name="motion" value={prefs.motion} onPick={pick}
                note="If your device is set to reduce motion, the site already follows it."
                options={[['standard', 'As designed'], ['still', 'Calm']]} />

              <div className="cf-foot">
                <button type="button" className="cf-reset" onClick={reset} disabled={!changed}>Reset all</button>
                <p className="cf-note">
                  Choices stay on this device only. <Link href="/privacy#cookies" onClick={close}>Cookie notice</Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
