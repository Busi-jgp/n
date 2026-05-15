export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="nav-logo">
              <span className="logo-icon">🛡️</span>
              Neighbourhood Guard
            </a>
            <p>Empowering communities with real-time safety alerts, safe route navigation, and instant emergency response.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#safe-routes">Safe Routes</a>
            <a href="#sos">SOS Emergency</a>
            <a href="#download">Download</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#testimonials">Reviews</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Download</h4>
            <a href="#">Google Play</a>
            <a href="#">App Store</a>
            <a href="#download">Join Waitlist</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Neighbourhood Guard. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
