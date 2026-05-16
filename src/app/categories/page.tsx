"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/categories";
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

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900 mb-1">All Categories</h1>
          <p className="text-gray-400">Browse products by category and find exactly what you're looking for</p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const meta = ICON_MAP[category.icon ?? ""] ?? ICON_MAP["Package"];
            const Icon = meta.icon;

            return (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                <Card className="overflow-hidden border border-gray-100 bg-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
                  <div className="flex items-center gap-4 p-6">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: meta.bg }}>
                      <Icon className="w-7 h-7" style={{ color: meta.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </h2>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {(category.productCount ?? 0).toLocaleString()} products
                      </Badge>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 transition-all group-hover:text-orange-500 group-hover:translate-x-1" />
                  </div>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 4).map((sub) => (
                          <Badge key={sub.id} variant="outline"
                            className="text-xs text-gray-500 border-gray-200 bg-white">
                            {sub.name}
                          </Badge>
                        ))}
                        {category.subcategories.length > 4 && (
                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-200 bg-white">
                            +{category.subcategories.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
