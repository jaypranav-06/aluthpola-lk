import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query(`
      SELECT o.id, o.order_number, o.user_name, o.user_email, o.total,
             o.order_status, o.payment_status, o.created_at,
             COUNT(oi.id)::int AS items_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return NextResponse.json({ orders: result.rows });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
