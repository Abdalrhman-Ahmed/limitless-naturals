import Hero3D from "./Hero3D";
import Photo from "./Photo";
import { ShopBadge } from "./ShopBadge";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <nav className="nav">
        <span className="logo">Limitless</span>
        <ul className="desktop-nav">
          <li><a href="#why">Why It Works</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#compare">Compare</a></li>
          <li><a href="#reviews">Reviews</a></li>
        </ul>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu"><span /></summary>
          <ul>
            <li><a href="#why">Why It Works</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#compare">Compare</a></li>
            <li><a href="#reviews">Reviews</a></li>
          </ul>
        </details>
      </nav>

      <div className="hero-photo">
        <div className="ph-label">A daily ritual for your wellbeing</div>
        <Photo src="/images/hero-woman.jpg" alt="Smiling woman among plants" />
      </div>

      <Hero3D />

      <div className="hero-card">
        <svg className="hero-card-shape" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true">
          <path d="M18 112 C22 70 56 48 112 42 C205 34 292 30 372 18 C451 6 520 24 558 66 C587 98 590 157 579 216 C569 274 526 319 463 333 C384 351 282 346 190 341 C103 337 43 314 23 270 C7 236 7 159 18 112 Z" />
        </svg>
        <div className="hero-card-content">
          <h1>Daily Wellness<br />One Simple Habit</h1>
          <p>Science-backed nutrition designed to support energy, immunity and everyday performance with just two capsules a day.</p>
        </div>
      </div>
      <ShopBadge />

      <div className="hero-rating">
        <div className="row">
          <span className="avatars"><i /><i /><i /></span>
          8k+
        </div>
        <div className="stars">★★★★★ <b>4.9</b></div>
      </div>

      <div className="hero-checks">
        <span>Clinically Inspired</span>
        <span>Premium Ingredients</span>
        <span>Third-Party Tested</span>
      </div>
    </header>
  );
}
