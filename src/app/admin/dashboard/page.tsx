"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Key, LogOut, Bell, Search, Plus, ChevronRight,
  Clock, CheckCircle2, RefreshCcw, Star, BarChart3, Settings, Tag,
  MessageSquare, Truck, ShieldCheck, Menu, X, Home, FileText, Boxes,
  BadgeDollarSign, Megaphone, Percent, HeadphonesIcon, AlertTriangle, XCircle,
} from "lucide-react";

interface AdminUser { id: string; email: string; name: string; role: string; }

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  user_name: string;
  product_name: string;
  order_status: string;
  payment_status: string;
  total: number;
}

const NAV = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Orders",     href: "/admin/orders",      icon: ShoppingCart },
  { label: "Products",   href: "/admin/products",    icon: Package },
  { label: "Customers",  href: "/admin/users",        icon: Users },
  { label: "Analytics",  href: "/admin/reports",     icon: BarChart3 },
  { label: "API Keys",   href: "/admin/api-keys",    icon: Key },
];

const NAV2 = [
  { label: "Marketing",  href: "#", icon: Megaphone },
  { label: "Coupons",    href: "#", icon: Percent },
  { label: "Reviews",    href: "#", icon: Star },
  { label: "Inventory",  href: "#", icon: Boxes },
  { label: "Support",    href: "#", icon: HeadphonesIcon },
  { label: "Settings",   href: "#", icon: Settings },
];

const QUICK_ACTIONS = [
  { icon: Package,      label: "Add Product",  href: "/admin/products",  color: "#f97316", bg: "#fff7ed" },
  { icon: ShoppingCart, label: "View Orders",  href: "/admin/orders",    color: "#0ea5e9", bg: "#f0f9ff" },
  { icon: Users,        label: "Manage Users", href: "/admin/users",     color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: BarChart3,    label: "View Reports", href: "/admin/reports",   color: "#22c55e", bg: "#f0fdf4" },
  { icon: Key,          label: "API Keys",     href: "/admin/api-keys",  color: "#f59e0b", bg: "#fffbeb" },
  { icon: Tag,          label: "Create Coupon",href: "#",                color: "#e11d48", bg: "#fff1f2" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    delivered:  { bg: "#f0fdf4", color: "#16a34a", label: "Delivered" },
    pending:    { bg: "#fffbeb", color: "#d97706", label: "Pending" },
    cancelled:  { bg: "#fff1f2", color: "#e11d48", label: "Cancelled" },
    refunded:   { bg: "#f5f3ff", color: "#7c3aed", label: "Refunded" },
    shipped:    { bg: "#eff6ff", color: "#2563eb", label: "Shipped" },
    confirmed:  { bg: "#f0fdf4", color: "#16a34a", label: "Confirmed" },
    preparing:  { bg: "#fff7ed", color: "#ea580c", label: "Preparing" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setUser(parsed);
    setLoading(false);

    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders ?? []);
      })
      .catch(console.error);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "w-64" : sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-gray-900 flex flex-col transition-all duration-300 ${mobile ? "" : "hidden lg:flex"}`}
      style={{ minHeight: "100vh" }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          {(sidebarOpen || mobile) && (
            <span className="text-white font-black text-base tracking-tight">
              Aluthpola<span style={{ color: "#f97316" }}>.lk</span>
            </span>
          )}
        </Link>
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-500 hover:text-gray-300 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Main</p>}
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin/dashboard";
          return (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {(sidebarOpen || mobile) && <span>{label}</span>}
              {(sidebarOpen || mobile) && active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-4 mb-1">Tools</p>}
        {NAV2.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Icon className="w-4 h-4 flex-shrink-0" />
            {(sidebarOpen || mobile) && <span>{label}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          {(sidebarOpen || mobile) && (
            <button onClick={handleLogout} title="Logout" className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  const STATS_CARDS = [
    { label: "Total Revenue",      value: stats ? `LKR ${Number(stats.totalRevenue).toLocaleString()}` : "—",  icon: BadgeDollarSign, color: "#f97316", bg: "#fff7ed" },
    { label: "Total Orders",       value: stats ? String(stats.totalOrders) : "—",                              icon: ShoppingCart,    color: "#0ea5e9", bg: "#f0f9ff" },
    { label: "Customers",          value: stats ? String(stats.totalCustomers) : "—",                           icon: Users,           color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Products",           value: stats ? String(stats.totalProducts) : "—",                            icon: Package,         color: "#22c55e", bg: "#f0fdf4" },
    { label: "Pending Orders",     value: stats ? String(stats.pendingOrders) : "—",                            icon: Truck,           color: "#f59e0b", bg: "#fffbeb" },
    { label: "Low Stock",          value: stats ? String(stats.lowStockProducts) : "—",                         icon: AlertTriangle,   color: "#e11d48", bg: "#fff1f2" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar mobile /></div>
          <button className="absolute top-4 left-[260px] text-white" onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="search" placeholder="Search orders, users, products…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600">Live</span>
            </div>
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
              onClick={() => router.push("/admin/products")}>
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-500" />
            </button>
            <Link href="/" className="hidden sm:flex items-center gap-1.5 w-9 h-9 justify-center rounded-xl hover:bg-gray-100 transition-colors" title="View site">
              <Home className="w-5 h-5 text-gray-500" />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-6 py-6 space-y-6 overflow-x-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{today}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/admin/products"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                <Plus className="w-4 h-4" /> Add Product
              </Link>
              <Link href="/admin/reports"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <FileText className="w-4 h-4" /> Reports
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {STATS_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-all hover:-translate-y-0.5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(({ icon: Icon, label, href, color, bg }) => (
                  <Link key={label} href={href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group text-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Inventory alerts from real data */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Inventory Alerts</h2>
              <div className="space-y-3">
                {stats && stats.lowStockProducts > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#f9731630", background: "#fff7ed" }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#f97316" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: "#f97316" }}>Low Stock</p>
                      <p className="text-xs text-gray-500">{stats.lowStockProducts} products below 5 units</p>
                    </div>
                    <Link href="/admin/products" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: "#f97316", background: "#f9731615" }}>Review</Link>
                  </div>
                )}
                {stats && stats.outOfStockProducts > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#e11d4830", background: "#fff1f2" }}>
                    <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#e11d48" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: "#e11d48" }}>Out of Stock</p>
                      <p className="text-xs text-gray-500">{stats.outOfStockProducts} products need restocking</p>
                    </div>
                    <Link href="/admin/products" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: "#e11d48", background: "#e11d4815" }}>Fix</Link>
                  </div>
                )}
                {stats && stats.pendingOrders > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#f59e0b30", background: "#fffbeb" }}>
                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: "#f59e0b" }}>Pending Orders</p>
                      <p className="text-xs text-gray-500">{stats.pendingOrders} orders awaiting dispatch</p>
                    </div>
                    <Link href="/admin/orders" className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: "#f59e0b", background: "#f59e0b15" }}>Process</Link>
                  </div>
                )}
                {stats && stats.lowStockProducts === 0 && stats.outOfStockProducts === 0 && stats.pendingOrders === 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700">All clear — no alerts</p>
                  </div>
                )}
                {!stats && <p className="text-xs text-gray-400">Loading alerts...</p>}
              </div>
            </div>

            {/* Summary panel */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Store Summary</h2>
              <div className="space-y-3">
                {[
                  { icon: Package,      color: "#f97316", bg: "#fff7ed", text: "Total Products",  val: stats?.totalProducts ?? "—" },
                  { icon: Users,        color: "#8b5cf6", bg: "#f5f3ff", text: "Total Customers", val: stats?.totalCustomers ?? "—" },
                  { icon: ShoppingCart, color: "#0ea5e9", bg: "#f0f9ff", text: "Total Orders",    val: stats?.totalOrders ?? "—" },
                  { icon: TrendingUp,   color: "#22c55e", bg: "#f0fdf4", text: "Total Revenue",   val: stats ? `LKR ${Number(stats.totalRevenue).toLocaleString()}` : "—" },
                ].map(({ icon: Icon, color, bg, text, val }) => (
                  <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{text}</p>
                      <p className="text-sm font-black text-gray-900">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Recent Orders</h2>
              <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all" style={{ color: "#f97316" }}>
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Order ID","Customer","Product","Status","Payment","Amount",""].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-gray-500">#{o.order_number}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                              {o.user_name[0]}
                            </div>
                            <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{o.user_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{o.product_name}</td>
                        <td className="px-4 py-3"><StatusBadge status={o.order_status} /></td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium ${o.payment_status === "paid" ? "text-emerald-600" : "text-purple-600"}`}>
                            {o.payment_status === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3" />}
                            {o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900 text-xs whitespace-nowrap">LKR {Number(o.total).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="text-center py-4 text-xs text-gray-300">
            &copy; {new Date().getFullYear()} Aluthpola.lk Admin Dashboard
          </div>
        </main>
      </div>
    </div>
  );
}
