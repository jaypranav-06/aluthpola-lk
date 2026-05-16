"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/image-utils";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Use placeholder image
  const productImage = getPlaceholderImage(600, 600, product.name);

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            unoptimized
          />
          {discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 bg-red-600"
            >
              -{discountPercentage}%
            </Badge>
          )}
          {product.isWholesale && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-accent"
            >
              Wholesale
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="group/title">
          <h3 className="mb-1 line-clamp-2 min-h-[3rem] font-semibold text-foreground transition-colors group-hover/title:text-primary">
            <span className="group-hover/title:underline">{product.name}</span>
          </h3>
        </Link>

        <div className="mb-2 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mb-3 flex min-h-[2rem] items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-muted-foreground/20 text-[8px] font-bold">
            {product.partnerName[0]}
          </div>
          <span className="truncate" title={product.partnerName}>
            {product.partnerName}
          </span>
        </div>

        <Button
          className="mt-auto w-full"
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(product);
          }}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
