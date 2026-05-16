import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [revenue, orders, customers, products, pending, lowStock, outOfStock, recentOrders] = await Promise.all([
      query(`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'paid'`),
      query(`SELECT COUNT(*) as count FROM orders`),
      query(`SELECT COUNT(*) as count FROM users WHERE role = 'user'`),
      query(`SELECT COUNT(*) as count FROM products WHERE is_active = true`),
      query(`SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'`),
      query(`SELECT COUNT(*) as count FROM products WHERE is_active = true AND in_stock = true AND stock_quantity > 0 AND stock_quantity < 5`),
      query(`SELECT COUNT(*) as count FROM products WHERE is_active = true AND (in_stock = false OR stock_quantity = 0)`),
      query(`
        SELECT o.id, o.order_number, o.user_name, o.order_status, o.payment_status, o.total,
               (SELECT oi.product_name FROM order_items oi WHERE oi.order_id = o.id LIMIT 1) as product_name
        FROM orders o
        ORDER BY o.created_at DESC
        LIMIT 5
      `),
    ]);

    return NextResponse.json({
      stats: {
        totalRevenue: revenue.rows[0].total,
        totalOrders: Number(orders.rows[0].count),
        totalCustomers: Number(customers.rows[0].count),
        totalProducts: Number(products.rows[0].count),
        pendingOrders: Number(pending.rows[0].count),
        lowStockProducts: Number(lowStock.rows[0].count),
        outOfStockProducts: Number(outOfStock.rows[0].count),
      },
      recentOrders: recentOrders.rows,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
