export default function SecurityTeam() {
  return (
    <section className="security" id="security-team">
      <div className="container">
        <div className="security-content fade-left">
          <span className="section-label">Security</span>
          <h2 className="section-title">Connected to Your Security Team</h2>
          <p>
            Neighbourhood Guard is linked to your neighbourhood security team or patrol company, 
            making it easier to request help, report incidents, and receive verified updates. 
            Your security is just a tap away.
          </p>
          <div className="security-badges">
            <div className="security-badge">
              <span className="badge-icon">🕐</span> 24/7 Response Support
            </div>
            <div className="security-badge">
              <span className="badge-icon">⚡</span> Faster Emergency Reaction
            </div>
            <div className="security-badge">
              <span className="badge-icon">✅</span> Verified Alerts
            </div>
          </div>
        </div>
        <div className="security-visual fade-right">
          <div className="security-card">
            <div className="shield-icon">🛡️</div>
            <h3>Your Local Security Team</h3>
            <p>Connected and ready to respond to your neighbourhood 24 hours a day, 7 days a week.</p>
            <div className="status-badge">
              <span className="status-dot" /> Online — Active Patrol
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
