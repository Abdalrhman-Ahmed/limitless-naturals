import Hero from "../components/Hero";
import Motion from "../components/Motion";
import { Benefits, Products, Compare, Reviews, Newsletter, Footer } from "../components/Sections";

export default function Page() {
  return (
    <main className="frame">
      <div className="shell">
        <Hero />
        <Benefits />
        <Products />
        <Compare />
        <Reviews />
        <Newsletter />
        <Footer />
      </div>
      <Motion />
    </main>
  );
}
