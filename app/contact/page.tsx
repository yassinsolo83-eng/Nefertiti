'use client'

import { useState } from 'react'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import {
  images, socialLinks, egyptMapEmbed, egyptMapLink,
  whatsappLink, appointmentServices,
} from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', practice: '', message: '',
  })
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()
    setSent(true)
  }

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
          <img src={images.hammam} alt="A quiet moment of care" />
        </div>
      </section>

      {/* Two clear paths */}
      <section className="contact-block">
        {/* Left — enquiry form */}
        <div className="contact-right reveal is-in">
          <p className="eyebrow" style={{ marginBottom: 14 }}>OPTION 1 · SEND AN ENQUIRY</p>
          <h2 className="contact-block-title">Tell us about your retreat</h2>

          {sent ? (
            <div className="form-success">
              <h3>Message sent.</h3>
              <p>Thank you for reaching out — we&apos;ll get back to you within 48 hours.</p>
            </div>
          ) : (
            <div className="contact-simple-form">
              <div className="form-field full">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your Name" />
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address" />
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
                  {appointmentServices.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-field full">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us what you teach, who you serve, and what you'd love them to experience." rows={5} />
              </div>

              <button className="form-submit filled" onClick={submit}>Send Message</button>
            </div>
          )}
        </div>

        {/* Right — discovery call + details */}
        <div className="contact-left reveal is-in">
          <div className="discovery-card">
            <p className="eyebrow" style={{ marginBottom: 12 }}>OPTION 2 · TALK TO US</p>
            <h2 className="discovery-title">Book a discovery call</h2>
            <p className="discovery-text">
              Prefer to talk it through? Message us on WhatsApp and we&apos;ll find a time
              to explore your retreat together.
            </p>
            <a className="button button-berry" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          <div className="contact-detail-image">
            <img src={images.boat} alt="Golden light on the water" />
          </div>

          <div className="contact-social">
            <p className="contact-social-title">Social Media</p>
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={12} /></a>
            ))}
          </div>
        </div>
      </section>

      {/* Egypt map */}
      <section className="contact-map">
        <iframe
          title="Egypt"
          src={egyptMapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a className="contact-map-link" href={egyptMapLink} target="_blank" rel="noopener noreferrer">
          View larger map
        </a>
      </section>

      <SiteFooter />
    </main>
  )
}
