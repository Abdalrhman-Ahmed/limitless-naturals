"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink({ className = "" }) {
  const { count } = useCart();
  return <Link href="/cart" className={className} aria-label={count ? `Shopping bag, ${count} items` : "Shopping bag"}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span className="cart-link-count">{count > 0 ? count : ""}</span></Link>;
}
