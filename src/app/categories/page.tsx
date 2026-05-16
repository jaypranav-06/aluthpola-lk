"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Cpu, Shirt, Home, Sparkles, Dumbbell,
  Package, Blocks, BookOpen, LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  Cpu:       { icon: Cpu,      color: "#3b82f6", bg: "#eff6ff" },
  Shirt:     { icon: Shirt,    color: "#a855f7", bg: "#fdf4ff" },
  Home:      { icon: Home,     color: "#f59e0b", bg: "#fffbeb" },
  Sparkles:  { icon: Sparkles, color: "#f43f5e", bg: "#fff1f2" },
  Dumbbell:  { icon: Dumbbell, color: "#14b8a6", bg: "#f0fdfa" },
  Package:   { icon: Package,  color: "#f97316", bg: "#fff7ed" },
  Blocks:    { icon: Blocks,   color: "#8b5cf6", bg: "#f5f3ff" },
  BookOpen:  { icon: BookOpen, color: "#22c55e", bg: "#f0fdf4" },
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  product_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900 mb-1">All Categories</h1>
          <p className="text-gray-400">Browse products by category and find exactly what you're looking for</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No categories yet</p>
            <p className="text-sm">Add products with categories in the admin panel</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const meta = ICON_MAP[category.icon ?? ""] ?? ICON_MAP["Package"];
              const Icon = meta.icon;
              return (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                  <Card className="overflow-hidden border border-gray-100 bg-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
                    <div className="flex items-center gap-4 p-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: meta.bg }}>
                        <Icon className="w-7 h-7" style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                          {category.name}
                        </h2>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {category.product_count} products
                        </Badge>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 transition-all group-hover:text-orange-500 group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
