import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-background-glow"></div>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content fade-up visible">
            <span className="section-label">Next-Gen Community Safety</span>
            <h1 className="hero-title">
              Your Safety, <br />
              <span className="text-gradient">Intelligently Guarded</span>
            </h1>
            <p className="hero-subtitle">
              The world's most advanced neighborhood security network. 
              Real-time community alerts, AI-driven safe routes, and instantaneous emergency support.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" id="hero-cta-main">Get Started Free</button>
              <button className="btn btn-glass" id="hero-cta-secondary">Watch Demo</button>
            </div>
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <span className="trust-number">500k+</span>
                <span className="trust-label">Active Guards</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">2s</span>
                <span className="trust-label">Avg. Response</span>
              </div>
            </div>
          </div>
          <div className="hero-visual-container float-anim">
            <div className="hero-visual-glow"></div>
            <div className="hero-visual-content">
              {/* This could be a complex SVG or a placeholder for the app preview */}
              <div className="app-mockup-wrapper">
                <div className="mockup-screen">
                  <div className="mockup-interface">
                    <div className="pulse-circle"></div>
                    <div className="safety-badge">SECURE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

