import { useState } from 'react'
import PhoneMockup from './PhoneMockup'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-background-glow"></div>
      <div className="container">
        <div className="contact-grid">
          <div className="fade-left visible">
            <span className="section-label">Connect With Us</span>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 40px' }}>
              Have questions or need support? Our team is available 24/7 to help you stay safe.
            </p>
            
            <form className="contact-form glass" onSubmit={handleSubmit} id="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input id="contact-name" type="text" placeholder="Your name" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input id="contact-email" type="email" placeholder="email@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows="4" placeholder="How can we help?" value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" id="contact-submit" style={{ width: '100%' }}>
                {sent ? '✓ Message Sent' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="contact-visual fade-right visible">
            <div className="phone-map-wrapper">
              <PhoneMockup>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzAwLjAiTiAwwrAwMCcwMC4wIkU!5e0!3m2!1sen!2s!4v1234567890" 
                  title="Neighborhood Map"
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </PhoneMockup>
              <div className="map-overlay-badge glass">
                <span className="status-dot"></span>
                LIVE RADAR ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

