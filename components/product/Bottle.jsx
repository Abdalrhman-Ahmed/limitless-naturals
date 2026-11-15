export default function Bottle({
  color = "#3d5a45",
  cap = "#c4c8c4",
  name = "VIDA GLOW",
  labelBg = null,
  nameColor = "#e8d9b0",
  accent = "#d6b36a",
  className = "",
}) {
  const id = `g-${color.replace("#", "")}-${name.replace(/\W/g, "")}`;
  return (
    <svg className={className} viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg" aria-label={name}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".4" />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="28" y="4" width="64" height="36" rx="6" fill={cap} />
      <rect x="28" y="4" width="64" height="36" rx="6" fill={`url(#${id})`} />
      {/* body */}
      <path d="M22 44 h76 a14 14 0 0 1 14 14 v136 a14 14 0 0 1 -14 14 h-76 a14 14 0 0 1 -14 -14 v-136 a14 14 0 0 1 14 -14z" fill={color} />
      {labelBg && <rect x="8" y="78" width="104" height="92" fill={labelBg} />}
      <path d="M22 44 h76 a14 14 0 0 1 14 14 v136 a14 14 0 0 1 -14 14 h-76 a14 14 0 0 1 -14 -14 v-136 a14 14 0 0 1 14 -14z" fill={`url(#${id})`} />
      {/* label copy */}
      <g fill={nameColor} textAnchor="middle" fontFamily="Instrument Sans, sans-serif">
        <text x="60" y="70" fontSize="4.4" opacity=".7">LIMITLESS</text>
        <text x="60" y="76" fontSize="3" opacity=".5">ADVANCED REPAIR</text>
        <text x="60" y="134" fontSize={name.length > 10 ? 9 : 10.5} letterSpacing="1" fontWeight="500">{name}</text>
        <rect x="26" y="145" width="68" height="9" fill={accent} opacity=".85" />
        <text x="60" y="151.5" fontSize="3.4" fill="#2b2b22">Zinc and Superfood Blend</text>
        <text x="60" y="168" fontSize="3" opacity=".6">30 HARD CAPSULES</text>
      </g>
    </svg>
  );
}
