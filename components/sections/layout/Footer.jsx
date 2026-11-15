

export function Footer() {
  const cols = [
    { title: "Shop", links: ["All Products", "Bundles", "Subscriptions", "Gift Cards"] },
    { title: "Discover", links: ["Ingredients", "Science", "FAQs", "Blog"] },
    { title: "Company", links: ["About", "Contact", "Careers", "Wholesale"] },
  ];
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="footer-logo" href="#top">Limitless<span>+</span></a>
          <p>Wellness, made thoughtfully.<br />Feel good about what goes in.</p>
          <div className="socials" aria-label="Social links"><a href="#instagram" aria-label="Instagram">◎</a><a href="#facebook" aria-label="Facebook">f</a><a href="#x" aria-label="X">𝕏</a></div>
        </div>
        {cols.map((c) => (
          <div className="footer-links" key={c.title}>
            <h3>{c.title}</h3>
            <ul>{c.links.map((l) => <li key={l}><a href="#top">{l}</a></li>)}</ul>
          </div>
        ))}
        <div className="footer-signoff">
          <span className="footer-note">Made for your everyday wellness</span>
          <p>Clean formulas. Clear standards. A little more care in every detail.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Limitless Naturals. All rights reserved.</span>
        <div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">Limitless</div>
    </footer>
  );
}
