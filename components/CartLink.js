"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink({ className = "" }) {
  const { count } = useCart();
  return <Link href="/cart" className={className}>Bag{count > 0 ? ` (${count})` : ""}</Link>;
}
