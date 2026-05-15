export default function Features() {
  const features = [
    {
      icon: '🔔',
      title: 'Instant Alerts',
      desc: 'Get real-time notifications about security incidents in your direct vicinity.'
    },
    {
      icon: '🗺️',
      title: 'Safe Navigation',
      desc: 'Our AI-powered engine calculates the safest walking and driving routes based on real-time data.'
    },
    {
      icon: '🆘',
      title: 'SOS Emergency',
      desc: 'One tap to notify your family, neighbors, and local security team of your exact location.'
    },
    {
      icon: '🛡️',
      title: 'Patrol Tracking',
      desc: 'See real-time locations of local security patrols and their current status.'
    },
    {
      icon: '🤝',
      title: 'Community Chat',
      desc: 'Secure, verified neighborhood groups for rapid communication and coordination.'
    },
    {
      icon: '📊',
      title: 'Safety Insights',
      desc: 'Detailed monthly reports and heatmaps of activity in your neighborhood.'
    }
  ]

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="text-center mb-60">
          <span className="section-label">Powerful Features</span>
          <h2 className="section-title">Built for Your Protection</h2>
          <p className="section-subtitle">
            Every tool you need to stay safe and connected in your community.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass fade-up visible">
              <div className="feature-icon-box">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
