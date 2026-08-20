'use client'

import { useState } from 'react'
import { images, socialLinks, egyptMapEmbed, egyptMapLink } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
          <p className="eyebrow">GET IN TOUCH</p>
          <h1 className="page-title">Contact</h1>
          <p className="page-lead">
            Have a question or a retreat idea taking shape? We&apos;d love to hear from you.
          </p>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={images.hammam} alt="A quiet moment of care" />
        </div>
      </section>

      {/* Contact block */}
      <section className="contact-block">
        <div className="contact-left reveal is-in">
          <h2 className="contact-block-title">Get In Touch With Us</h2>
          <p className="contact-block-lead">
            If you have any questions, feel free to reach out to our team.
          </p>

          <div className="contact-detail-image">
            <img src={images.boat} alt="Golden light on the water" />
          </div>

          <div className="contact-social">
            <p className="contact-social-title">Social Media</p>
            {socialLinks.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
            ))}
          </div>
        </div>

        <div className="contact-right reveal is-in">
          {sent ? (
            <div className="form-success">
              <h3>Message sent.</h3>
              <p>Thank you for reaching out — we&apos;ll get back to you shortly.</p>
            </div>
          ) : (
            <div className="contact-simple-form">
              <div className="form-field full">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your Name" />
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="Phone Number" />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address" />
                </div>
              </div>

              <div className="form-field full">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handle} placeholder="Example Text" rows={5} />
              </div>

              <button className="form-submit filled" onClick={submit}>Send Message</button>
            </div>
          )}
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
