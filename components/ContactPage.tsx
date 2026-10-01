'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { egyptMapEmbed, egyptMapLink } from '@/lib/data'
import type { PageImages } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import s from '@/app/contact/contact.module.css'

type Props = {
  faqs: [string, string][]
  whatsappLink: string
  socialLinks: [string, string][]
  appointmentServices: string[]
  pageImages: PageImages
}

export default function ContactPage({ faqs, whatsappLink, socialLinks, appointmentServices, pageImages }: Props) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', practice: '', message: '',
  })
  const [sent, setSent] = useState(false)
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
    setForm((p) => (p.message ? p : { ...p, message: `I'm interested in the retreat "${name}". ` }))
  }, [])
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (sending) return

    // Quick checks in the browser; the server validates again
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'Please tell us a little more (at least 10 characters).'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    setSending(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company, retreat }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSent(true)
      } else if (data.errors) {
        setErrors(data.errors)
      } else {
        setFormError('Something went wrong. Please try again, or message us on WhatsApp.')
      }
    } catch {
      setFormError('Could not connect. Please check your internet and try again.')
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
          <p className="eyebrow">GET IN TOUCH</p>
          <h1 className="page-title">Contact</h1>
          <p className="page-lead">
            Whether you have a question or a retreat idea taking shape, there are two easy
            ways to reach us — send an enquiry, or book a discovery call.
          </p>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={pageImages.contactHero} alt="A quiet moment of care" />
        </div>
      </section>

      {/* Two clear paths */}
      <section className={s.contactBlock}>
        {/* Left — enquiry form */}
        <div id="enquiry" className={`${s.contactRight} reveal is-in`} style={{ scrollMarginTop: 120 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>OPTION 1 · SEND AN ENQUIRY</p>
          <h2 className={s.contactBlockTitle}>Tell us about your retreat</h2>

          {sent ? (
            <div className={s.formSuccess}>
              <h3>Message sent.</h3>
              <p>Thank you for reaching out — we&apos;ll get back to you within 48 hours.</p>
            </div>
          ) : (
            <div className={s.contactSimpleForm}>
              {retreat && (
                <p style={{ fontSize: 12, color: 'var(--primary)', marginBottom: 18 }}>
                  Enquiring about: <strong>{retreat}</strong>
                </p>
              )}
              <div className="form-field full">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your Name" />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address" />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>
                <div className="form-field">
                  <label>Phone / WhatsApp</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="Phone Number" />
                </div>
              </div>

              <div className="form-field full">
                <label>Type of Retreat</label>
                <select name="practice" value={form.practice} onChange={handle}>
                  <option value="">Select a service</option>
                  {appointmentServices.map((svc) => <option key={svc}>{svc}</option>)}
                </select>
              </div>

              <div className="form-field full">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us what you teach, who you serve, and what you'd love them to experience." rows={5} />
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
                By sending this form you agree that we use your details to reply to your enquiry, as described in
                our{' '}
                <a href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>

              <button
                className={s.formSubmitFilled}
                onClick={submit}
                disabled={sending}
                style={sending ? { opacity: 0.6, cursor: 'wait' } : undefined}
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          )}
        </div>

        {/* Right — discovery call + details */}
        <div className={`${s.contactLeft} reveal is-in`}>
          <div className={s.discoveryCard}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>OPTION 2 · TALK TO US</p>
            <h2 className={s.discoveryTitle}>Book a discovery call</h2>
            <p className={s.discoveryText}>
              Prefer to talk it through? Message us on WhatsApp and we&apos;ll find a time
              to explore your retreat together.
            </p>
            <a className="button button-berry" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          <div className={s.contactDetailImage}>
            <img src={pageImages.contactSide} alt="Golden light on the water" />
          </div>

          <div className={s.contactSocial}>
            <p className={s.contactSocialTitle}>Social Media</p>
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={12} /></a>
            ))}
          </div>
        </div>
      </section>

      {/* Egypt map */}
      <section className={s.contactMap}>
        <iframe
          title="Egypt"
          src={egyptMapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a className={s.contactMapLink} href={egyptMapLink} target="_blank" rel="noopener noreferrer">
          View larger map
        </a>
      </section>

      {/* FAQ */}
      <section id="faq" className={`section ${s.faq}`}>
        <div className={s.faqGrid}>
          <div className="reveal is-in">
            <div className={s.faqAsideImage}>
              <img src={pageImages.contactFaq} alt="A quiet ritual moment" />
            </div>
            <p className={s.faqAsideText}>Still have a question? Send us a message above and our team will get back to you.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-berry">Ask on WhatsApp <ArrowUpRight size={16} /></a>
          </div>

          <div className="reveal is-in">
            <div className="section-label">FREQUENTLY ASKED</div>
            <h2 className={s.faqTitle}>Frequently Asked Questions</h2>
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
