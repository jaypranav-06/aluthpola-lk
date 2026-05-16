import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, original_price, stock, category, image_url } = body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    // Find or create category
    const categorySlug = category.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
    let categoryId: string;
    const existing = await query(`SELECT id FROM categories WHERE name = $1 OR slug = $2`, [category, categorySlug]);
    if (existing.rows.length > 0) {
      categoryId = existing.rows[0].id;
    } else {
      const newCat = await query(
        `INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id`,
        [category, categorySlug, `${category} products`]
      );
      categoryId = newCat.rows[0].id;
    }

    // Update product
    await query(
      `UPDATE products SET name=$1, description=$2, price=$3, original_price=$4, stock_quantity=$5, category_id=$6, in_stock=$7, updated_at=NOW() WHERE id=$8`,
      [name, description, price, original_price || null, stock, categoryId, stock > 0, id]
    );

    // Update image if provided
    if (image_url !== undefined) {
      const imgExists = await query(`SELECT id FROM product_images WHERE product_id=$1 AND is_primary=true`, [id]);
      if (imgExists.rows.length > 0) {
        if (image_url) {
          await query(`UPDATE product_images SET image_url=$1 WHERE product_id=$2 AND is_primary=true`, [image_url, id]);
        } else {
          await query(`DELETE FROM product_images WHERE product_id=$1 AND is_primary=true`, [id]);
        }
      } else if (image_url) {
        await query(`INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, true)`, [id, image_url]);
      }
    }

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query(`DELETE FROM product_images WHERE product_id=$1`, [id]);
    await query(`DELETE FROM products WHERE id=$1`, [id]);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
