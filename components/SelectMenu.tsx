'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import s from './SelectMenu.module.css'

type Props = {
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
  ariaLabel?: string
}

// Site dropdown in the brand colours (replaces the phone's built-in select list)
export default function SelectMenu({ value, options, placeholder, onChange, ariaLabel }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  // Close when tapping outside
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Keep the highlighted option in view
  useEffect(() => {
    if (open && active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function openMenu() {
    setActive(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }

  function pick(v: string) {
    onChange(v)
    setOpen(false)
  }

  function onKey(e: React.KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if ((e.key === 'Enter' || e.key === ' ') && active >= 0) {
      e.preventDefault()
      pick(options[active])
    }
  }

  return (
    <div ref={wrapRef} className={`${s.wrap} ${open ? s.open : ''}`}>
      <button
        type="button"
        className={s.trigger}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
      >
        <span className={value ? s.value : s.placeholder}>{value || placeholder}</span>
        <ChevronDown size={16} className={s.chevron} />
      </button>

      {open && (
        <ul ref={listRef} id={listId} role="listbox" className={s.list}>
          {options.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              className={`${s.option} ${o === value ? s.selected : ''} ${i === active ? s.active : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(o)}
            >
              <span>{o}</span>
              {o === value && <Check size={15} className={s.check} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
