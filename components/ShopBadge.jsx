const Arrow = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M3 9 9 3M4 3h5v5" />
  </svg>
);

export function ShopBadge({ className = "" }) {
  return (
    <a href="#products" className={`badge ${className}`} aria-label="Shop now">
      <svg className="spin" viewBox="0 0 100 100">
        <defs>
          <path id="circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text className="badge-shop-text" fontSize="11.5" fontWeight="600" letterSpacing="2.2" fill="#213629">
          <textPath href="#circ">SHOP NOW • SHOP NOW • SHOP NOW •</textPath>
        </text>
        <text className="badge-science-text" fontSize="8.5" fontWeight="700" letterSpacing="1.4" fill="#213629">
          <textPath href="#circ">POWERED BY SCIENCE • POWERED BY SCIENCE •</textPath>
        </text>
      </svg>
      <span className="arrow"><Arrow /></span>
    </a>
  );
}

export { Arrow };
