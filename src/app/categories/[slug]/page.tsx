"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Product } from "@/types";
import { ArrowLeft, Filter } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Find the category
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The category you're looking for doesn't exist.
        </p>
        <Link href="/categories">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>
    );
  }

  // Filter and sort products
  const categoryProducts = useMemo(() => {
    // First filter by category
    let filtered = products.filter((product) => {
      if (category.id === "wholesale") {
        return product.isWholesale;
      }
      return product.category === category.id;
    });

    // Then sort based on selected option
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming products array order represents newest first
        sorted.reverse();
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    return sorted;
  }, [category.id, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Link href="/categories">
            <Button variant="ghost" className="mb-4" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">All Categories</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-4xl sm:text-6xl">{category.icon}</div>
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold sm:text-4xl">{category.name}</h1>
              <Badge variant="secondary" className="text-xs sm:text-base">
                {categoryProducts.length} products
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="border-b border-border bg-muted/20 py-6">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-lg font-semibold">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="outline"
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground"
                >
                  {sub.name} ({sub.productCount})
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters and Sorting */}
      <section className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:flex-initial"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {categoryProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No products found in this category yet. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
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
    </div>
  );
}
