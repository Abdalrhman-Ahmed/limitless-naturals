"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "../../lib/products";

interface AddToBagButtonProps {
  product: Product;
}

export default function AddToBagButton({ product }: AddToBagButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      className="detail-add"
      type="button"
      onClick={() => {
        addToCart(product);
        setAdded(true);
      }}
    >
      <span>{added ? "Added to bag ✓" : "Add to bag"}</span>
      <span>EGP {product.price}</span>
    </button>
  );
}
