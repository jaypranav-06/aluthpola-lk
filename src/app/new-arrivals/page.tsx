"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart, Heart, Star, ChevronRight, Sparkles,
  SlidersHorizontal, Grid3x3, List, X, Package,
  Truck, ArrowRight, TrendingUp, Zap, Search,
  Laptop, Shirt, ShoppingBasket, Home, Dumbbell, Smartphone, Gamepad2,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  created_at?: string;
}

const CATEGORIES = [
  { label: "All",               icon: Sparkles,       color: "#f97316" },
  { label: "Electronics",       icon: Laptop,         color: "#3b82f6" },
  { label: "Fashion",           icon: Shirt,          color: "#a855f7" },
  { label: "Groceries",         icon: ShoppingBasket, color: "#22c55e" },
  { label: "Home & Living",     icon: Home,           color: "#f59e0b" },
  { label: "Sports",            icon: Dumbbell,       color: "#14b8a6" },
  { label: "Mobile Accessories",icon: Smartphone,     color: "#eab308" },
  { label: "Gaming",            icon: Gamepad2,       color: "#8b5cf6" },
];

const SORT_OPTIONS = [
  { key: "newest",      label: "Newest First" },
  { key: "price_asc",  label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "popular",    label: "Most Popular" },
];

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-5 w-24 bg-gray-100 rounded mt-3" />
        <div className="h-9 w-full bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, view }: {
  product: ApiProduct;
  onAddToCart: (p: ApiProduct) => void;
  view: "grid" | "list";
}) {
  const { toggle, isFavourite } = useFavourites();
  const wished = isFavourite(product.id);
  const [adding, setAdding] = useState(false);
  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({ id: product.id, name: product.name, description: product.description, price: product.price, stock: product.stock, in_stock: product.stock > 0, category: product.category, image_url: product.image_url });
  };
  const rating = 4.0 + (product.id.charCodeAt(0) % 10) / 10;
  const reviews = 40 + (product.id.charCodeAt(0) % 8) * 80;
  const hasDiscount = product.price > 2000;
  const originalPrice = hasDiscount ? Math.round(product.price * 1.18) : null;
  const discountPct = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  const handleAdd = async () => {
    setAdding(true);
    onAddToCart(product);
    await new Promise(r => setTimeout(r, 600));
    setAdding(false);
  };

  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 flex gap-4 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <Link href={`/products/${product.id}`}
          className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
          {product.image_url
            ? <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
            : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>}
          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
              style={{ background: "#f97316" }}>{discountPct}% OFF</span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider mb-0.5">{product.category}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-orange-500 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
            <span className="text-[11px] text-gray-400 ml-1">({reviews})</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">LKR {product.price.toLocaleString()}</span>
              {originalPrice && <span className="text-xs text-gray-400 line-through">LKR {originalPrice.toLocaleString()}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleToggleFav}
                className={`p-2 rounded-xl border transition-all ${wished ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"}`}>
                <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
              </button>
              <button onClick={handleAdd} disabled={adding || product.stock === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                <ShoppingCart className="w-3.5 h-3.5" />
                {adding ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {product.image_url
            ? <Image src={product.image_url} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
            : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                <Package className="w-12 h-12" /><span className="text-xs">No image</span>
              </div>}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-sm"
                style={{ background: "#f97316" }}>{discountPct}% OFF</span>
            )}
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-sm bg-emerald-500 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> New
            </span>
          </div>
        </Link>
        <button onClick={handleToggleFav}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${wished ? "bg-red-500 text-white" : "bg-white text-gray-400 opacity-0 group-hover:opacity-100"}`}>
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 hover:text-orange-500 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">({reviews})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-gray-900">LKR {product.price.toLocaleString()}</span>
            {originalPrice && <span className="text-xs text-gray-400 line-through">LKR {originalPrice.toLocaleString()}</span>}
          </div>
          <button onClick={handleAdd} disabled={adding || product.stock === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: adding ? "#22c55e" : "linear-gradient(135deg,#f97316,#fb923c)" }}>
            <ShoppingCart className="w-4 h-4" />
            {adding ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewArrivalsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(r => r.json())
      .then(d => {
        if (!d.success) return;
        const all: ApiProduct[] = d.products;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const recent = all.filter(p => p.created_at && new Date(p.created_at) >= cutoff);
        // fallback: if fewer than 5 products in last 30 days, show the 20 most recent
        setProducts(recent.length >= 5 ? recent : all.slice(0, 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: ApiProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.image_url ? [product.image_url] : [],
      category: product.category,
      rating: 4.5,
      reviewCount: 0,
      inStock: product.stock > 0,
      isWholesale: false,
      partnerId: "aluthpola",
      partnerName: "Aluthpola.lk",
      tags: [],
    });
  };

  const filtered = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "popular")    return b.stock - a.stock;
      return 0;
    });

  const maxPrice = products.length ? Math.max(...products.map(p => p.price)) : 500000;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gray-900" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)" }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Orange glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative max-w-7xl mx-auto px-4 py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-300">New Arrivals</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }}>
                <Zap className="w-3 h-3" /> Just Dropped
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                New <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arrivals</span>
              </h1>
              <p className="text-gray-400 text-base max-w-md">
                Fresh products added to our collection. Be the first to discover the latest arrivals across all categories.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{products.length}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="w-px h-10 bg-gray-700" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{CATEGORIES.length - 1}</p>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
              <div className="w-px h-10 bg-gray-700" />
              <div className="text-center">
                <p className="text-2xl font-black text-white flex items-center gap-1">
                  <Truck className="w-5 h-5 text-orange-400" />
                </p>
                <p className="text-xs text-gray-500">Free Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search + controls bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search new arrivals..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 outline-none focus:border-orange-400 transition-all cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>

          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Price Range</h3>
              <button onClick={() => setPriceRange([0, maxPrice])}
                className="text-xs font-semibold text-orange-500 hover:text-orange-600">Reset</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input type="range" min={0} max={maxPrice} value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-orange-500" />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span>LKR 0</span>
                <span className="text-gray-400">–</span>
                <span className="text-orange-500">LKR {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">

          {/* Category sidebar */}
          <aside className="w-52 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Categories</p>
              <div className="space-y-0.5">
                {CATEGORIES.map(({ label, icon: Icon, color }) => {
                  const count = label === "All" ? products.length : products.filter(p => p.category === label).length;
                  const active = activeCategory === label;
                  return (
                    <button key={label} onClick={() => setActiveCategory(label)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? color : undefined }} />
                      <span className="flex-1">{label}</span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Trending badge */}
              <div className="mt-5 p-3 rounded-xl" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <p className="text-xs font-bold text-orange-700">Trending Now</p>
                </div>
                <p className="text-[11px] text-orange-600">Electronics & Gaming are the most viewed this week.</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Mobile category scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 md:hidden">
              {CATEGORIES.map(({ label, icon: Icon, color }) => {
                const active = activeCategory === label;
                return (
                  <button key={label} onClick={() => setActiveCategory(label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${active ? "text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500"}`}
                    style={active ? { background: color } : {}}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-900">{filtered.length}</span> products
                {activeCategory !== "All" && <> in <span className="font-bold text-orange-500">{activeCategory}</span></>}
              </p>
              {(activeCategory !== "All" || searchQuery) && (
                <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Grid / List */}
            {loading ? (
              <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-3"}>
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-24 flex flex-col items-center gap-4"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Package className="w-7 h-7 text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-gray-700">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different category or search term</p>
                </div>
                <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                  <ArrowRight className="w-4 h-4" /> View all products
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"}>
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} view={viewMode} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
