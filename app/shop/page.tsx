"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CartLink from "../../components/cart/CartLink";
import { products } from "../../lib/products";

type Category = "All" | "Women" | "Men";
type SortOption = "featured" | "price-low" | "price-high" | "rating";

export default function ShopPage() {
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const list = products.filter(
      (product) =>
        (category === "All" || product.category === category) &&
        (product.name + " " + product.type).toLowerCase().includes(query.toLowerCase())
    );

    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, query]);

  return (
    <main className="shop-page">
      <header className="shop-header">
        <Link href="/" className="shop-back">← Home</Link>
        <span>LIMITLESS NATURALS</span>
        <CartLink className="shop-bag" />
      </header>
      <section className="shop-hero">
        <p className="shop-eyebrow">YOUR DAILY WELLNESS</p>
        <h1>Find your<br /><em>formula.</em></h1>
        <p>Thoughtfully made essentials for the way you want to feel.</p>
      </section>
      <section className="shop-catalog">
        <div className="shop-toolbar">
          <div className="shop-filters">
            {(["All", "Women", "Men"] as const).map((value) => (
              <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>
                {value}
              </button>
            ))}
          </div>
          <div className="shop-tools">
            <input
              aria-label="Search products"
              placeholder="Search formulas…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
        <p className="shop-count">{filtered.length} {filtered.length === 1 ? "formula" : "formulas"}</p>
        <div className="shop-grid">
          {filtered.map((product) => (
            <Link className="shop-card" href={`/products/${product.slug}`} key={product.slug}>
              <div className="shop-card-image" style={{ "--product-color": product.color } as React.CSSProperties}>
                <span className="shop-card-badge">Daily formula</span>
                <img src={product.image} alt={product.name} />
                <span className="shop-card-quick">View details ↗</span>
              </div>
              <div className="shop-card-info">
                <div><h2>{product.name}</h2><p>{product.type}</p></div>
                <strong>{`EGP ${product.price}`}</strong>
              </div>
              <div className="shop-card-rating"><span>★★★★★</span> {product.rating} ({product.reviews})</div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="shop-empty">No formulas match your search.</div>}
      </section>
      <footer className="shop-footer">
        <Link href="/">Limitless<span>+</span></Link>
        <p>Wellness, made thoughtfully.</p>
      </footer>
    </main>
  );
}
