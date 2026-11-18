interface Testimonial {
  name: string;
  detail: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  { name: "Sarah M.", detail: "Verified customer", quote: "I've tried dozens of supplements, and this is the first one that feels thoughtfully made.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80" },
  { name: "Emily R.", detail: "Verified customer", quote: "I love knowing exactly what's in every serving. The quality really stands out.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80" },
  { name: "Olivia K.", detail: "Verified customer", quote: "A simple addition to my routine that makes me feel good about my wellness.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
  { name: "Jessica L.", detail: "Verified customer", quote: "The ingredients and attention to detail are what keep me coming back.", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=160&q=80" },
];

export function Reviews() {
  return (
    <section className="pad reviews-section" id="reviews">
      <div className="reviews">
        <div className="reviews-intro">
          <h2 className="title" data-reveal>Trusted by<br />Thousands</h2>
          <div className="score" data-reveal>4.9/5 <span>★★★★★</span></div>
          <p className="small" data-reveal>Trusted by thousands of health enthusiasts for its purity and effectiveness.</p>
          <div className="avatars" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="review-cards">
          {testimonials.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-card-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="review-quote">“{review.quote}”</p>
              <div className="review-person">
                <img src={review.image} alt={review.name} loading="lazy" />
                <div><strong>{review.name}</strong><span>{review.detail}</span></div>
                <span className="review-verified" aria-label="Verified">✓</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
