"use client";
import { useState } from "react";

/* Image that silently disappears when the file is missing,
   so the gradient / placeholder underneath shows instead. */
export default function Photo({ src, alt = "", className = "" }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setOk(false)} />;
}
