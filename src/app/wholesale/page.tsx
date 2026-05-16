"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { wholesaleProducts } from "@/data/products";
import { ArrowRight, Package, TrendingDown, Users, Zap } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "moq";

export default function WholesalePage() {
  const { addItem } = useCart();
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...wholesaleProducts];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "moq":
        sorted.sort((a, b) => (a.wholesaleMinQty || 0) - (b.wholesaleMinQty || 0));
        break;
      case "featured":
      default:
        // Keep original order
        break;
    }
    return sorted;
  }, [sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 text-base">
              <Package className="mr-2 h-4 w-4" />
              Bulk Orders
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Wholesale Marketplace
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Buy in bulk and save big! Perfect for retailers, businesses, and bulk buyers.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="#products">
                <Button size="lg">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact for Bulk Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Why Buy Wholesale?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <TrendingDown className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Lower Prices</h3>
              <p className="text-muted-foreground">
                Save 10-30% on bulk purchases compared to retail prices
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Minimum Quantities</h3>
              <p className="text-muted-foreground">
                Flexible minimum order quantities to suit your business needs
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Business Support</h3>
              <p className="text-muted-foreground">
                Dedicated support team to help with your bulk orders
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Wholesale Products</h2>
              <p className="text-muted-foreground">
                {wholesaleProducts.length} bulk items available
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                className="rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="moq">Min Order Quantity</option>
              </select>
            </div>
          </div>

          {wholesaleProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Wholesale Products Available</h3>
              <p className="text-muted-foreground">
                Check back soon for bulk order deals!
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Need a Custom Bulk Order?</h2>
          <p className="mb-8 text-lg">
            Contact our wholesale team for custom quantities and special pricing
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Wholesale Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
