import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const catResult = await query(
      `SELECT id, name, slug, icon FROM categories WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (catResult.rows.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const category = catResult.rows[0];

    const productsResult = await query(
      `SELECT p.id, p.name, p.price, p.original_price, p.in_stock, p.stock_quantity,
              p.rating, p.review_count, c.name as category,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1 AND p.is_active = true
       ORDER BY p.created_at DESC`,
      [category.id]
    );

    return NextResponse.json({ category, products: productsResult.rows });
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}
