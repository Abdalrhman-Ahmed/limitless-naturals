import Link from "next/link";
import { notFound } from "next/navigation";
import CartLink from "../../../components/cart/CartLink";
import AddToBagButton from "../../../components/cart/AddToBagButton";
import { products } from "../../../lib/products";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <main className="detail-page">
      <header className="shop-header">
        <Link href="/shop" className="shop-back">← All formulas</Link>
        <Link href="/" className="detail-logo">LIMITLESS<span>+</span></Link>
        <CartLink className="shop-bag" />
      </header>
      <div className="detail-breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
      </div>
      <section className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-image" style={{ "--product-color": product.color } as React.CSSProperties}>
            <img src={product.image} alt={product.name} />
            <span className="detail-image-caption">LIMITLESS NATURALS</span>
          </div>
          <div className="detail-thumbs">
            <div className="selected"><img src={product.image} alt="Product view" /></div>
            <div className="detail-thumb-copy">Thoughtfully formulated<br />for everyday wellness</div>
          </div>
        </div>
        <div className="detail-info">
          <p className="shop-eyebrow">{product.category} · {product.type}</p>
          <h1>{product.name}</h1>
          <div className="detail-rating"><span>★★★★★</span> {product.rating} ({product.reviews} reviews)</div>
          <div className="detail-price">EGP {product.price}<small> / {product.count}</small></div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-benefits">{product.benefits.map((benefit) => <span key={benefit}>✓ {benefit}</span>)}</div>
          <AddToBagButton product={product} />
          <p className="detail-note">Secure checkout · Quality ingredients · Daily routine friendly</p>
          <div className="detail-accordion">
            <details open><summary>What's inside</summary><ul>{product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul></details>
            <details><summary>How to use</summary><p>Follow the directions on the product label or consult your healthcare professional.</p></details>
            <details><summary>Shipping & returns</summary><p>Shipping and return details will be shown at checkout.</p></details>
          </div>
        </div>
      </section>
      <section className="detail-bottom"><h2>Make wellness a simple habit.</h2><Link href="/shop">Explore all formulas ↗</Link></section>
    </main>
  );
}
