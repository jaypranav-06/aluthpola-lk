"use client";

import Link from "next/link";
import { Heart, Package, ShoppingCart, X } from "lucide-react";
import { useFavourites } from "@/hooks/use-favourites";
import { useCart } from "@/hooks/use-cart";

export default function FavouritesPage() {
  const { favourites, toggle } = useFavourites();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#fef2f2,#fee2e2)" }}>
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Favourites</h1>
              <p className="text-xs text-gray-400">{favourites.length} {favourites.length === 1 ? "item" : "items"} saved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favourites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">No favourites yet</h2>
            <p className="text-sm text-gray-400 max-w-xs">Tap the heart icon on any product to save it here for later.</p>
            <Link href="/"
              className="mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favourites.map(product => {
              const salePrice = product.original_price ?? product.price;
              const discount = product.original_price
                ? Math.round((1 - product.original_price / product.price) * 100)
                : 0;

              return (
                <div key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-200" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                        -{discount}% OFF
                      </span>
                    )}
                    {/* Remove button */}
                    <button onClick={() => toggle(product)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{product.category}</span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mt-0.5 hover:text-orange-500 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-2 mb-3">
                      <span className="text-base font-black text-gray-900">LKR {Number(salePrice).toLocaleString()}</span>
                      {product.original_price && (
                        <span className="text-xs text-gray-400 line-through">LKR {Number(product.price).toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: salePrice,
                        originalPrice: product.original_price ? product.price : undefined,
                        images: product.image_url ? [product.image_url] : [],
                        category: product.category,
                        inStock: product.in_stock,
                        rating: 0,
                        reviewCount: 0,
                        partnerName: "Aluthpola",
                        partnerId: "aluthpola",
                        description: product.description,
                        isWholesale: false,
                        tags: [],
                      }, 1)}
                      disabled={!product.in_stock}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
