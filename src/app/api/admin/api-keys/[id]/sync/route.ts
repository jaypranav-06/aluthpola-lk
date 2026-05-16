import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getMockProductsByPlatform } from "@/lib/sync/mockProducts";

async function syncProductsFromPlatform(apiKey: any) {
  // Get mock products for this platform
  const mockProducts = getMockProductsByPlatform(apiKey.platform);

  if (mockProducts.length === 0) {
    throw new Error(`No mock products available for platform: ${apiKey.platform}`);
  }

  let syncedCount = 0;
  let errorCount = 0;

  for (const product of mockProducts) {
    try {
      // Generate slug from name
      const slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Find or create category
      let categoryId = null;
      if (product.category) {
        const categorySlug = product.category
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim();

        const existingCategory = await query(
          `SELECT id FROM categories WHERE name = $1 OR slug = $2`,
          [product.category, categorySlug]
        );

        if (existingCategory.rows.length > 0) {
          categoryId = existingCategory.rows[0].id;
        } else {
          const newCategory = await query(
            `INSERT INTO categories (name, slug, description)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [product.category, categorySlug, `${product.category} products`]
          );
          categoryId = newCategory.rows[0].id;
        }
      }

      // Check if product already exists (by name and partner)
      const existingProduct = await query(
        `SELECT id FROM products WHERE name = $1 AND partner_id = $2`,
        [product.name, apiKey.partner_id]
      );

      if (existingProduct.rows.length > 0) {
        // Update existing product
        await query(
          `UPDATE products
           SET description = $1,
               price = $2,
               stock_quantity = $3,
               category_id = $4,
               in_stock = $5,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $6`,
          [
            product.description,
            product.price,
            product.stock,
            categoryId,
            product.stock > 0,
            existingProduct.rows[0].id,
          ]
        );

        // Update product image if provided
        if (product.image_url) {
          const existingImage = await query(
            `SELECT id FROM product_images WHERE product_id = $1 AND is_primary = true`,
            [existingProduct.rows[0].id]
          );

          if (existingImage.rows.length > 0) {
            await query(
              `UPDATE product_images SET image_url = $1 WHERE id = $2`,
              [product.image_url, existingImage.rows[0].id]
            );
          } else {
            await query(
              `INSERT INTO product_images (product_id, image_url, is_primary)
               VALUES ($1, $2, true)`,
              [existingProduct.rows[0].id, product.image_url]
            );
          }
        }
      } else {
        // Insert new product
        const productResult = await query(
          `INSERT INTO products (name, slug, description, price, stock_quantity, category_id, partner_id, in_stock, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
           RETURNING id`,
          [
            product.name,
            slug,
            product.description,
            product.price,
            product.stock,
            categoryId,
            apiKey.partner_id,
            product.stock > 0,
          ]
        );

        // Insert product image if provided
        if (product.image_url) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary)
             VALUES ($1, $2, true)`,
            [productResult.rows[0].id, product.image_url]
          );
        }
      }

      syncedCount++;
    } catch (error) {
      console.error(`Error syncing product ${product.name}:`, error);
      errorCount++;
    }
  }

  return { syncedCount, errorCount, total: mockProducts.length };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKeyId = params.id;

    // Get the API key details
    const apiKeyResult = await query(
      `SELECT pak.*, p.name as partner_name
       FROM partner_api_keys pak
       LEFT JOIN partners p ON pak.partner_id = p.id
       WHERE pak.id = $1`,
      [apiKeyId]
    );

    if (apiKeyResult.rows.length === 0) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    const apiKey = apiKeyResult.rows[0];

    if (!apiKey.is_active) {
      return NextResponse.json(
        { error: "API key is not active" },
        { status: 400 }
      );
    }

    // Update sync status to syncing
    await query(
      `UPDATE partner_api_keys
       SET sync_status = 'syncing', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [apiKeyId]
    );

    // Start async sync process
    // In production, this should be a background job/queue
    (async () => {
      try {
        const result = await syncProductsFromPlatform(apiKey);

        await query(
          `UPDATE partner_api_keys
           SET sync_status = 'success',
               last_sync_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [apiKeyId]
        );

        console.log(
          `Sync completed for ${apiKey.platform}: ${result.syncedCount}/${result.total} products synced, ${result.errorCount} errors`
        );
      } catch (error) {
        console.error("Error in sync process:", error);
        await query(
          `UPDATE partner_api_keys
           SET sync_status = 'failed', updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [apiKeyId]
        );
      }
    })();

    return NextResponse.json({
      success: true,
      message: `Product sync started for ${apiKey.platform}. This may take a few moments.`,
    });
  } catch (error) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
