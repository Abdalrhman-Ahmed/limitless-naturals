import { Arrow } from "../../ui/ShopBadge";

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
      <div className="benefits-wrap">
        <div className="benefits-left" data-reveal>
          <h2 className="title">Why Your Body<br />Will Love It</h2>
                    <p data-reveal>Carefully formulated with high-quality vitamins, minerals and botanical extracts to help support your daily wellness routine.</p>

          <a href="#products" className="btn-outline">Discover the Formula <Arrow /></a>
        </div>
        <div className="benefits-right">
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
        </div>
      </div>
    </section>
  );
}
