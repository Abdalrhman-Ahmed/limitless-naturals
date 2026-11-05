"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartLink({ className = "" }) {
  const { count } = useCart();
  return <Link href="/cart" className={className} aria-label={count ? `Shopping bag, ${count} items` : "Shopping bag"}><ShoppingBag size={18} strokeWidth={1.7} aria-hidden="true"/><span className="cart-link-count">{count > 0 ? count : ""}</span></Link>;
}
