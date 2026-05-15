import { useState } from 'react'

const faqs = [
  { q: 'Is Neighbourhood Guard free?', a: 'Yes! Neighbourhood Guard is free to download and use. We offer a premium subscription for advanced features like extended alert history and priority security team connection.' },
  { q: 'How does the Safe Route feature work?', a: 'The Safe Route feature analyses real-time crime reports, historical incident data, and community alerts to recommend the safest path to your destination. Routes are updated continuously as new data comes in.' },
  { q: 'Who receives my SOS alert?', a: 'Your SOS alert is sent to your connected local security team, your pre-set emergency contacts, and nearby community members who have opted in to receive emergency notifications.' },
  { q: 'Can I report anonymously?', a: 'Absolutely. You can toggle anonymous reporting when submitting any incident report. Your identity will be hidden from other community members while still allowing security teams to verify the report.' },
  { q: 'Does it work in all neighbourhoods?', a: 'Neighbourhood Guard is expanding rapidly. If your neighbourhood is not yet covered, you can request coverage and we will prioritize onboarding your area. The app works best with an active community.' },
  { q: 'How does it connect to security teams?', a: 'Security companies and patrol teams can register on our platform and link to specific neighbourhoods. Once connected, they receive alerts, can post verified updates, and respond to SOS emergencies directly through the app.' },
]

export default function FAQ() {
  const [active, setActive] = useState(null)
  const toggle = (i) => setActive(active === i ? null : i)

  return (
    <section className="faq" id="faq">
      <div className="container text-center">
        <span className="section-label">FAQ</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Got questions? We have answers.</p>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className={`faq-item ${active === i ? 'active' : ''}`} key={i}>
              <button className="faq-question" onClick={() => toggle(i)} id={`faq-${i}`}>
                {f.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
