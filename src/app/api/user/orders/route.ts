import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const ordersResult = await query(
      `SELECT id, order_number, order_status, payment_status, total, created_at
       FROM orders
       WHERE user_email = $1
       ORDER BY created_at DESC`,
      [email]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT id, product_name, product_image, quantity, unit_price, total_price
           FROM order_items
           WHERE order_id = $1`,
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("User orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
