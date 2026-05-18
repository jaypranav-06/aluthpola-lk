"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Key,
  LogOut, Menu, X, Home, Boxes, Megaphone, Percent, Star,
  HeadphonesIcon, Settings, ChevronRight, TrendingUp,
  DollarSign, ArrowLeft,
} from "lucide-react";

interface AdminUser { id: string; email: string; name: string; role: string; }

interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProductsSold: number;
  ordersByStatus: { order_status: string; count: number }[];
  topProducts: { product_name: string; units_sold: number; revenue: number }[];
}

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingCart },
  { label: "Products",  href: "/admin/products",  icon: Package },
  { label: "Customers", href: "/admin/users",     icon: Users },
  { label: "Analytics", href: "/admin/reports",   icon: BarChart3 },
  { label: "API Keys",  href: "/admin/api-keys",  icon: Key },
];
const NAV2 = [
  { label: "Marketing", href: "#", icon: Megaphone },
  { label: "Coupons",   href: "#", icon: Percent },
  { label: "Reviews",   href: "#", icon: Star },
  { label: "Inventory", href: "#", icon: Boxes },
  { label: "Support",   href: "#", icon: HeadphonesIcon },
  { label: "Settings",  href: "/admin/settings", icon: Settings },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  delivered:        { bg: "#f0fdf4", color: "#16a34a" },
  confirmed:        { bg: "#eff6ff", color: "#2563eb" },
  shipped:          { bg: "#f0f9ff", color: "#0284c7" },
  pending:          { bg: "#fffbeb", color: "#d97706" },
  cancelled:        { bg: "#fff1f2", color: "#e11d48" },
  preparing:        { bg: "#fff7ed", color: "#ea580c" },
  returned:         { bg: "#fdf4ff", color: "#9333ea" },
  out_for_delivery: { bg: "#fdf4ff", color: "#9333ea" },
};

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setUser(parsed);
    setLoading(false);

    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? null))
      .finally(() => setStatsLoading(false));
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("user"); router.push("/login"); };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
          style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "w-64" : sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-gray-900 flex flex-col transition-all duration-300 ${mobile ? "" : "hidden lg:flex"}`}
      style={{ minHeight: "100vh" }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center min-w-0 flex-1">
          <Image src="/Aluthpola Logo.png" alt="Aluthpola.lk" width={120} height={48}
            className={`object-contain ${sidebarOpen || mobile ? "h-9 w-auto" : "h-8 w-8 object-left"}`}
            />
        </Link>
        {!mobile && <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-500 hover:text-gray-300"><Menu className="w-4 h-4" /></button>}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Main</p>}
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin/reports";
          return (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
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
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 cursor-pointer">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>{user?.name?.[0]?.toUpperCase()}</div>
          {(sidebarOpen || mobile) && <div className="flex-1 min-w-0"><p className="text-white text-sm font-semibold truncate">{user?.name}</p><p className="text-gray-500 text-xs truncate">{user?.email}</p></div>}
          {(sidebarOpen || mobile) && <button onClick={handleLogout} className="text-gray-500 hover:text-red-400"><LogOut className="w-4 h-4" /></button>}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar mobile /></div>
          <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-1.5"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-4 h-4" /></Link>
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div>
              <h1 className="text-lg font-black text-gray-900">Analytics</h1>
              <p className="text-xs text-gray-400">Real-time store performance</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"><Home className="w-4 h-4" /></Link>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* Key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue",    value: statsLoading ? "—" : `LKR ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "#22c55e", bg: "#f0fdf4" },
              { label: "Total Orders",     value: statsLoading ? "—" : String(stats?.totalOrders ?? 0),       icon: ShoppingCart, color: "#0ea5e9", bg: "#f0f9ff" },
              { label: "Total Customers",  value: statsLoading ? "—" : String(stats?.totalCustomers ?? 0),    icon: Users,        color: "#8b5cf6", bg: "#f5f3ff" },
              { label: "Products Sold",    value: statsLoading ? "—" : String(stats?.totalProductsSold ?? 0), icon: Package,      color: "#f97316", bg: "#fff7ed" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">

            {/* Order status breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Order Status Breakdown</h2>
              {statsLoading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
              ) : !stats || stats.ordersByStatus.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2 text-gray-300">
                  <ShoppingCart className="w-10 h-10" />
                  <p className="text-sm font-medium text-gray-400">No orders yet</p>
                  <p className="text-xs">Order data will appear here once customers start buying</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.ordersByStatus.map(({ order_status, count }) => {
                    const style = STATUS_COLORS[order_status] ?? { bg: "#f3f4f6", color: "#6b7280" };
                    const label = order_status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                    const total = stats.ordersByStatus.reduce((a, b) => a + Number(b.count), 0);
                    const pct = total > 0 ? Math.round((Number(count) / total) * 100) : 0;
                    return (
                      <div key={order_status} className="flex items-center justify-between p-3 rounded-xl" style={{ background: style.bg }}>
                        <span className="text-sm font-semibold" style={{ color: style.color }}>{label}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: style.color }} />
                          </div>
                          <span className="text-sm font-bold w-8 text-right" style={{ color: style.color }}>{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top selling products */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Top Selling Products</h2>
              {statsLoading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
              ) : !stats || stats.topProducts.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2 text-gray-300">
                  <Package className="w-10 h-10" />
                  <p className="text-sm font-medium text-gray-400">No sales data yet</p>
                  <p className="text-xs">Top products will appear here after orders are placed</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.topProducts.map(({ product_name, units_sold, revenue }, i) => (
                    <div key={product_name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{product_name}</p>
                        <p className="text-xs text-gray-400">{units_sold} units sold</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap">LKR {Number(revenue).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
