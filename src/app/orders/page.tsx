"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingBag, ChevronRight, Package, Clock, Truck, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string; icon: React.ElementType }> = {
  pending:          { bg: "#fffbeb", color: "#d97706", label: "Pending",          icon: Clock },
  confirmed:        { bg: "#eff6ff", color: "#2563eb", label: "Confirmed",        icon: CheckCircle2 },
  preparing:        { bg: "#fff7ed", color: "#ea580c", label: "Preparing",        icon: Package },
  ready_to_ship:    { bg: "#f0f9ff", color: "#0284c7", label: "Ready to Ship",    icon: Package },
  shipped:          { bg: "#f0f9ff", color: "#0284c7", label: "Shipped",          icon: Truck },
  out_for_delivery: { bg: "#fdf4ff", color: "#9333ea", label: "Out for Delivery", icon: Truck },
  delivered:        { bg: "#f0fdf4", color: "#16a34a", label: "Delivered",        icon: CheckCircle2 },
  cancelled:        { bg: "#fff1f2", color: "#e11d48", label: "Cancelled",        icon: XCircle },
  returned:         { bg: "#fdf4ff", color: "#9333ea", label: "Returned",         icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <Icon className="w-3 h-3" />{s.label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!user?.email) return;

    fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-400">Track and manage your orders</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
            <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-gray-200" strokeWidth={1.5} />
            <h2 className="text-lg font-bold text-gray-700 mb-1">No orders yet</h2>
            <p className="text-sm text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
                {/* Order header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">#{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.order_status} />
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                {/* Order items */}
                <div className="px-5 py-3 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × LKR {Number(item.unit_price).toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                        LKR {Number(item.total_price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      order.payment_status === "paid" ? "bg-emerald-50 text-emerald-600" :
                      order.payment_status === "refunded" ? "bg-purple-50 text-purple-600" :
                      "bg-yellow-50 text-yellow-600"
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                  </div>
                  <p className="text-sm font-black text-gray-900">
                    Total: LKR {Number(order.total).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
