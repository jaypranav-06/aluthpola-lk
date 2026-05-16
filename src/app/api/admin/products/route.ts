import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Query all products from database with category name
    const result = await query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.stock_quantity as stock,
        p.stock_quantity,
        p.rating,
        p.review_count,
        COALESCE(c.name, 'Uncategorized') as category,
        pi.image_url,
        p.created_at
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN LATERAL (
         SELECT image_url
         FROM product_images
         WHERE product_id = p.id AND is_primary = true
         LIMIT 1
       ) pi ON true
       ORDER BY p.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, original_price, stock, category, image_url } = body;

    // Validate required fields
    if (!name || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: "Name, description, price, stock, and category are required" },
        { status: 400 }
      );
    }

    // Validate numeric values
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Stock must be a valid non-negative integer" },
        { status: 400 }
      );
    }

    // Generate a unique slug from name
    const baseSlug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    let slug = baseSlug;
    let slugExists = await query(`SELECT id FROM products WHERE slug = $1`, [slug]);
    let slugSuffix = 1;
    while (slugExists.rows.length > 0) {
      slug = `${baseSlug}-${slugSuffix++}`;
      slugExists = await query(`SELECT id FROM products WHERE slug = $1`, [slug]);
    }

    // Find or create category
    let categoryId = null;
    if (category) {
      const categorySlug = category.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Try to find existing category
      const existingCategory = await query(
        `SELECT id FROM categories WHERE name = $1 OR slug = $2`,
        [category, categorySlug]
      );

      if (existingCategory.rows.length > 0) {
        categoryId = existingCategory.rows[0].id;
      } else {
        // Create new category
        const newCategory = await query(
          `INSERT INTO categories (name, slug, description)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [category, categorySlug, `${category} products`]
        );
        categoryId = newCategory.rows[0].id;
      }
    }

    // Insert new product
    const productResult = await query(
      `INSERT INTO products (name, slug, description, price, original_price, stock_quantity, category_id, in_stock, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING id, name, slug, description, price, original_price, stock_quantity, created_at`,
      [name, slug, description, price, original_price || null, stock, categoryId, stock > 0]
    );

    const product = productResult.rows[0];

    // If image URL is provided, insert into product_images
    if (image_url) {
      await query(
        `INSERT INTO product_images (product_id, image_url, is_primary)
         VALUES ($1, $2, true)`,
        [product.id, image_url]
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        stock: product.stock_quantity,
        category: category,
        image_url: image_url || null,
      },
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
