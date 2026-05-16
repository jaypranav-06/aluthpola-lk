import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await query(
      `SELECT
        p.id, p.name, p.description, p.price, p.original_price,
        p.stock_quantity as stock, p.in_stock, p.rating, p.review_count,
        p.specifications, p.is_active,
        COALESCE(c.name, 'Uncategorized') as category,
        pi.image_url,
        p.created_at
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN LATERAL (
         SELECT image_url FROM product_images
         WHERE product_id = p.id AND is_primary = true LIMIT 1
       ) pi ON true
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const related = await query(
      `SELECT
        p.id, p.name, p.price, p.original_price,
        p.stock_quantity as stock, p.in_stock, p.rating,
        COALESCE(c.name, 'Uncategorized') as category,
        pi.image_url
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN LATERAL (
         SELECT image_url FROM product_images
         WHERE product_id = p.id AND is_primary = true LIMIT 1
       ) pi ON true
       WHERE p.category_id = (SELECT category_id FROM products WHERE id = $1)
         AND p.id != $1 AND p.is_active = true
       ORDER BY p.created_at DESC LIMIT 4`,
      [id]
    );

    return NextResponse.json({ success: true, product: result.rows[0], related: related.rows });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
