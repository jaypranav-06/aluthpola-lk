"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart, Heart, Star, ChevronRight, Zap,
  Truck, ShieldCheck, RotateCcw, Headphones, BadgeCheck,
  TrendingUp, Flame, ArrowRight, Timer,
  Laptop, Shirt, ShoppingBasket, Sparkles, Home, Dumbbell,
  Smartphone, Gamepad2, Package, Mail, Rocket
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";

/* ─── Types ────────────────────────────────────────────── */
interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  stock_quantity: number;
  rating: number | null;
  review_count: number | null;
  category: string;
  image_url: string | null;
}

/* ─── Static data (UI only) ─────────────────────────────── */
const CATEGORIES = [
  { label: "Electronics",        Icon: Laptop,        color: "#eff6ff", border: "#bfdbfe", iconColor: "#3b82f6" },
  { label: "Fashion",            Icon: Shirt,         color: "#fdf4ff", border: "#e9d5ff", iconColor: "#a855f7" },
  { label: "Groceries",          Icon: ShoppingBasket,color: "#f0fdf4", border: "#bbf7d0", iconColor: "#22c55e" },
  { label: "Beauty",             Icon: Sparkles,      color: "#fff1f2", border: "#fecdd3", iconColor: "#f43f5e" },
  { label: "Home & Living",      Icon: Home,          color: "#fffbeb", border: "#fde68a", iconColor: "#f59e0b" },
  { label: "Sports",             Icon: Dumbbell,      color: "#f0fdfa", border: "#99f6e4", iconColor: "#14b8a6" },
  { label: "Mobile Accessories", Icon: Smartphone,    color: "#fef9c3", border: "#fde047", iconColor: "#eab308" },
  { label: "Gaming",             Icon: Gamepad2,      color: "#f5f3ff", border: "#ddd6fe", iconColor: "#8b5cf6" },
];

const BRANDS = ["Samsung", "Apple", "Nike", "Adidas", "Sony", "LG", "Xiaomi", "Reebok"];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Secure Payments",  sub: "256-bit SSL encryption",     color: "#f97316" },
  { icon: Truck,       label: "Fast Delivery",    sub: "Islandwide in 2–5 days",      color: "#0ea5e9" },
  { icon: RotateCcw,   label: "Easy Returns",     sub: "7-day hassle-free returns",   color: "#22c55e" },
  { icon: BadgeCheck,  label: "Verified Sellers", sub: "All sellers are vetted",       color: "#a855f7" },
  { icon: Headphones,  label: "24/7 Support",     sub: "Always here to help",          color: "#f59e0b" },
];

/* ─── Skeleton ──────────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-5 w-24 rounded mt-3" />
        <div className="skeleton h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ─── Product Card ──────────────────────────────────────── */
function ProductCard({ product, onAddToCart }: { product: ApiProduct; onAddToCart: (p: ApiProduct) => void }) {
  const { toggle, isFavourite } = useFavourites();
  const wished = isFavourite(product.id);
  const rating = Number(product.rating ?? 0);
  const reviews = Number(product.review_count ?? 0);
  const hasDiscount = !!product.original_price;
  const salePrice = product.original_price ?? product.price;
  const discountPct = hasDiscount ? Math.round((1 - Number(product.original_price) / Number(product.price)) * 100) : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link href={`/products/${product.id}`} className="relative block w-full h-full">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill
              className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized loading="eager" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
              <Package className="w-16 h-16 text-orange-200" strokeWidth={1} />
            </div>
          )}
          {discountPct > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              -{discountPct}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => toggle({ id: product.id, name: product.name, description: product.description ?? "", price: product.price, stock: product.stock, in_stock: product.stock > 0, category: product.category, image_url: product.image_url })}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
          <Heart className={`w-4 h-4 transition-colors ${wished ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#f97316" }}>
          {product.category}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
            ))}
            <span className="text-[11px] text-gray-400 ml-1">({reviews})</span>
          </div>
        )}
        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-black text-gray-900">
              LKR {Number(salePrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                LKR {Number(product.price).toLocaleString()}
              </span>
            )}
          </div>
          <button
            disabled={product.stock === 0}
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: product.stock === 0 ? "#d1d5db" : "linear-gradient(135deg,#f97316,#fb923c)" }}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Flash Sale Timer ──────────────────────────────────── */
function FlashTimer() {
  const [time, setTime] = useState({ h: 5, m: 23, s: 47 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5">
      <Timer className="w-4 h-4 text-white" />
      <span className="text-white text-sm font-medium">Ends in</span>
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="bg-white text-gray-900 text-sm font-black px-2 py-0.5 rounded-lg min-w-[30px] text-center">{v}</span>
          {i < 2 && <span className="text-white font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function HomePage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/admin/products")
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Cart bridge — API product doesn't match the full Product type the cart expects,
  // so we build a minimal compatible object
  const handleAddToCart = (p: ApiProduct) => {
    const salePrice = p.original_price ?? p.price;
    addItem({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(salePrice),
      originalPrice: p.original_price ? Number(p.price) : undefined,
      images: p.image_url ? [p.image_url] : [],
      category: p.category,
      rating: Number(p.rating ?? 0),
      reviewCount: Number(p.review_count ?? 0),
      inStock: p.stock > 0,
      isWholesale: false,
      partnerId: "direct",
      partnerName: "Aluthpola",
      tags: [],
    } as never);
  };

  const flashProducts = products.slice(0, 4);
  const featuredProducts = products.slice(0, 8);
  const trendingProducts = products;

  return (
    <div className="pb-16 sm:pb-0">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fff 50%,#eff6ff 100%)" }}
        className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="fade-in-up">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: Truck,        label: "Islandwide Delivery" },
                { icon: ShieldCheck,  label: "Secure Payments" },
                { icon: BadgeCheck,   label: "Trusted Sellers" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-orange-100 text-xs font-medium text-gray-600 shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-orange-500" />{label}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              Sri Lanka's{" "}
              <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Trusted
              </span>{" "}
              Online Marketplace
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Discover electronics, fashion, home essentials and more — delivered to your door across Sri Lanka.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/categories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white border-2 border-orange-200 text-orange-600 font-semibold text-sm hover:bg-orange-50 active:scale-95 transition-all">
                Explore Categories
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-10 flex gap-8">
              {[["50K+","Products"],["10K+","Sellers"],["200K+","Happy Customers"]].map(([n,l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-gray-900">{n}</p>
                  <p className="text-xs text-gray-400 font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex items-center justify-center relative">
            <div className="w-80 h-80 rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#fff7ed,#ffe4c4)" }}>
              <ShoppingCart className="w-32 h-32 text-orange-300" strokeWidth={1} />
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#fff7ed" }}>
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
              <div><p className="text-xs font-bold text-gray-800">Flash Deals</p><p className="text-[10px] text-gray-400">Up to 70% off</p></div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: "4s" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#f0fdf4" }}>
                <Rocket className="w-4 h-4 text-green-500" />
              </div>
              <div><p className="text-xs font-bold text-gray-800">Fast Delivery</p><p className="text-[10px] text-gray-400">2–5 days island</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <p className="text-gray-400 text-sm mt-0.5">Find exactly what you're looking for</p>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: "#f97316" }}>
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(({ label, Icon, color, border, iconColor }) => (
            <Link key={label} href={`/categories/${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              style={{ background: color, borderColor: border }}>
              <Icon className="w-7 h-7 transition-transform duration-200 group-hover:scale-110" style={{ color: iconColor }} />
              <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Flash Sale ──────────────────────────────────────── */}
      {false && (loading || flashProducts.length > 0) && (
        <section className="py-10" style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f97316" }}>
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Flash Deals <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                  </h2>
                  <p className="text-gray-400 text-xs">Limited time offers — grab them fast!</p>
                </div>
              </div>
              <FlashTimer />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {loading
                ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : flashProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)
              }
            </div>
            {!loading && flashProducts.length === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">No flash deals right now — check back soon!</p>
            )}
          </div>
        </section>
      )}

      {/* ── Promo Banner ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-3xl p-8 flex items-center justify-between overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Limited Time</p>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Up to 40% Off<br/>Electronics</h3>
              <Link href="/categories/electronics"
                className="inline-flex items-center gap-1 px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:opacity-90 transition-all">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Laptop className="opacity-20 absolute right-4 bottom-2 w-28 h-28 text-amber-700" strokeWidth={1} />
          </div>
          <div className="rounded-3xl p-8 flex items-center justify-between overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#fce7f3,#fbcfe8)" }}>
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-700 mb-1">New Season</p>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Latest Fashion<br/>Arrivals</h3>
              <Link href="/categories/fashion"
                className="inline-flex items-center gap-1 px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:opacity-90 transition-all">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Shirt className="opacity-20 absolute right-4 bottom-2 w-28 h-28 text-pink-700" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
            <p className="text-gray-400 text-sm mt-0.5">Handpicked just for you</p>
          </div>
          <Link href="/" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: "#f97316" }}>
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="flex justify-center mb-4">
              <Package className="w-16 h-16 text-gray-300" strokeWidth={1} />
            </div>
            <p className="text-gray-500 font-semibold text-lg mb-1">No products yet</p>
            <p className="text-gray-400 text-sm mb-6">Check back soon for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
          </div>
        )}
      </section>

      {/* ── Trending Carousel ───────────────────────────────── */}
      {!loading && trendingProducts.length > 0 && (
        <section className="py-10" style={{ background: "#f9fafb" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#f97316" }} />
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Trending Now</h2>
                  <p className="text-gray-400 text-sm">Most popular this week</p>
                </div>
              </div>
            </div>
            <div className="scroll-x flex gap-4 pb-3">
              {trendingProducts.map(p => (
                <div key={p.id} className="flex-shrink-0 w-44 sm:w-52">
                  <ProductCard product={p} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust Section ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Why Shop at Aluthpola.lk?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: `${color}18` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
              <p className="text-xs text-gray-400 leading-snug">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brands ──────────────────────────────────────────── */}
      <section className="border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Our Partner Brands</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {BRANDS.map(brand => (
              <span key={brand}
                className="text-base font-black text-gray-300 hover:text-gray-600 transition-colors cursor-pointer tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#fff7ed,#ffe4c4)" }}>
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#f97316" }}>
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Get Exclusive Deals & Offers</h2>
            <p className="text-gray-500 mb-8">Subscribe to our newsletter and never miss a deal again.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-2xl border border-orange-200 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
              />
              <button type="submit"
                className="px-7 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                Subscribe
              </button>
            </form>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-30" style={{ background: "#fb923c" }} />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
        </div>
      </section>

    </div>
  );
}
