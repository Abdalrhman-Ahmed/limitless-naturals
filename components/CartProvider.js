"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "limitless-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addToCart = (product, quantity = 1) => {
    setItems(current => {
      const existing = current.find(item => item.slug === product.slug);
      if (existing) return current.map(item => item.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { slug: product.slug, name: product.name, image: product.image, price: product.price, quantity }];
    });
  };
  const updateQuantity = (slug, quantity) => {
    if (quantity < 1) return;
    setItems(current => current.map(item => item.slug === slug ? { ...item, quantity } : item));
  };
  const removeItem = slug => setItems(current => current.filter(item => item.slug !== slug));
  const clearCart = () => setItems([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(() => ({ items, ready, count, subtotal, addToCart, updateQuantity, removeItem, clearCart }), [items, ready, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
