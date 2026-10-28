import Bottle from "./Bottle";
import Photo from "./Photo";
import VideoCard from "./VideoCard";
import { ShopBadge, Arrow } from "./ShopBadge";

const icons = {
  energy: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  immunity: <><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" /><circle cx="12" cy="11" r="2.5" /></>,
  focus: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  recovery: <><path d="M12 21v-9" /><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" /><path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z" /></>,
};

export function Benefits() {
  const items = [
    ["energy", "Energy", "Supports natural daily energy production.", "-10deg"],
    ["immunity", "Immunity", "Helps maintain a healthy immune system.", "0deg"],
    ["focus", "Focus", "Supports mental clarity throughout the day.", "-5deg"],
    ["recovery", "Recovery", "Promotes overall wellness and balance.", "10deg"],
  ];
  return (
    <section className="pad" id="why">
      <div className="benefits-head">
        <h2 className="title" data-reveal>Why Your Body<br />Will Love It</h2>
        <div className="right" data-reveal>
          <p>Carefully formulated with high-quality vitamins, minerals and botanical extracts to help support your daily wellness routine.</p>
          <a href="#products" className="btn-outline">Discover the Formula <Arrow /></a>
        </div>
      </div>
      <div className="benefits">
        {items.map(([k, t, d, r]) => (
          <div className="benefit" key={k} style={{ "--r": r }}>
            <div className="top">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">{icons[k]}</svg>
              <h3>{t}</h3>
            </div>
            <div className="bot">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Products() {
  const rows = [
    { side: "l", name: "Luna Balance", sub: "Complete daily nutrition", price: "$39", color: "#22406b", nameColor: "#e8d9b0", hand: "/images/handashwa.png", handEmpty: "/images/hand.png", transitionTarget: true },
    { side: "r", name: "Verde Renew", sub: "Energy & recovery", price: "$49", color: "#3d5a45", nameColor: "#e8d9b0", hand: "/images/hand-2.png", badge: true },
    { side: "l", name: "Solara Vital", sub: "Energy & recovery", price: "$49", color: "#6d2b2b", nameColor: "#e8d9b0", hand: "/images/hand-3.png" },
  ];
  return (
    <section className="pad products" id="products">
      <h2 className="title" data-reveal>Find Your Daily<br />Formula</h2>
      {rows.map((r) => (
        <div className={`prow ${r.side}`} key={r.name}>
          {r.transitionTarget ? (
            <div className="hand">
              <div className="hand-layer" data-hand-empty><Photo src={r.handEmpty} alt="" /></div>
              <div className="hand-layer" data-hand-full style={{ opacity: 0 }}><Photo src={r.hand} alt="" /></div>
            </div>
          ) : (
            <div className="hand" data-parallax={r.side === "l" ? "-12" : "12"}>
              <Photo src={r.hand} alt="" />
            </div>
          )}
          {r.transitionTarget ? (
            <div className="pbottle slot" data-bottle-slot aria-hidden="true" />
          ) : (
            <div className="pbottle" data-float>
              <Bottle color={r.color} name={r.name.toUpperCase()} nameColor={r.nameColor} />
            </div>
          )}
          {r.badge && <ShopBadge />}
          <div className="info" data-reveal>
            <h4>{r.name}</h4>
            <div className="sub">{r.sub}</div>
            <div className="price">Starting at <b>{r.price}</b></div>
          </div>
        </div>
      ))}
    </section>
  );
}

const rowsCompare = [
  "Every ingredient clearly disclosed",
  "Produced in GMP-certified facilities",
  "Every batch is third-party tested",
  "Formulated for optimal bioavailability",
  "Free from unnecessary fillers and colors",
];

export function Compare() {
  return (
    <section className="pad compare" id="compare">
      <h2 className="title" data-reveal>Compare the<br />Difference</h2>
      <div className="grid">
        <div className="col ours">
          <span className="tag">Our Formula</span>
          <span className="blob" />
          <div className="bottle-wrap" data-compare-bottle><Bottle color="#2f4a38" name="VIDA GLOW" /></div>
          <div className="pills">
            {rowsCompare.map((t) => (
              <div className="pill" data-pill="l" key={t}><i className="ok">✓</i>{t}</div>
            ))}
          </div>
        </div>
        <div className="col others">
          <span className="tag">Others Formula</span>
          <div className="pills">
            {rowsCompare.map((t) => (
              <div className="pill rev" data-pill="r" key={t}>{t}<i className="no">✕</i></div>
            ))}
          </div>
          <div className="bottle-wrap" data-compare-bottle>
            <Bottle color="#6b3a1d" cap="#f4f1ea" labelBg="#ffffff" name="Others Formula" nameColor="#3b7a4a" accent="#8bc27a" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="pad" id="reviews" style={{ paddingTop: 40 }}>
      <div className="reviews">
        <div>
          <h2 className="title" data-reveal>Trusted by<br />Thousands</h2>
          <div className="score" data-reveal>4.9/5</div>
          <p className="small" data-reveal>Trusted by thousands of health enthusiasts for its purity and effectiveness.</p>
          <div className="avatars"><i /><i /><i /></div>
        </div>
        <div className="cards">
          <VideoCard src="/images/review-1.jpg" caption="I've tried dozens of supplements." />
          <VideoCard src="/images/review-2.jpg" playing />
          <VideoCard src="/images/review-3.jpg" caption="The quality of the ingredients" />
          <VideoCard src="/images/review-4.jpg" caption="Feels great every morning." />
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="news">
      <div className="hand" data-parallax="-10">
        <Photo src="/images/hand-capsule.png" alt="" />
        <span className="caps" />
      </div>
      <div className="form" data-reveal>
        <h2>Stay in the Loop</h2>
        <p>Be the first to hear about new formulas, wellness tips and exclusive offers.</p>
        <form className="sub-row" action="#" onSubmit={undefined}>
          <input type="email" placeholder="Email Address" aria-label="Email address" />
          <button type="button">Subscribe ↗</button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    ["All Products", "Bundles", "Subscriptions", "Gift Cards"],
    ["Ingredients", "Science", "FAQs", "Blog"],
    ["About", "Contact", "Careers", "Wholesale"],
  ];
  return (
    <footer>
      <div className="f-top">
        {cols.map((c, i) => (
          <ul key={i}>{c.map((l) => <li key={l}><a href="#top">{l}</a></li>)}</ul>
        ))}
        <div>
          <p className="tagline">Get the scoop on new formulas, wellness tips, and sweet exclusive deals!</p>
          <div className="socials"><i>f</i><i>𝕏</i><i>◎</i></div>
        </div>
      </div>
      <div className="f-bottom">©Peno Lab. All rights reserved.</div>
      <div className="mega"><span data-mega>Limitless</span></div>
    </footer>
  );
}
