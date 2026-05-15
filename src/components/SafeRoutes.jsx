export default function SafeRoutes() {
  return (
    <section className="safe-routes" id="safe-routes">
      <div className="container">
        <div className="safe-routes-content fade-left">
          <span className="section-label">Navigation</span>
          <h2 className="section-title">Find Safer Routes in Real Time</h2>
          <p>
            Neighbourhood Guard helps you choose safer walking or driving routes based on 
            nearby alerts and high-risk areas. This helps residents avoid crime hotspots and 
            travel more safely, especially at night.
          </p>
          <p>
            Our intelligent routing algorithm analyses live incident data and community reports 
            to recommend the safest path to your destination—giving you confidence every step of the way.
          </p>
          <div className="route-features">
            <div className="route-feature">
              <span className="rf-icon">🟢</span>
              <div>
                <strong>Safe Zones Highlighted</strong>
                <span>Well-lit, low-incident areas clearly marked</span>
              </div>
            </div>
            <div className="route-feature">
              <span className="rf-icon">🔴</span>
              <div>
                <strong>Danger Zones Avoided</strong>
                <span>High-risk areas automatically bypassed</span>
              </div>
            </div>
            <div className="route-feature">
              <span className="rf-icon">📊</span>
              <div>
                <strong>Live Data Updates</strong>
                <span>Routes adjust based on real-time incidents</span>
              </div>
            </div>
          </div>
        </div>
        <div className="safe-routes-visual fade-right">
          <div className="map-container">
            <img src="/images/saferoute-screen.png" alt="Safe Route Navigation Map" />
          </div>
        </div>
      </div>
    </section>
  )
}
