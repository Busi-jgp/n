const steps = [
  { num: 1, icon: '📝', title: 'Sign Up', desc: 'Create your account and select your neighbourhood' },
  { num: 2, icon: '🔔', title: 'Get Alerts', desc: 'Receive real-time alerts about crime and suspicious activity' },
  { num: 3, icon: '🗺️', title: 'Safe Routes', desc: 'Use the Safe Route feature to avoid danger zones' },
  { num: 4, icon: '🆘', title: 'SOS Button', desc: 'Press the SOS button in emergencies for instant help' },
  { num: 5, icon: '👥', title: 'Stay Connected', desc: 'Connect instantly to your security team and community' },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container text-center">
        <span className="section-label">Process</span>
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Getting started with Neighbourhood Guard takes less than a minute. 
          Here's how you can protect yourself and your community.
        </p>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card fade-up" key={s.num} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="step-number">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
