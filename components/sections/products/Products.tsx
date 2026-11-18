import Bottle from "../../product/Bottle";
import Photo from "../../media/Photo";
import { ShopBadge } from "../../ui/ShopBadge";

interface ProductRow {
  id: string;
  side: "l" | "r";
  rowClass: string;
  name: string;
  sub: string;
  price: string;
  color: string;
  nameColor: string;
  hand: string;
  handEmpty?: string;
  transitionTarget?: boolean;
  manProduct?: boolean;
  womenProduct?: boolean;
  badge?: boolean;
}

const rows: ProductRow[] = [
  {
    id: "ashwa",
    side: "l",
    rowClass: "prow-ashwa",
    name: "Luna Balance",
    sub: "Complete daily nutrition",
    price: "$39",
    color: "#22406b",
    nameColor: "#e8d9b0",
    hand: "/images/handashwa.png",
    handEmpty: "/images/hand.png",
    transitionTarget: true,
  },
  {
    id: "man",
    side: "r",
    rowClass: "prow-man",
    name: "Limitless Man Max",
    sub: "Multivitamin & Minerals",
    price: "$29",
    color: "#123b91",
    nameColor: "#ffffff",
    hand: "/images/hand-limitless-man.png",
    manProduct: true,
  },
  {
    id: "woman",
    side: "l",
    rowClass: "prow-woman",
    name: "Solara Vital",
    sub: "Energy & recovery",
    price: "$49",
    color: "#6d2b2b",
    nameColor: "#e8d9b0",
    hand: "/images/hand-woman.png",
    handEmpty: "/images/hand-woman-empty.png",
    womenProduct: true,
  },
];

export function Products() {
  return (
    <section className="pad products" id="products">
      <h2 className="title" data-reveal>Find Your Daily<br />Formula</h2>
      {rows.map((row) => (
        <div className={`prow ${row.side} ${row.rowClass}`} key={row.id}>
          {row.transitionTarget ? (
            <div className="hand">
              <div className="hand-layer" data-hand-empty><Photo src={row.handEmpty ?? "/images/hand.png"} alt="" /></div>
              <div className="hand-layer" data-hand-full style={{ opacity: 0 }}><Photo src={row.hand} alt="" /></div>
            </div>
          ) : row.manProduct ? (
            <div className="hand man-hand"><Photo src={row.hand} alt="Limitless Man Max" /></div>
          ) : row.womenProduct ? (
            <div className="hand women-hand">
              <div className="hand-inner-frame">
                <div className="hand-layer women-hand-full" data-women-hand-full><img src={row.hand} alt="" /></div>
                <div className="hand-layer women-hand-empty" data-women-hand-empty>
                  <img src={row.handEmpty ?? "/images/hand-woman-empty.png"} alt="" />
                </div>
                <img className="women-floating-bottle" data-women-bottle src="/images/bottle-woman.png" alt="" />
              </div>
            </div>
          ) : (
            <div className="hand"><Photo src={row.hand} alt="" /></div>
          )}

          {row.transitionTarget ? (
            <div className="pbottle slot" data-bottle-slot aria-hidden="true" />
          ) : row.manProduct || row.womenProduct ? null : (
            <div className="pbottle" data-float>
              <Bottle color={row.color} name={row.name.toUpperCase()} nameColor={row.nameColor} />
            </div>
          )}

          {row.badge && <ShopBadge />}
          <div
            className={`info ${row.transitionTarget ? "ashwa-copy" : row.manProduct ? "man-copy" : row.womenProduct ? "women-copy" : ""}`}
            {...(row.transitionTarget || row.manProduct || row.womenProduct ? {} : { "data-reveal": true })}
          >
            {row.transitionTarget ? (
              <>
                <h4 data-ashwa-step>ASHWAGANDHA</h4>
                <div className="ashwa-dose" data-ashwa-step>600 mg</div>
                <p className="ashwa-description" data-ashwa-step>Supports stress relief, mood balance, and restful sleep.</p>
                <div className="ashwa-benefits" data-ashwa-step><span>Stress Support</span><span>Mood Balance</span><span>Better Sleep</span></div>
              </>
            ) : row.manProduct ? (
              <>
                <h4 className="man-eyebrow" data-man-step>LIMITLESS MAN</h4>
                <div className="man-dose" data-man-step>MAX</div>
                <p className="man-description" data-man-step>Daily multivitamin support with 27 key vitamins and minerals to help maintain health and energy.</p>
                <div className="man-benefits" data-man-step><span>Daily Energy</span><span>27 Key Elements</span><span>Men's Wellness</span></div>
              </>
            ) : row.womenProduct ? (
              <>
                <h4 data-women-step>LIMITLESS WOMAN</h4>
                <div className="women-dose" data-women-step>50+</div>
                <p className="women-description" data-women-step>Daily multivitamin support designed for women 50+ to help support energy, immunity, and overall wellness.</p>
                <div className="women-benefits" data-women-step><span>Energy Support</span><span>Immune Health</span><span>Women's Wellness</span></div>
              </>
            ) : (
              <>
                <h4>{row.name}</h4>
                <div className="sub">{row.sub}</div>
                <div className="price">Starting at <b>{row.price}</b></div>
              </>
            )}
          </div>
        </div>
      ))}
      <img className="travel-woman-bottle" data-travel-woman-bottle src="/images/bottle-woman.png" alt="" aria-hidden="true" />
    </section>
  );
}
