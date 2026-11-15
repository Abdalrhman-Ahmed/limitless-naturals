"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToBagButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  return <button className="detail-add" type="button" onClick={() => { addToCart(product); setAdded(true); }}>
    <span>{added ? "Added to bag ✓" : "Add to bag"}</span><span>EGP {product.price}</span>
  </button>;
}
