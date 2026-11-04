"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../../lib/products";

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    let list = products.filter(p => (category === "All" || p.category === category) && (p.name + " " + p.type).toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") list.sort((a,b) => a.price-b.price);
    if (sort === "price-high") list.sort((a,b) => b.price-a.price);
    if (sort === "rating") list.sort((a,b) => b.rating-a.rating);
    return list;
  }, [category, sort, query]);
  return <main className="shop-page">
    <header className="shop-header"><Link href="/" className="shop-back">← Home</Link><span>LIMITLESS NATURALS</span><Link href="/shop" className="shop-bag">Shop</Link></header>
    <section className="shop-hero"><p className="shop-eyebrow">YOUR DAILY WELLNESS</p><h1>Find your<br/><em>formula.</em></h1><p>Thoughtfully made essentials for the way you want to feel.</p></section>
    <section className="shop-catalog">
      <div className="shop-toolbar"><div className="shop-filters">{["All","Women","Men"].map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="shop-tools"><input aria-label="Search products" placeholder="Search formulas…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div></div>
      <p className="shop-count">{filtered.length} {filtered.length===1?"formula":"formulas"}</p>
      <div className="shop-grid">{filtered.map(p=><Link className="shop-card" href={"/products/"+p.slug} key={p.slug}><div className="shop-card-image" style={{"--product-color":p.color}}><span className="shop-card-badge">Daily formula</span><img src={p.image} alt={p.name}/><span className="shop-card-quick">View details ↗</span></div><div className="shop-card-info"><div><h2>{p.name}</h2><p>{p.type}</p></div><strong>${p.price}</strong></div><div className="shop-card-rating"><span>★★★★★</span> {p.rating} ({p.reviews})</div></Link>)}</div>
      {filtered.length===0&&<div className="shop-empty">No formulas match your search.</div>}
    </section>
    <footer className="shop-footer"><Link href="/">Limitless<span>+</span></Link><p>Wellness, made thoughtfully.</p></footer>
  </main>;
}
