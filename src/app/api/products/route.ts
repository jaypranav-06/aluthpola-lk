import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wholesale = searchParams.get("wholesale") === "true";
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const sort = searchParams.get("sort") || "newest";

    const conditions: string[] = ["p.is_active = true"];
    const params: (string | boolean)[] = [];

    if (wholesale) conditions.push("p.is_wholesale = true");

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length} OR c.name ILIKE $${params.length})`);
    }

    if (category && category !== "All") {
      params.push(`%${category}%`);
      conditions.push(`c.name ILIKE $${params.length}`);
    }

    const orderClause =
      sort === "price_asc"    ? "p.price ASC"         :
      sort === "price_desc"   ? "p.price DESC"         :
      sort === "best_rated"   ? "p.rating DESC NULLS LAST" :
      sort === "most_reviews" ? "p.review_count DESC NULLS LAST" :
      "p.created_at DESC";

    const result = await query(`
      SELECT p.id, p.name, p.price, p.original_price, p.in_stock, p.stock_quantity,
             p.rating, p.review_count, p.is_wholesale, p.wholesale_min_qty, p.wholesale_price,
             c.name as category,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY ${orderClause}
    `, params.length ? params : undefined);

    return NextResponse.json({ products: result.rows });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
