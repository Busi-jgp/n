export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content fade-left">
            <span className="section-label">About</span>
            <h2 className="section-title">What is Neighbourhood Guard?</h2>
            <p>
              Neighbourhood Guard is a neighbourhood safety and alert app designed to help residents 
              stay informed, stay connected, and stay safe. It provides real-time crime alerts, 
              suspicious activity reports, and emergency notifications so that communities can react 
              faster and prevent danger.
            </p>
            <p>
              It also provides safe route recommendations to help residents avoid dangerous areas 
              when walking or driving—keeping you one step ahead at all times.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="icon">⚡</span> Real-Time Notifications
              </div>
              <div className="about-feature">
                <span className="icon">🗺️</span> Safe Route Planning
              </div>
              <div className="about-feature">
                <span className="icon">🤝</span> Community Driven
              </div>
              <div className="about-feature">
                <span className="icon">🔒</span> Privacy Focused
              </div>
            </div>
          </div>
          <div className="about-visual fade-right">
            <div className="about-card">
              <div className="big-icon">🛡️</div>
              <h3>Protecting Communities Together</h3>
              <p>
                Built for neighbourhoods that care about safety. Our platform connects 
                residents, security teams, and local authorities in one unified ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
