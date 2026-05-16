import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [revenue, orders, customers, productsSold, ordersByStatus, topProducts] = await Promise.all([
      query(`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'paid'`),
      query(`SELECT COUNT(*) as count FROM orders`),
      query(`SELECT COUNT(*) as count FROM users WHERE role = 'user'`),
      query(`SELECT COALESCE(SUM(quantity), 0) as count FROM order_items`),
      query(`SELECT order_status, COUNT(*)::int as count FROM orders GROUP BY order_status ORDER BY count DESC`),
      query(`
        SELECT oi.product_name,
               SUM(oi.quantity)::int AS units_sold,
               SUM(oi.total_price) AS revenue
        FROM order_items oi
        GROUP BY oi.product_name
        ORDER BY units_sold DESC
        LIMIT 5
      `),
    ]);

    return NextResponse.json({
      stats: {
        totalRevenue: revenue.rows[0].total,
        totalOrders: Number(orders.rows[0].count),
        totalCustomers: Number(customers.rows[0].count),
        totalProductsSold: Number(productsSold.rows[0].count),
        ordersByStatus: ordersByStatus.rows,
        topProducts: topProducts.rows,
      },
    });
  } catch (error) {
    console.error("Reports fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
