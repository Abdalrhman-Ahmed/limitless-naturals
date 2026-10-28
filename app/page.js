import Hero from "../components/Hero";
import Hero3D from "../components/Hero3D";
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
      <Hero3D />
      <Motion />
    </main>
  );
}
