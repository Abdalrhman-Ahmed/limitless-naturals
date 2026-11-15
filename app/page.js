import Hero from "../components/sections/hero/Hero";
import Motion from "../components/animations/Motion";

import { Benefits } from "../components/sections/benefits/Benefits";
import { Products } from "../components/sections/products/Products";
import { Compare } from "../components/sections/compare/Compare";
import { Reviews } from "../components/sections/reviews/Reviews";
import { Footer } from "../components/sections/layout/Footer";

export default function Page() {
  return (
    <main className="frame">
      <div className="shell">
        <Hero />
        <Benefits />
        <Products />
        <Compare />
        <Reviews />
        <Footer />
      </div>
      <Motion />
    </main>
  );
}