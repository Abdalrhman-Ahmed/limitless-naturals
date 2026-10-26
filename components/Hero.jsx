import Hero3D from "./Hero3D";
import Photo from "./Photo";
import { ShopBadge } from "./ShopBadge";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <nav className="nav">
        <span className="logo">Radiance+</span>
        <ul>
          <li><a href="#why">Why It Works</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#compare">Compare</a></li>
          <li><a href="#reviews">Reviews</a></li>
        </ul>
      </nav>

      <div className="hero-photo">
        <div className="ph-label">A daily ritual for your wellbeing</div>
        <Photo src="/images/hero-woman.jpg" alt="Smiling woman among plants" />
      </div>

      <Hero3D />

      <div className="hero-card">
        <svg className="hero-card-shape" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true">
          <path d="M16 122 C20 72 64 48 128 42 C226 32 321 18 394 8 C474 -3 536 22 565 72 C590 114 590 190 575 245 C559 303 506 339 432 346 C335 354 237 350 151 344 C79 339 29 315 16 269 C4 231 4 165 16 122 Z" />
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
