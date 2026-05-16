"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashSaleTimer } from "./flash-sale-timer";
import { FlashSale, Product } from "@/types";
import { getRemainingStockPercentage } from "@/data/flash-sales";
import { getPlaceholderImage } from "@/lib/image-utils";
import { ShoppingCart, Zap } from "lucide-react";

interface FlashSaleCardProps {
  sale: FlashSale;
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function FlashSaleCard({ sale, product, onAddToCart }: FlashSaleCardProps) {
  const remainingStock = sale.stockLimit - sale.soldCount;
  const stockPercentage = getRemainingStockPercentage(sale);
  const imagePath = product.images[0]?.startsWith('http')
    ? product.images[0]
    : getPlaceholderImage(600, 600, product.name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-xl">
        {/* Flash Sale Badge */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
          <Zap className="h-3 w-3 fill-white" />
          FLASH SALE
        </div>

        {/* Discount Badge */}
        <div className="absolute right-2 top-2 z-10 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-red-900 shadow-lg">
          -{sale.discountPercentage}%
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imagePath}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-4">
          {/* Partner Badge */}
          <Badge variant="secondary" className="mb-2 w-fit truncate text-xs" title={product.partnerName}>
            {product.partnerName}
          </Badge>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold transition-colors group-hover:text-primary group-hover:underline" title={product.name}>
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mb-3 flex min-h-[2rem] flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              LKR {sale.flashPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              LKR {product.price.toLocaleString()}
            </span>
          </div>

          {/* Timer */}
          <div className="mb-3">
            <FlashSaleTimer endTime={sale.endTime} />
          </div>

          {/* Stock Progress */}
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {remainingStock} left
              </span>
              <span className="font-semibold text-red-600">
                {sale.soldCount} sold
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 transition-all"
                style={{ width: `${100 - stockPercentage}%` }}
              />
            </div>
          </div>

          {/* Stock Warning */}
          {stockPercentage < 20 && (
            <p className="mb-3 animate-pulse text-xs font-semibold text-red-600">
              Only {remainingStock} left in stock!
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            className="mt-auto w-full"
            size="sm"
            variant="default"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
}
