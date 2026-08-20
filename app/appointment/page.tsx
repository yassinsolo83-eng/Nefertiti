'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { images, appointmentServices, clinicHours } from '@/lib/data'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'

export default function AppointmentPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', date: '', time: '',
  })
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
          <p className="eyebrow">BOOK WITH NEFERTITI</p>
          <h1 className="page-title">Appointment</h1>
          <p className="page-lead">
            Ready to start planning? Book a consultation and let&apos;s design a retreat
            your community will never forget.
          </p>
        </div>
        <div className="page-hero-image reveal is-in">
          <img src={images.hammam} alt="A calm treatment moment" />
        </div>
      </section>

      {/* Appointment form block */}
      <section className="appt-block">
        <div className="appt-image reveal is-in">
          <img src={images.resort} alt="A serene retreat space in Egypt" />
          <div className="appt-hours">
            <p className="appt-hours-title">Studio Hours</p>
            {clinicHours.map(([day, time]) => (
              <div className="appt-hours-row" key={day}>
                <span>{day}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="appt-form-wrap reveal is-in">
          <h2 className="appt-form-title">Make an Appointment</h2>

          {sent ? (
            <div className="form-success">
              <h3>Thank you.</h3>
              <p>We&apos;ve received your request and will confirm your appointment within 48 hours.</p>
            </div>
          ) : (
            <div className="appt-form">
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
                <label>Service</label>
                <select name="service" value={form.service} onChange={handle}>
                  <option value="">Select Service</option>
                  {appointmentServices.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-row two">
                <div className="form-field">
                  <label>Date</label>
                  <input name="date" type="date" value={form.date} onChange={handle} />
                </div>
                <div className="form-field">
                  <label>Preferred Time</label>
                  <input name="time" type="time" value={form.time} onChange={handle} />
                </div>
              </div>

              <button className="form-submit filled" onClick={submit}>Submit</button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
