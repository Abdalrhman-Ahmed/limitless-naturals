"use client";
import { useState } from "react";
import Link from "next/link";
import CartLink from "../../components/CartLink";
import { useCart } from "../../components/CartProvider";

export default function CheckoutPage() {
  const { items, ready, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  if (submitted) return <main className="checkout-page"><header className="shop-header"><Link href="/" className="detail-logo">LIMITLESS<span>+</span></Link></header><section className="checkout-shell checkout-success"><div className="success-mark">✓</div><p className="shop-eyebrow">ORDER CONFIRMED</p><h1 className="checkout-title">Thank you.</h1><p>Your details have been received. Payment processing will be available soon.</p><Link href="/shop" className="checkout-primary">Back to shop</Link></section></main>;
  return <main className="checkout-page">
    <header className="shop-header"><Link href="/cart" className="shop-back">← Back to bag</Link><Link href="/" className="detail-logo">LIMITLESS<span>+</span></Link><CartLink className="shop-bag"/></header>
    <section className="checkout-shell"><p className="shop-eyebrow">SECURE CHECKOUT</p><h1 className="checkout-title">Your details,<br/><em>please.</em></h1>
      {!ready ? <p>Loading checkout…</p> : items.length === 0 ? <div className="cart-empty"><p>Your bag is empty.</p><Link href="/shop" className="checkout-primary">Explore formulas</Link></div> :
      <div className="checkout-layout"><form className="checkout-form" onSubmit={e=>{e.preventDefault();setError("");clearCart();setSubmitted(true);}}>
        <h2>Contact</h2><label>Email<input type="email" name="email" autoComplete="email" required/></label>
        <h2>Delivery</h2><div className="checkout-fields"><label>First name<input name="firstName" autoComplete="given-name" required/></label><label>Last name<input name="lastName" autoComplete="family-name" required/></label></div>
        <label>Address<input name="address" autoComplete="street-address" required/></label><div className="checkout-fields"><label>City<input name="city" autoComplete="address-level2" required/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required/></label></div>
        <h2>Payment</h2><div className="checkout-payment-note">Payment options will be confirmed with your order.</div>
        {error && <p role="alert" className="checkout-error">{error}</p>}<button className="checkout-primary" type="submit">Place order · EGP {subtotal.toFixed(2)}</button>
      </form><aside className="cart-summary"><h2>Your order</h2>{items.map(item=><div className="checkout-summary-item" key={item.slug}><span>{item.name} × {item.quantity}</span><strong>EGP {(item.price*item.quantity).toFixed(2)}</strong></div>)}<div><span>Subtotal</span><strong>EGP {subtotal.toFixed(2)}</strong></div><p>Shipping calculated separately.</p></aside></div>}
    </section>
  </main>;
}
