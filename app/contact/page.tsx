'use client'

import { useState } from 'react'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import {
  images, socialLinks, egyptMapEmbed, egyptMapLink,
  whatsappLink, appointmentServices, faqs,
} from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import styles from './contact.module.css'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', practice: '', message: '',
  })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="inner-page">
      <SiteNav solid />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={`${styles.backWrap} hero-back`}>
          <BackButton />
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section className={styles.section}>
        <div className={styles.contactLayout}>
          {/* Left — enquiry form */}
          <div className={styles.formSide}>
            <p className="eyebrow">◆ OPTION 1 · SEND AN ENQUIRY</p>
            <h2 className={styles.heading}>Tell us about your retreat</h2>

            {sent ? (
              <div className={styles.success}>
                <h3>Message sent ✓</h3>
                <p>Thank you for reaching out — we&apos;ll get back to you within 48 hours.</p>
              </div>
            ) : (
              <div className={styles.form}>
                <div className={styles.fieldFull}>
                  <label>Your Name</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Your Name" />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address" />
                  </div>
                  <div className={styles.field}>
                    <label>Phone / WhatsApp</label>
                    <input name="phone" value={form.phone} onChange={handle} placeholder="Phone Number" />
                  </div>
                </div>

                <div className={styles.fieldFull}>
                  <label>Type of Retreat</label>
                  <select name="practice" value={form.practice} onChange={handle}>
                    <option value="">Select a service</option>
                    {appointmentServices.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className={styles.fieldFull}>
                  <label>Message</label>
                  <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us what you teach, who you serve, and what you'd love them to experience." rows={5} />
                </div>

                <button className={styles.submitBtn} onClick={submit}>Send Message</button>
              </div>
            )}
          </div>

          {/* Right — discovery + socials */}
          <div className={styles.callSide}>
            <div className={styles.discoveryCard}>
              <p className="eyebrow">◆ OPTION 2 · TALK TO US</p>
              <h2 className={styles.heading}>Book a discovery call</h2>
              <p className={styles.discoveryText}>
                Prefer to talk it through? Message us on WhatsApp and we&apos;ll find a time
                to explore your retreat together.
              </p>
              <a className="button button-gold" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>

            <div className={styles.socials}>
              <p className={styles.socialsTitle}>Social Media</p>
              {socialLinks.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  {label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className={styles.map}>
        <iframe
          title="Egypt"
          src={egyptMapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <div className={styles.faqLayout}>
          <div className={styles.faqIntro}>
            <p className="eyebrow">◆ FAQ</p>
            <h2 className={styles.faqTitle}>Frequently Asked<br />Questions</h2>
            <p className={styles.faqLead}>Still have a question? Send us a message or reach out on WhatsApp.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-gold">
              Ask on WhatsApp <ArrowUpRight size={14} />
            </a>
          </div>

          <div className={styles.faqList}>
            {faqs.map(([q, a], i) => (
              <div className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`} key={q}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{q}</span>
                  <span className={styles.faqIcon}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}><p>{a}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
