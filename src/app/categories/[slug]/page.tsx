"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";
import { ArrowLeft, Heart, ShoppingCart, Package } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  in_stock: boolean;
  stock_quantity: number;
  rating: number;
  review_count: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const { isFavourite, toggle } = useFavourites();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    fetch(`/api/categories/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setNotFound(true); return; }
        setCategory(data.category);
        setProducts(data.products ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "newest": sorted.reverse(); break;
    }
    return sorted;
  }, [products, sortBy]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  if (notFound || !category) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
      <Link href="/categories"><Button><ArrowLeft className="mr-2 h-4 w-4" />Back to Categories</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />All Categories
            </Button>
          </Link>
          <h1 className="text-3xl font-black text-gray-900">{category.name}</h1>
          <p className="text-gray-400 mt-1">{products.length} products</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <select
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {sortedProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg text-gray-500">No products in this category yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => {
              const salePrice = product.original_price ?? product.price;
              const hasDiscount = !!product.original_price;
              const discountPct = hasDiscount ? Math.round((1 - product.original_price! / product.price) * 100) : 0;
              const fav = isFavourite(product.id);

              return (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                  <div className="relative aspect-square bg-gray-50">
                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="300px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </Link>
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{discountPct}%
                      </span>
                    )}
                    <button
                      onClick={() => toggle({ id: product.id, name: product.name, price: product.price, original_price: product.original_price ?? undefined, image_url: product.image_url ?? undefined, in_stock: product.in_stock, category: product.category, description: "", stock: product.stock_quantity })}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                    >
                      <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-500 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-black text-gray-900">LKR {Number(salePrice).toLocaleString()}</span>
                      {hasDiscount && <span className="text-xs text-gray-400 line-through">LKR {Number(product.price).toLocaleString()}</span>}
                    </div>
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: salePrice, originalPrice: hasDiscount ? product.price : undefined, images: product.image_url ? [product.image_url] : [], category: product.category, inStock: product.in_stock, rating: 0, reviewCount: 0, partnerName: "Aluthpola", partnerId: "aluthpola", description: "", isWholesale: false, tags: [] }, 1)}
                      disabled={!product.in_stock}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
