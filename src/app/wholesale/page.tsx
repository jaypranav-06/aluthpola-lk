"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight, Package, TrendingDown, Users, ShoppingCart } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  in_stock: boolean;
  stock_quantity: number;
  category: string;
  wholesale_min_qty: number | null;
  wholesale_price: number | null;
}

export default function WholesalePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    fetch("/api/products?wholesale=true")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    }
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 text-base">
              <Package className="mr-2 h-4 w-4" />Bulk Orders
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Wholesale Marketplace</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Buy in bulk and save big! Perfect for retailers, businesses, and bulk buyers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Why Buy Wholesale?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
                <TrendingDown className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Lower Prices</h3>
              <p className="text-muted-foreground">Save 10-30% on bulk purchases compared to retail prices</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Minimum Quantities</h3>
              <p className="text-muted-foreground">Flexible minimum order quantities to suit your business needs</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Business Support</h3>
              <p className="text-muted-foreground">Dedicated support team to help with your bulk orders</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Wholesale Products</h2>
              <p className="text-muted-foreground">{products.length} bulk items available</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : sortedProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Wholesale Products Available</h3>
              <p className="text-muted-foreground">Check back soon for bulk order deals!</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => {
                const salePrice = product.wholesale_price ?? product.original_price ?? product.price;
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
                      {product.wholesale_min_qty && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Min {product.wholesale_min_qty} units
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-500">{product.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-black text-gray-900">LKR {Number(salePrice).toLocaleString()}</span>
                        {salePrice < product.price && (
                          <span className="text-xs text-gray-400 line-through">LKR {Number(product.price).toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem({ id: product.id, name: product.name, price: salePrice, originalPrice: salePrice < product.price ? product.price : undefined, images: product.image_url ? [product.image_url] : [], category: product.category, inStock: product.in_stock, rating: 0, reviewCount: 0, partnerName: "Aluthpola", partnerId: "aluthpola", description: "", isWholesale: true, tags: [] }, 1)}
                        disabled={!product.in_stock}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-40"
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
        </div>
      </section>

      <section className="py-16" style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Need a Custom Bulk Order?</h2>
          <p className="mb-8 text-lg opacity-90">Contact our wholesale team for custom quantities and special pricing</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Wholesale Team <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
