import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wholesale = searchParams.get("wholesale") === "true";

    const result = await query(`
      SELECT p.id, p.name, p.price, p.original_price, p.in_stock, p.stock_quantity,
             p.rating, p.review_count, p.is_wholesale, p.wholesale_min_qty, p.wholesale_price,
             c.name as category,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true ${wholesale ? "AND p.is_wholesale = true" : ""}
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
