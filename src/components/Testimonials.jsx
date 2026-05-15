const testimonials = [
  {
    text: "The safe route feature is a lifesaver at night. I feel so much more confident walking home now.",
    name: "Sarah M.", role: "Resident, Greenfield Estate", initials: "SM", stars: 5
  },
  {
    text: "We get crime alerts instantly now. Our whole neighbourhood is more aware and prepared.",
    name: "James K.", role: "Community Leader", initials: "JK", stars: 5
  },
  {
    text: "The SOS button gives me peace of mind. Knowing help is one tap away makes all the difference.",
    name: "Priya D.", role: "Working Professional", initials: "PD", stars: 5
  },
  {
    text: "Since our security company connected with the app, response times have improved dramatically.",
    name: "Michael T.", role: "Security Manager", initials: "MT", stars: 5
  },
  {
    text: "I love the anonymous reporting feature. It makes it easy to report without fear.",
    name: "Linda N.", role: "Neighbourhood Resident", initials: "LN", stars: 5
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container text-center">
        <span className="section-label">Reviews</span>
        <h2 className="section-title">Trusted by Communities</h2>
        <p className="section-subtitle">
          Hear from real people who use Neighbourhood Guard every day to stay safe.
        </p>
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((t, i) => (
            <div className="testimonial-card fade-up" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div className="author-info">
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
