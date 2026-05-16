"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Check, Truck, Shield, RotateCcw, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  in_stock: boolean;
  rating: number;
  review_count: number;
  category: string;
  image_url?: string;
  specifications?: Record<string, string>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const { toggle, isFavourite } = useFavourites();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (d.success) { setProduct(d.product); setRelated(d.related || []); }
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.original_price ?? product.price,
      originalPrice: product.original_price ? product.price : undefined,
      images: product.image_url ? [product.image_url] : [],
      category: product.category,
      inStock: product.in_stock,
      rating: product.rating ?? 0,
      reviewCount: product.review_count ?? 0,
      partnerName: "Aluthpola",
      partnerId: "aluthpola",
      description: product.description,
      isWholesale: false,
      tags: [],
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const salePrice = product ? (product.original_price ?? product.price) : 0;
  const fullPrice = product?.price ?? 0;
  const discount = product?.original_price
    ? Math.round((1 - product.original_price / product.price) * 100)
    : 0;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black animate-pulse"
          style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
        <p className="text-sm text-gray-400">Loading product…</p>
      </div>
    </div>
  );

  if (notFound || !product) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <Package className="w-16 h-16 text-gray-200" />
      <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
      <p className="text-gray-400 text-sm">This product may have been removed or doesn't exist.</p>
      <Link href="/"
        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
        style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
        Back to Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-orange-500 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-200">
                  <Package className="w-20 h-20" />
                  <span className="text-sm text-gray-300">No image</span>
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 block">{product.category}</span>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{Number(product.rating ?? 0).toFixed(1)}</span>
                  <span>({product.review_count ?? 0} reviews)</span>
                </div>
                <span className={`font-semibold ${product.in_stock ? "text-emerald-500" : "text-red-500"}`}>
                  {product.in_stock ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black" style={{ color: "#f97316" }}>
                  LKR {Number(salePrice).toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-300 line-through mb-0.5">
                    LKR {Number(fullPrice).toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-emerald-600 font-semibold mt-1">
                  You save LKR {(Number(fullPrice) - Number(salePrice)).toLocaleString()} ({discount}% off)
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-medium text-gray-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 text-lg font-bold transition-colors">−</button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 text-lg font-bold transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!product.in_stock}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: added ? "#10b981" : "linear-gradient(135deg,#f97316,#fb923c)" }}>
                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={() => product && toggle({ id: product.id, name: product.name, description: product.description, price: product.price, original_price: product.original_price, stock: product.stock, in_stock: product.in_stock, category: product.category, image_url: product.image_url })}
                className={`p-2.5 rounded-xl border transition-colors ${product && isFavourite(product.id) ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"}`}>
                <Heart className={`w-5 h-5 ${product && isFavourite(product.id) ? "fill-current" : ""}`} />
              </button>
              <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { icon: Truck, text: "Free delivery over LKR 5,000" },
                { icon: Shield, text: "Secure payment & buyer protection" },
                { icon: RotateCcw, text: "7-day return policy" },
                { icon: Check, text: "100% authentic products" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-gray-900 mb-6">Related Products</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <Package className="w-10 h-10 text-gray-200" />}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{p.name}</p>
                    <p className="text-sm font-black mt-1" style={{ color: "#f97316" }}>
                      LKR {Number(p.original_price ?? p.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
