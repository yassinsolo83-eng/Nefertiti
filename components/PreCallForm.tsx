'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import {
  OTHER_LABEL,
  otherKey,
  validateQuestion,
  type PreCallAnswers,
  type PreCallForm as PreCallFormData,
  type PreCallQuestion,
} from '@/lib/preCallForm'
import s from '@/app/pre-call/pre-call.module.css'

const DRAFT_KEY = 'nefertiti-pre-call-draft'

type Props = { form: PreCallFormData }

// Browser storage can be missing or blocked (private windows, previews) — never let it break the form
function loadDraft(): { answers: PreCallAnswers; step: number } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function saveDraft(answers: PreCallAnswers, step: number) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, step }))
  } catch {}
}
function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {}
}

export default function PreCallForm({ form }: Props) {
  const steps = form.steps
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<PreCallAnswers>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState('')
  const [sent, setSent] = useState(false)
  const [company, setCompany] = useState('') // honeypot
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Restore an unfinished form
  useEffect(() => {
    const draft = loadDraft()
    if (draft?.answers) {
      setAnswers(draft.answers)
      setStepIdx(Math.min(Math.max(0, draft.step || 0), steps.length - 1))
    }
    setLoaded(true)
  }, [steps.length])

  useEffect(() => {
    if (loaded && !sent) saveDraft(answers, stepIdx)
  }, [answers, stepIdx, loaded, sent])

  const step = steps[stepIdx]
  const isLast = stepIdx === steps.length - 1

  function scrollToCard() {
    const el = cardRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 110
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
  }

  function setAnswer(key: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function toggleMulti(q: PreCallQuestion, option: string) {
    const current = Array.isArray(answers[q._key]) ? (answers[q._key] as string[]) : []
    setAnswer(q._key, current.includes(option) ? current.filter((o) => o !== option) : [...current, option])
  }

  function checkStep() {
    const found: Record<string, string> = {}
    for (const q of step.questions) {
      const err = validateQuestion(q, answers)
      if (err) found[q._key] = err
    }
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`q-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  function next() {
    if (!checkStep()) return
    setStepIdx((i) => Math.min(i + 1, steps.length - 1))
    scrollToCard()
  }

  function back() {
    setErrors({})
    setStepIdx((i) => Math.max(i - 1, 0))
    scrollToCard()
  }

  // Steps already passed can be reopened from the progress bar
  function goTo(i: number) {
    if (i < stepIdx) {
      setErrors({})
      setStepIdx(i)
      scrollToCard()
    }
  }

  async function submit() {
    if (!checkStep()) return
    setSending(true)
    setFormError('')
    try {
      const res = await fetch('/api/pre-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, company }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        clearDraft()
        setSent(true)
        scrollToCard()
        return
      }
      // The server found a missing answer on an earlier step: take the visitor there
      if (data?.errors && typeof data.errors === 'object') {
        const keys = Object.keys(data.errors)
        const idx = steps.findIndex((st) => st.questions.some((q) => keys.includes(q._key)))
        if (idx >= 0) setStepIdx(idx)
        setErrors(data.errors)
        setFormError('Some answers need a second look.')
      } else {
        setFormError('Something went wrong. Please try again, or message us on WhatsApp.')
      }
    } catch {
      setFormError('Could not send your answers. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div ref={cardRef} className={`${s.card} ${s.success}`}>
        <span className={s.successIcon}><Check size={26} /></span>
        <h2 className={s.successTitle}>{form.successTitle}</h2>
        {form.successText.split(/\n{2,}/).map((p, i) => (
          <p key={i} className={s.successText}>{p}</p>
        ))}
        {form.successSignature && <p className={s.signature}>{form.successSignature}</p>}
        <a href="/" className="button button-gold">Back to home</a>
      </div>
    )
  }

  const progress = ((stepIdx + 1) / steps.length) * 100

  return (
    <div ref={cardRef} className={s.card}>
      {/* Progress */}
      <div className={s.progress}>
        <div className={s.progressMeta}>
          <span>Step {stepIdx + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={s.progressTrack}>
          <div className={s.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <ol className={s.stepList}>
          {steps.map((st, i) => (
            <li key={st._key}>
              <button
                type="button"
                onClick={() => goTo(i)}
                disabled={i >= stepIdx}
                className={`${s.stepDot} ${i === stepIdx ? s.stepCurrent : ''} ${i < stepIdx ? s.stepDone : ''}`}
                aria-current={i === stepIdx ? 'step' : undefined}
              >
                <span className={s.stepNum}>{i < stepIdx ? <Check size={12} /> : i + 1}</span>
                <span className={s.stepLabel}>{st.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Current step */}
      <div key={step._key} className={s.stepBody}>
        <h2 className={s.stepTitle}>{step.title}</h2>
        {step.description && <p className={s.stepDesc}>{step.description}</p>}

        <div className={s.questions}>
          {step.questions.map((q) => (
            <Question
              key={q._key}
              q={q}
              answers={answers}
              error={errors[q._key]}
              onText={(v) => setAnswer(q._key, v)}
              onOther={(v) => setAnswer(otherKey(q._key), v)}
              onToggle={(o) => toggleMulti(q, o)}
            />
          ))}
        </div>

        {/* Honeypot field: invisible to people, bots tend to fill it */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
        />

        {isLast && (
          <p className={s.privacy}>
            By sending this form you agree that we use your answers to prepare our call, as described in our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        )}

        {formError && <p className={s.formError}>{formError}</p>}

        <div className={s.nav}>
          {stepIdx > 0 ? (
            <button type="button" className={s.backBtn} onClick={back}>
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <span className={s.requiredNote}><span className={s.star}>*</span> Required</span>
          )}
          {isLast ? (
            <button type="button" className={s.nextBtn} onClick={submit} disabled={sending}>
              {sending ? 'Sending…' : form.submitLabel} {!sending && <ArrowRight size={15} />}
            </button>
          ) : (
            <button type="button" className={s.nextBtn} onClick={next}>
              Continue <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type QuestionProps = {
  q: PreCallQuestion
  answers: PreCallAnswers
  error?: string
  onText: (v: string) => void
  onOther: (v: string) => void
  onToggle: (option: string) => void
}

function Question({ q, answers, error, onText, onOther, onToggle }: QuestionProps) {
  const value = answers[q._key]
  const id = `q-${q._key}`
  const label = (
    <span className={s.qLabel}>
      {q.label} {q.required && <span className={s.star} aria-label="required">*</span>}
    </span>
  )
  const help = q.help ? <span className={s.qHelp}>{q.help}</span> : null
  const err = error ? <p className={s.qError} role="alert">{error}</p> : null

  if (q.type === 'single' || q.type === 'multiple') {
    const options = [...(q.options || []), ...(q.allowOther ? [OTHER_LABEL] : [])]
    const picked = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o)
    const otherOn = q.allowOther && picked(OTHER_LABEL)
    return (
      <fieldset id={id} className={`${s.question} ${error ? s.hasError : ''}`}>
        <legend>{label}</legend>
        {help}
        {q.type === 'multiple' && <span className={s.qHint}>Choose all that apply</span>}
        <div className={s.choices} role={q.type === 'single' ? 'radiogroup' : 'group'}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role={q.type === 'single' ? 'radio' : 'checkbox'}
              aria-checked={picked(o)}
              className={`${s.choice} ${picked(o) ? s.choiceOn : ''}`}
              onClick={() => (q.type === 'single' ? onText(picked(o) ? '' : o) : onToggle(o))}
            >
              <span className={q.type === 'single' ? s.radio : s.checkbox}>
                {picked(o) && (q.type === 'single' ? <span className={s.radioDot} /> : <Check size={11} />)}
              </span>
              {o}
            </button>
          ))}
        </div>
        {otherOn && (
          <input
            className={s.input}
            value={(answers[otherKey(q._key)] as string) || ''}
            onChange={(e) => onOther(e.target.value)}
            placeholder="Please specify"
            aria-label={`${q.label} — other`}
            autoFocus
          />
        )}
        {err}
      </fieldset>
    )
  }

  const text = typeof value === 'string' ? value : ''
  return (
    <div id={id} className={`${s.question} ${error ? s.hasError : ''}`}>
      <label htmlFor={`${id}-input`}>{label}</label>
      {help}
      {q.type === 'longText' ? (
        <textarea
          id={`${id}-input`}
          className={s.input}
          rows={4}
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder={q.placeholder || 'Your answer'}
        />
      ) : (
        <input
          id={`${id}-input`}
          className={s.input}
          type={q.type === 'email' ? 'email' : 'text'}
          inputMode={q.type === 'email' ? 'email' : q.type === 'url' ? 'url' : undefined}
          autoComplete={q.type === 'name' ? 'name' : q.type === 'email' ? 'email' : undefined}
          value={text}
          onChange={(e) => onText(e.target.value)}
          placeholder={q.placeholder || 'Your answer'}
        />
      )}
      {err}
    </div>
  )
}
