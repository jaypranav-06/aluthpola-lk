"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search, ShoppingCart, Heart, Star, SlidersHorizontal,
  Grid3x3, List, X, Package, ChevronRight,
  Laptop, Shirt, ShoppingBasket, Home, Dumbbell,
  Smartphone, Gamepad2, Sparkles,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  in_stock: boolean;
  stock_quantity: number;
  rating: number | null;
  review_count: number | null;
  category: string;
  image_url: string | null;
}

const CATEGORIES = [
  { label: "All",                icon: Sparkles },
  { label: "Electronics",        icon: Laptop },
  { label: "Fashion",            icon: Shirt },
  { label: "Groceries",          icon: ShoppingBasket },
  { label: "Home & Living",      icon: Home },
  { label: "Sports",             icon: Dumbbell },
  { label: "Mobile Accessories", icon: Smartphone },
  { label: "Gaming",             icon: Gamepad2 },
];

const SORT_OPTIONS = [
  { key: "newest",      label: "Newest" },
  { key: "best_rated",  label: "Best Rated" },
  { key: "price_asc",   label: "Price: Low to High" },
  { key: "price_desc",  label: "Price: High to Low" },
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

function ProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const { addItem } = useCart();
  const { toggle, isFavourite } = useFavourites();
  const [adding, setAdding] = useState(false);
  const wished = isFavourite(product.id);
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(100 - (product.price / product.original_price) * 100)
    : null;

  const handleAdd = async () => {
    setAdding(true);
    addItem({
      id: product.id, name: product.name, price: product.price,
      images: product.image_url ? [product.image_url] : [],
      category: product.category, description: "", rating: product.rating ?? 0,
      reviewCount: product.review_count ?? 0, inStock: product.in_stock,
      isWholesale: false, partnerId: "", partnerName: "", tags: [],
    });
    setTimeout(() => setAdding(false), 800);
  };

  if (view === "list") {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow">
        <Link href={`/products/${product.id}`} className="flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-50">
          {product.image_url
            ? <Image src={product.image_url} alt={product.name} width={112} height={112} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide">{product.category}</span>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2 hover:text-orange-500 transition-colors">{product.name}</h3>
            </Link>
            {product.rating != null && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{Number(product.rating).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.review_count ?? 0})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-gray-900">LKR {Number(product.price).toLocaleString()}</span>
              {product.original_price && <span className="text-xs text-gray-400 line-through">LKR {Number(product.original_price).toLocaleString()}</span>}
              {discount && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg">{discount}% off</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, description: "", stock: product.stock_quantity, in_stock: product.in_stock, category: product.category })}
                className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${wished ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"}`}>
                <Heart className={`w-4 h-4 ${wished ? "fill-red-500" : ""}`} />
              </button>
              <button onClick={handleAdd} disabled={!product.in_stock || adding}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                <ShoppingCart className="w-3.5 h-3.5" />
                {adding ? "Added!" : product.in_stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url
          ? <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-gray-200" /></div>}
        {discount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-bold text-white bg-emerald-500">-{discount}%</span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-lg border">Out of Stock</span>
          </div>
        )}
        <button onClick={(e) => { e.preventDefault(); toggle({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, description: "", stock: product.stock_quantity, in_stock: product.in_stock, category: product.category }); }}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full shadow transition-all ${wished ? "bg-red-50 text-red-500" : "bg-white text-gray-400 opacity-0 group-hover:opacity-100"}`}>
          <Heart className={`w-3.5 h-3.5 ${wished ? "fill-red-500" : ""}`} />
        </button>
      </Link>
      <div className="p-3">
        <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2 hover:text-orange-500 transition-colors leading-snug">{product.name}</h3>
        </Link>
        {product.rating != null && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{Number(product.rating).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.review_count ?? 0})</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-sm font-black text-gray-900">LKR {Number(product.price).toLocaleString()}</span>
          {product.original_price && <span className="text-xs text-gray-400 line-through">LKR {Number(product.original_price).toLocaleString()}</span>}
        </div>
        <button onClick={handleAdd} disabled={!product.in_stock || adding}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
          <ShoppingCart className="w-3.5 h-3.5" />
          {adding ? "Added!" : product.in_stock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const fetchResults = useCallback(async (q: string, cat: string, s: string) => {
    if (!q.trim()) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, sort: s });
      if (cat !== "All") params.set("category", cat);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setQuery(q);
    fetchResults(q, category, sort);
  }, [q, category, sort, fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-6">
      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for electronics, fashion, groceries…"
                className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all"
                autoFocus
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "#f97316" }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">
            {q ? `Results for "${q}"` : "Search"}
          </span>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => setCategory(label)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${category === label ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-sm text-gray-500">
            {loading ? "Searching…" : (
              q
                ? <><span className="font-semibold text-gray-900">{products.length}</span> results for <span className="font-semibold text-orange-500">"{q}"</span></>
                : "Enter a search term above"
            )}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all
                ${showFilters ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort
            </button>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
              <button onClick={() => setView("grid")}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${view === "grid" ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <Grid3x3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setView("list")}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${view === "list" ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sort dropdown */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-5 p-4 bg-white border border-gray-100 rounded-2xl">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button key={key} onClick={() => { setSort(key); setShowFilters(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                  ${sort === key ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 text-gray-600 hover:border-orange-300 bg-white"}`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : !q.trim() ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-orange-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Search Aluthpola.lk</h2>
            <p className="text-sm text-gray-400 max-w-xs">Type a product name, brand, or category in the search box above.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">No results found</h2>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              We couldn&apos;t find anything for &ldquo;{q}&rdquo;. Try a different keyword or browse categories.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Electronics", "Fashion", "Groceries"].map(cat => (
                <button key={cat} onClick={() => { setCategory(cat); setQuery(""); router.push("/search"); }}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all bg-white">
                  Browse {cat}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
            {products.map(p => <ProductCard key={p.id} product={p} view={view} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black"
          style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
