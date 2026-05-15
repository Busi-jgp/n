export default function SOSEmergency() {
  return (
    <section className="sos" id="sos">
      <div className="container">
        <span className="section-label">Emergency</span>
        <h2 className="section-title">One Tap SOS Emergency Help</h2>
        <div className="sos-button-container fade-up">
          <div className="sos-ring" />
          <div className="sos-ring" />
          <div className="sos-ring" />
          <button className="sos-btn" aria-label="SOS Emergency Button">SOS</button>
        </div>
        <p>
          The SOS button is designed for emergencies. With one tap, users can send an emergency 
          alert with their live location, instantly notifying the local security team and trusted 
          community members for quick response.
        </p>
        <div className="sos-features">
          <div className="sos-feature"><span className="check">✓</span> Instant Location Sharing</div>
          <div className="sos-feature"><span className="check">✓</span> Security Team Notified</div>
          <div className="sos-feature"><span className="check">✓</span> Emergency Contacts Alerted</div>
          <div className="sos-feature"><span className="check">✓</span> Audio Recording</div>
        </div>
      </div>
    </section>
  )
}
