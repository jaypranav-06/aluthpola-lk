"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Key,
  LogOut, Bell, Search, ChevronRight, Menu, X, Home, Boxes,
  Megaphone, Percent, Star, HeadphonesIcon, Settings,
  Clock, CheckCircle2, Truck, XCircle, Filter, Download,
  Eye, RefreshCcw, MoreHorizontal,
} from "lucide-react";

interface AdminUser { id: string; email: string; name: string; role: string; }
interface Order {
  id: string;
  order_number: string;
  user_name: string;
  user_email: string;
  total: number;
  order_status: string;
  payment_status: string;
  items_count: number;
  created_at: string;
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
  { label: "Settings",  href: "#", icon: Settings },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string; icon: React.ElementType }> = {
  pending:          { bg: "#fffbeb", color: "#d97706", label: "Pending",    icon: Clock },
  confirmed:        { bg: "#eff6ff", color: "#2563eb", label: "Confirmed",  icon: CheckCircle2 },
  preparing:        { bg: "#fff7ed", color: "#ea580c", label: "Preparing",  icon: RefreshCcw },
  ready_to_ship:    { bg: "#f0f9ff", color: "#0284c7", label: "Ready",      icon: Package },
  shipped:          { bg: "#f0f9ff", color: "#0284c7", label: "Shipped",    icon: Truck },
  out_for_delivery: { bg: "#fdf4ff", color: "#9333ea", label: "Out for Delivery", icon: Truck },
  delivered:        { bg: "#f0fdf4", color: "#16a34a", label: "Delivered",  icon: CheckCircle2 },
  cancelled:        { bg: "#fff1f2", color: "#e11d48", label: "Cancelled",  icon: XCircle },
  returned:         { bg: "#fdf4ff", color: "#9333ea", label: "Returned",   icon: RefreshCcw },
};

const STATUS_TABS = [
  { key: "all",       label: "All Orders" },
  { key: "pending",   label: "Pending" },
  { key: "shipped",   label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <Icon className="w-3 h-3" />{s.label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setUser(parsed);
    setLoading(false);

    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setOrdersLoading(false));
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("user"); router.push("/login"); };

  const filtered = orders.filter(o => {
    const matchSearch = !searchQuery ||
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "all" || o.order_status === activeTab;
    return matchSearch && matchTab;
  });

  const tabCount = (key: string) =>
    key === "all" ? orders.length : orders.filter(o => o.order_status === key).length;

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
        <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          {(sidebarOpen || mobile) && <span className="text-white font-black text-base tracking-tight">Aluthpola<span style={{ color: "#f97316" }}>.lk</span></span>}
        </Link>
        {!mobile && <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-500 hover:text-gray-300"><Menu className="w-4 h-4" /></button>}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Main</p>}
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin/orders";
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar mobile /></div>
          <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-1.5"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 transition-all" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"><Home className="w-4 h-4" /></Link>
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"><Bell className="w-4 h-4" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">{orders.length} total orders</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Filter className="w-4 h-4" />Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />Export
              </button>
            </div>
          </div>

          {/* Status pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {(["pending","confirmed","shipped","delivered","cancelled"] as const).map((key) => {
              const s = STATUS_CONFIG[key];
              const Icon = s.icon;
              const count = orders.filter(o => o.order_status === key).length;
              return (
                <button key={key} onClick={() => setActiveTab(activeTab === key ? "all" : key)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all hover:shadow-sm ${activeTab === key ? "shadow-sm" : "border-gray-100 bg-white"}`}
                  style={activeTab === key ? { background: s.bg, borderColor: s.color + "40" } : {}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 leading-none">{count}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100 overflow-x-auto">
              {STATUS_TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab.key ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                  {tab.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}>
                    {tabCount(tab.key)}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Order","Customer","Items","Amount","Payment","Status","Date",""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ordersLoading ? (
                    <tr><td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Loading orders...</p>
                      </div>
                    </td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-400">No orders found</p>
                        <p className="text-xs text-gray-300">
                          {searchQuery ? "Try adjusting your search" : activeTab !== "all" ? `No ${activeTab} orders` : "Orders will appear here once customers start buying"}
                        </p>
                      </div>
                    </td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4"><span className="text-sm font-bold text-gray-900">#{order.order_number}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>{order.user_name[0]}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-none">{order.user_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{order.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-sm text-gray-600">{order.items_count} item{order.items_count !== 1 ? "s" : ""}</span></td>
                      <td className="px-5 py-4"><span className="text-sm font-bold text-gray-900">LKR {Number(order.total).toLocaleString()}</span></td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          order.payment_status === "paid" ? "bg-emerald-50 text-emerald-600" :
                          order.payment_status === "refunded" ? "bg-purple-50 text-purple-600" :
                          "bg-yellow-50 text-yellow-600"}`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={order.order_status} /></td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">{new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {orders.length} orders</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
