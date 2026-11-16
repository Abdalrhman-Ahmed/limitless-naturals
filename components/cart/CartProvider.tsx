"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../../lib/products";

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

type CartProduct = Pick<Product, "slug" | "name" | "image" | "price">;

interface CartContextValue {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  addToCart: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "limitless-cart";

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addToCart = (product: CartProduct, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug);
      if (existing) {
        return current.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { ...product, quantity }];
    });
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );
  };

  const removeItem = (slug: string) =>
    setItems((current) => current.filter((item) => item.slug !== slug));
  const clearCart = () => setItems([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, ready, count, subtotal, addToCart, updateQuantity, removeItem, clearCart }),
    [items, ready, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
