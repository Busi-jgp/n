import { useState } from 'react'

export default function Download() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) { setSubmitted(true); setEmail('') }
  }

  return (
    <section className="download" id="download">
      <div className="container download-content">
        <span className="section-label">Get The App</span>
        <h2 className="section-title">Download Neighbourhood Guard Today</h2>
        <p>
          Join your community and take control of your safety. Get instant alerts, 
          find safer routes, and contact your security team in seconds.
        </p>
        <div className="download-buttons">
          <a href="#" className="store-btn" id="google-play-btn">
            <span className="store-icon">▶️</span>
            <div>
              <div className="store-sub">GET IT ON</div>
              <div className="store-name">Google Play</div>
            </div>
          </a>
          <a href="#" className="store-btn" id="app-store-btn">
            <span className="store-icon">🍎</span>
            <div>
              <div className="store-sub">DOWNLOAD ON THE</div>
              <div className="store-name">App Store</div>
            </div>
          </a>
        </div>
        <p style={{ color: 'var(--gray-300)', fontSize: '.9rem', marginBottom: '24px' }}>
          Coming Soon — Join the Waitlist for Early Access
        </p>
        <form className="waitlist-form" onSubmit={handleSubmit} id="waitlist-form">
          <input
            type="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            id="waitlist-email"
          />
          <button type="submit" className="btn btn-primary">
            {submitted ? '✓ Joined!' : 'Join Waitlist'}
          </button>
        </form>
        <div className="qr-section fade-up">
          <p style={{ color: 'var(--gray-300)', fontSize: '.85rem' }}>Scan to download</p>
          <div className="qr-placeholder">
            <QRPattern />
          </div>
        </div>
      </div>
    </section>
  )
}

function QRPattern() {
  const pattern = [
    [1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1],
  ]
  return (
    <div className="qr-grid">
      {pattern.flat().map((c, i) => (
        <div key={i} className={`qr-cell ${c ? 'dark' : 'light'}`} />
      ))}
    </div>
  )
}
