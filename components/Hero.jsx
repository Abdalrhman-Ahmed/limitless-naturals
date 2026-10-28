import Photo from "./Photo";
import Hero3D from "./Hero3D";
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
        <div className="ph-label">Add /public/images/hero-woman.jpg</div>
        <Photo src="/images/hero-woman.jpg" alt="Smiling woman among plants" />
      </div>

      <Hero3D />

      <div className="hero-card">
        <h1>Daily Wellness<br />One Simple Habit</h1>
        <p>Science-backed nutrition designed to support energy, immunity and everyday performance with just two capsules a day.</p>
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
