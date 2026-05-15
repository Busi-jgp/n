const screens = [
  { img: '/images/alerts-screen.png', label: 'Alerts Feed' },
  { img: '/images/saferoute-screen.png', label: 'Safe Route Map' },
  { img: '/images/sos-screen.png', label: 'SOS Emergency' },
]

export default function AppPreview() {
  return (
    <section className="app-preview" id="app-preview">
      <div className="container">
        <span className="section-label">Preview</span>
        <h2 className="section-title">App Preview</h2>
        <p className="section-subtitle">
          Take a look at the Neighbourhood Guard experience. Designed for simplicity, built for safety.
        </p>
        <div className="preview-grid">
          {screens.map((s, i) => (
            <div className="preview-item fade-up" key={i} style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="preview-phone">
                <img src={s.img} alt={s.label} />
              </div>
              <div className="preview-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
