'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import type { PageImages } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from '@/app/[lang]/contact/contact.module.css'
import { Ornament } from '@/components/Motif'
import { openWhatsapp } from '@/lib/openWhatsapp'
import EgyptMap from '@/components/EgyptMap'
import type { Destination } from '@/lib/data'
import Link from '@/components/LocLink'
import Img from '@/components/Img'
import { useLocale, useUi } from '@/components/LocaleProvider'

type Props = {
  faqs: [string, string][]
  whatsappLink: string
  socialLinks: [string, string][]
  appointmentServices: string[]
  pageImages: PageImages
  destinations: Destination[]
  featuredIds: string[]
}

export default function ContactPage({ faqs, whatsappLink, socialLinks, appointmentServices, pageImages, destinations, featuredIds }: Props) {
  const locale = useLocale()
  const t = useUi().contact
  const [form, setForm] = useState({
    name: '', email: '', phone: '', practice: '', message: '',
  })
  const [sent, setSent] = useState(false)
  const [waUrl, setWaUrl] = useState('')
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [company, setCompany] = useState('') // honeypot — hidden from real visitors
  const [retreat, setRetreat] = useState('')

  // Arriving from a retreat page: /contact?retreat=<retreat name>
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get('retreat')?.trim().slice(0, 200)
    if (!name) return
    setRetreat(name)
    setForm((p) => (p.message ? p : { ...p, message: t.interested(name) }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (sending) return

    // Quick checks in the browser; the server validates again
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = t.errName
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t.errEmail
    if (form.message.trim().length < 10) next.message = t.errMessage
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    setSending(true)
    try {
      const res = await fetch(`/api/enquiry?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company, retreat }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSent(true)
        if (data.whatsappUrl && !openWhatsapp(data.whatsappUrl)) setWaUrl(data.whatsappUrl)
      } else if (data.errors) {
        setErrors(data.errors)
      } else {
        setFormError(t.errGeneric)
      }
    } catch {
      setFormError(t.errConnect)
    } finally {
      setSending(false)
    }
  }

  const errorStyle = { color: '#b3261e', fontSize: 12, marginTop: 6 } as const

  return (
    <main className="inner-page">
      <SiteNav solid />

      {/* Page hero */}
      <section className="page-hero">
        <div className="page-hero-text reveal is-in">
          <BackButton />
          <p className="eyebrow">{t.eyebrow}</p>
<Ornament name="sun" />
          <h1 className="page-title">{t.title}</h1>
          <p className="page-lead">
            {t.lead}
          </p>
        </div>
        <div className="page-hero-image reveal is-in">
          <Img priority src={pageImages.contactHero} alt={t.heroAlt} />
        </div>
      </section>

      {/* Two clear paths */}
      <section className={s.contactBlock}>
        {/* Left — pre-call form (main path) + details */}
        <div className={`${s.contactLeft} reveal is-in`}>
          <div className={s.discoveryCard}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>{t.planning}</p>
            <h2 className={s.discoveryTitle}>{t.discoveryTitle}</h2>
            <p className={s.discoveryText}>
              {t.discoveryText}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <Link className="button button-berry" href="/pre-call">
                {t.fillForm} <ArrowUpRight size={16} />
              </Link>
              {whatsappLink && (
<a className="button button-ghost-dark" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> {t.chatWa}
              </a>
)}
            </div>
            <p style={{ fontSize: 11, opacity: 0.6, marginTop: 14 }}>
              {t.talkFirst}
            </p>
          </div>

          <div className={s.contactDetailImage}>
            <Img src={pageImages.contactSide} alt={t.sideAlt} />
          </div>

          <div className={s.contactSocial}>
            <p className={s.contactSocialTitle}>{t.social}</p>
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={12} /></a>
            ))}
          </div>
        </div>
        {/* Right — quick question form */}
        <div id="enquiry" className={`${s.contactRight} reveal is-in`} style={{ scrollMarginTop: 120 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>{t.quick}</p>
          <h2 className={s.contactBlockTitle} style={{ marginBottom: 12 }}>{t.sendTitle}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.75, marginBottom: 30 }}>
            {t.sendLead}
          </p>

          {sent ? (
            <div className={s.formSuccess}>
              <Img className={s.successStamp} src="/brand/stamp.webp" alt="" />
              <h3>{t.sentTitle}</h3>
              <p>{t.sentText}</p>
              {waUrl && (
                <a className="button button-gold" href={waUrl} target="_blank" rel="noopener noreferrer">{t.sendWa}</a>
              )}
            </div>
          ) : (
            <div className={s.contactSimpleForm}>
              {retreat && (
                <p style={{ fontSize: 12, color: 'var(--primary)', marginBottom: 18 }}>
                  {t.enquiring} <strong>{retreat}</strong>
                </p>
              )}
              <div className="form-field full">
                <label>{t.yourName}</label>
                <input name="name" value={form.name} onChange={handle} placeholder={t.yourName} />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>{t.email}</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder={t.email} />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>
                <div className="form-field">
                  <label>{t.phone}</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder={t.phonePh} />
                </div>
              </div>

              <div className="form-field full">
                <label>{t.retreatType}</label>
                <select name="practice" value={form.practice} onChange={handle}>
                  <option value="">{t.selectService}</option>
                  {appointmentServices.map((svc) => <option key={svc}>{svc}</option>)}
                </select>
              </div>

              <div className="form-field full">
                <label>{t.message}</label>
                <textarea name="message" value={form.message} onChange={handle} placeholder={t.messagePh} rows={5} />
                {errors.message && <p style={errorStyle}>{errors.message}</p>}
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

              {formError && <p style={errorStyle}>{formError}</p>}

              <p style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
                {t.consentBefore}{' '}
                <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t.privacy}</Link>.
              </p>

              <button
                className={s.formSubmitFilled}
                onClick={submit}
                disabled={sending}
                style={sending ? { opacity: 0.6, cursor: 'wait' } : undefined}
              >
                {sending ? t.sending : t.send}
              </button>
            </div>
          )}
        </div>

      </section>

      {/* Egypt map */}
      <section className={s.contactMap}>
        <EgyptMap destinations={destinations} featuredIds={featuredIds} />
        <Link className={s.contactMapLink} href="/destinations">
          {t.seeAll}
        </Link>
      </section>

      {/* FAQ */}
      <section id="faq" className={`section ${s.faq}`}>
        <div className={s.faqGrid}>
          <div className="reveal is-in">
            <div className={s.faqAsideImage}>
              <Img src={pageImages.contactFaq} alt={t.faqAlt} />
            </div>
            <p className={s.faqAsideText}>{t.faqAside}</p>
            {whatsappLink && (
<a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-berry">{t.askWa} <ArrowUpRight size={16} /></a>
)}
          </div>

          <div className="reveal is-in">
            <div className="section-label">{t.faqLabel}</div>
            <h2 className={s.faqTitle}>{t.faqTitle}</h2>
            <div className={s.faqList}>
              {faqs.map(([q, a], i) => (
                <div className={`${s.faqItem} ${openFaq === i ? s.faqItemOpen : ''}`} key={q}>
                  <button className={s.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    <span>{q}</span>
                    <span className={s.faqIcon} aria-hidden="true">{openFaq === i ? '↑' : '↓'}</span>
                  </button>
                  <div className={s.faqAnswer}><p>{a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
