"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashSaleCard } from "./flash-sale-card";
import { getActiveFlashSales } from "@/data/flash-sales";
import { Product } from "@/types";
import { ArrowRight, Zap } from "lucide-react";

interface FlashSalesSectionProps {
  onAddToCart?: (product: Product) => void;
}

export function FlashSalesSection({ onAddToCart }: FlashSalesSectionProps) {
  const [flashSales, setFlashSales] = useState(getActiveFlashSales());

  useEffect(() => {
    // Refresh flash sales every minute
    const interval = setInterval(() => {
      setFlashSales(getActiveFlashSales());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (flashSales.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-10 h-24 w-24 animate-pulse rounded-full bg-red-200/30 blur-xl dark:bg-red-500/10" />
        <div className="absolute right-10 top-20 h-32 w-32 animate-pulse rounded-full bg-orange-200/30 blur-xl dark:bg-orange-500/10" />
        <div className="absolute bottom-10 left-1/3 h-28 w-28 animate-pulse rounded-full bg-yellow-200/30 blur-xl dark:bg-yellow-500/10" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <Zap className="h-6 w-6 fill-red-600 text-red-600" />
              <Badge variant="destructive" className="text-base font-bold">
                FLASH SALE
              </Badge>
              <Zap className="h-6 w-6 fill-red-600 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Time-Limited Mega Deals
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Grab these incredible deals before time runs out!
            </p>
          </div>
          <Link href="/flash-sales" className="w-full sm:w-auto">
            <Button size="lg" variant="destructive" className="w-full shadow-lg sm:w-auto">
              <span className="hidden sm:inline">View All Flash Sales</span>
              <span className="sm:hidden">View All</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Flash Sale Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {flashSales.slice(0, 6).map((sale) => (
            <FlashSaleCard
              key={sale.id}
              sale={sale}
              product={sale.product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        {flashSales.length > 6 && (
          <div className="mt-8 text-center">
            <Link href="/flash-sales">
              <Button size="lg" variant="outline" className="shadow">
                See {flashSales.length - 6} More Flash Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
