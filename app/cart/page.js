"use client";
import Link from "next/link";
import CartLink from "../../components/CartLink";
import { useCart } from "../../components/CartProvider";

export default function CartPage() {
  const { items, ready, subtotal, updateQuantity, removeItem } = useCart();
  return <main className="checkout-page">
    <header className="shop-header"><Link href="/shop" className="shop-back">← Continue shopping</Link><Link href="/" className="detail-logo">LIMITLESS<span>+</span></Link><CartLink className="shop-bag"/></header>
    <section className="checkout-shell">
      <p className="shop-eyebrow">YOUR BAG</p><h1 className="checkout-title">A little care,<br/><em>on its way.</em></h1>
      {!ready ? <p>Loading your bag…</p> : items.length === 0 ? <div className="cart-empty"><p>Your bag is currently empty.</p><Link href="/shop" className="checkout-primary">Explore formulas</Link></div> :
      <div className="cart-layout"><div className="cart-items">{items.map(item=><article className="cart-item" key={item.slug}>
        <div className="cart-item-image"><img src={item.image} alt={item.name}/></div><div className="cart-item-main"><h2>{item.name}</h2><p>EGP {item.price}</p><div className="cart-item-actions"><label>Qty <select aria-label={`Quantity for ${item.name}`} value={item.quantity} onChange={e=>updateQuantity(item.slug, Number(e.target.value))}>{Array.from({length:10},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label><button type="button" onClick={()=>removeItem(item.slug)}>Remove</button></div></div><strong>EGP {(item.price*item.quantity).toFixed(2)}</strong>
      </article>)}</div><aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>EGP {subtotal.toFixed(2)}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><p>Taxes and delivery details are confirmed during checkout.</p><Link href="/checkout" className="checkout-primary">Proceed to checkout</Link></aside></div>}
    </section>
  </main>;
}
