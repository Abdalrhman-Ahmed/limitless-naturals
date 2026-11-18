import type { CSSProperties, ReactNode } from "react";
import { Arrow } from "../../ui/ShopBadge";

type BenefitKey = "energy" | "immunity" | "focus" | "recovery";

const icons: Record<BenefitKey, ReactNode> = {
  energy: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  immunity: <><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" /><circle cx="12" cy="11" r="2.5" /></>,
  focus: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  recovery: <><path d="M12 21v-9" /><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" /><path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z" /></>,
};

const items: { key: BenefitKey; title: string; description: string; rotation: string }[] = [
  { key: "energy", title: "Energy", description: "Supports natural daily energy production.", rotation: "-10deg" },
  { key: "immunity", title: "Immunity", description: "Helps maintain a healthy immune system.", rotation: "0deg" },
  { key: "focus", title: "Focus", description: "Supports mental clarity throughout the day.", rotation: "-5deg" },
  { key: "recovery", title: "Recovery", description: "Promotes overall wellness and balance.", rotation: "10deg" },
];

export function Benefits() {
  return (
    <section className="pad" id="why">
      <div className="benefits-wrap">
        <div className="benefits-left" data-reveal>
          <h2 className="title">Why Your Body<br />Will Love It</h2>
          <p data-reveal>Carefully formulated with high-quality vitamins, minerals and botanical extracts to help support your daily wellness routine.</p>
          <a href="#products" className="btn-outline">Discover the Formula <Arrow /></a>
        </div>
        <div className="benefits-right">
          <div className="benefits">
            {items.map((item) => (
              <div className="benefit" key={item.key} style={{ "--r": item.rotation } as CSSProperties}>
                <div className="top">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">{icons[item.key]}</svg>
                  <h3>{item.title}</h3>
                </div>
                <div className="bot">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
