"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Key, LogOut, Bell, Search, Plus, ChevronRight, ArrowUpRight,
  ArrowDownRight, AlertTriangle, CheckCircle2, Clock, XCircle,
  Zap, Star, BarChart3, Settings, Tag, MessageSquare, RefreshCcw,
  Truck, ShieldCheck, Menu, X, Home, FileText, Boxes,
  BadgeDollarSign, Megaphone, Percent, HeadphonesIcon,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface AdminUser { id: string; email: string; name: string; role: string; }

/* ─── Sidebar nav ────────────────────────────────────────── */
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

/* ─── Mock sparkline ─────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ label, value, sub, trend, trendUp, icon: Icon, color, bg, spark }: {
  label: string; value: string; sub: string; trend: string; trendUp: boolean;
  icon: React.ElementType; color: string; bg: string; spark: number[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend} vs last month
        </span>
        <Sparkline data={spark} color={trendUp ? "#22c55e" : "#ef4444"} />
      </div>
    </div>
  );
}

/* ─── Order status badge ─────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    completed:  { bg: "#f0fdf4", color: "#16a34a", label: "Completed" },
    pending:    { bg: "#fffbeb", color: "#d97706", label: "Pending" },
    cancelled:  { bg: "#fff1f2", color: "#e11d48", label: "Cancelled" },
    refunded:   { bg: "#f5f3ff", color: "#7c3aed", label: "Refunded" },
    shipped:    { bg: "#eff6ff", color: "#2563eb", label: "Shipped" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

/* ─── Mock data ──────────────────────────────────────────── */
const STATS = [
  { label: "Total Revenue",       value: "LKR 14.5M", sub: "Last 30 days",   trend: "+23%", trendUp: true,  icon: BadgeDollarSign, color: "#f97316", bg: "#fff7ed", spark: [40,55,35,70,60,80,65,90,75,95] },
  { label: "Orders",              value: "890",        sub: "Last 30 days",   trend: "+18%", trendUp: true,  icon: ShoppingCart,    color: "#0ea5e9", bg: "#f0f9ff", spark: [30,45,40,60,50,70,55,75,65,80] },
  { label: "Customers",           value: "1,234",      sub: "Registered users",trend: "+12%", trendUp: true, icon: Users,           color: "#8b5cf6", bg: "#f5f3ff", spark: [20,35,30,45,40,55,50,60,55,70] },
  { label: "Products",            value: "567",        sub: "Active listings", trend: "+5%",  trendUp: true,  icon: Package,         color: "#22c55e", bg: "#f0fdf4", spark: [60,65,62,68,70,67,72,75,73,78] },
  { label: "Pending Deliveries",  value: "43",         sub: "Awaiting dispatch",trend: "+3%", trendUp: false, icon: Truck,           color: "#f59e0b", bg: "#fffbeb", spark: [10,15,12,18,14,20,16,22,18,24] },
  { label: "Refund Requests",     value: "7",          sub: "Needs review",    trend: "-2%",  trendUp: true,  icon: RefreshCcw,      color: "#e11d48", bg: "#fff1f2", spark: [8,6,9,5,7,4,6,3,5,4] },
];

const ORDERS = [
  { id: "#ALK-8821", customer: "Kamal Perera",   product: "Samsung Galaxy S24",    status: "completed", payment: "Paid",   amount: "LKR 89,990" },
  { id: "#ALK-8820", customer: "Niluka Fernando", product: "Nike Air Max 270",      status: "pending",   payment: "Paid",   amount: "LKR 34,990" },
  { id: "#ALK-8819", customer: "Suresh Silva",    product: "MacBook Pro 16\"",       status: "shipped",   payment: "Paid",   amount: "LKR 1,24,990" },
  { id: "#ALK-8818", customer: "Priya Jayasinghe",product: "CeraVe Moisturizer",    status: "cancelled", payment: "Refund", amount: "LKR 4,990" },
  { id: "#ALK-8817", customer: "Rohan Dissanayake",product: "LEGO Millennium Falcon",status: "completed", payment: "Paid",   amount: "LKR 24,990" },
];

const ACTIVITY = [
  { icon: Users,        color: "#8b5cf6", bg: "#f5f3ff", text: "New customer registered",     sub: "dilshan@gmail.com",                  time: "2 min ago" },
  { icon: ShoppingCart, color: "#0ea5e9", bg: "#f0f9ff", text: "New order placed",            sub: "Order #ALK-8821 · LKR 89,990",       time: "18 min ago" },
  { icon: Package,      color: "#f97316", bg: "#fff7ed", text: "Product stock updated",       sub: "iPhone 15 Pro — 50 units added",     time: "1 hr ago" },
  { icon: ShieldCheck,  color: "#22c55e", bg: "#f0fdf4", text: "Seller account verified",     sub: "TechMart LK — approved",             time: "2 hr ago" },
  { icon: RefreshCcw,   color: "#e11d48", bg: "#fff1f2", text: "Refund request submitted",    sub: "Order #ALK-8801 — LKR 4,990",        time: "3 hr ago" },
  { icon: Star,         color: "#f59e0b", bg: "#fffbeb", text: "New product review",          sub: "5 stars — Samsung Galaxy S24",       time: "5 hr ago" },
];

const ALERTS = [
  { icon: AlertTriangle, color: "#f97316", bg: "#fff7ed", label: "Low Stock",        text: "8 products below 5 units",     action: "Review" },
  { icon: XCircle,       color: "#e11d48", bg: "#fff1f2", label: "Out of Stock",     text: "3 products need restocking",   action: "Fix" },
  { icon: Clock,         color: "#f59e0b", bg: "#fffbeb", label: "Pending Orders",   text: "12 orders awaiting dispatch",  action: "Process" },
  { icon: ShieldCheck,   color: "#8b5cf6", bg: "#f5f3ff", label: "Seller Requests",  text: "4 new seller applications",    action: "Review" },
];

const INSIGHTS = [
  { icon: TrendingUp,   color: "#22c55e", text: "Sales increased 23% this week",      sub: "Compared to same period last month" },
  { icon: Zap,          color: "#f97316", text: "Electronics category is trending",   sub: "Top seller: Samsung Galaxy S24" },
  { icon: Clock,        color: "#0ea5e9", text: "Peak traffic detected at 8PM",       sub: "Highest conversion rate of the day" },
];

const QUICK_ACTIONS = [
  { icon: Package,      label: "Add Product",      href: "/admin/products",  color: "#f97316", bg: "#fff7ed" },
  { icon: ShoppingCart, label: "View Orders",      href: "/admin/orders",    color: "#0ea5e9", bg: "#f0f9ff" },
  { icon: Users,        label: "Manage Users",     href: "/admin/users",     color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: BarChart3,    label: "View Reports",     href: "/admin/reports",   color: "#22c55e", bg: "#f0fdf4" },
  { icon: Key,          label: "API Keys",         href: "/admin/api-keys",  color: "#f59e0b", bg: "#fffbeb" },
  { icon: Tag,          label: "Create Coupon",    href: "#",                color: "#e11d48", bg: "#fff1f2" },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setUser(parsed);
    setLoading(false);
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
      {/* Logo */}
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
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

      {/* User section */}
      <div className="border-t border-gray-800 p-3">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors`}>
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
            <button onClick={handleLogout} title="Logout"
              className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar mobile />
          </div>
          <button className="absolute top-4 left-[260px] text-white" onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-500" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="search" placeholder="Search orders, users, products…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600">Live</span>
            </div>

            {/* Quick add */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
              onClick={() => router.push("/admin/products")}>
              <Plus className="w-4 h-4" /> Add Product
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Messages */}
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-500" />
            </button>

            {/* View site */}
            <Link href="/"
              className="hidden sm:flex items-center gap-1.5 w-9 h-9 justify-center rounded-xl hover:bg-gray-100 transition-colors" title="View site">
              <Home className="w-5 h-5 text-gray-500" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-6 py-6 space-y-6 overflow-x-hidden">

          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{today} · Here's what's happening with your marketplace today.</p>
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
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Middle row */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(({ icon: Icon, label, href, color, bg }) => (
                  <Link key={label} href={href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group text-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Performance Insights</h2>
              <div className="space-y-3">
                {INSIGHTS.map(({ icon: Icon, color, text, sub }) => (
                  <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Inventory Alerts</h2>
              <div className="space-y-3">
                {ALERTS.map(({ icon: Icon, color, bg, label, text, action }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition-all"
                    style={{ borderColor: `${color}30`, background: bg }}>
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color }}>{label}</p>
                      <p className="text-xs text-gray-500 truncate">{text}</p>
                    </div>
                    <button className="text-xs font-semibold px-2 py-1 rounded-lg transition-colors hover:opacity-80"
                      style={{ color, background: `${color}15` }}>{action}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Orders table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Recent Orders</h2>
              <Link href="/admin/orders"
                className="flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all" style={{ color: "#f97316" }}>
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Order ID","Customer","Product","Status","Payment","Amount",""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ORDERS.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-500">{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                            {o.customer[0]}
                          </div>
                          <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{o.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">{o.product}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${o.payment === "Paid" ? "text-emerald-600" : "text-purple-600"}`}>
                          {o.payment === "Paid" ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3" />}
                          {o.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 text-xs whitespace-nowrap">{o.amount}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom row: Activity + Revenue chart placeholder */}
          <div className="grid lg:grid-cols-2 gap-5">

            {/* Activity feed */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Recent Activity</h2>
              <div className="space-y-1">
                {ACTIVITY.map(({ icon: Icon, color, bg, text, sub, time }) => (
                  <div key={text} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{text}</p>
                      <p className="text-xs text-gray-400 truncate">{sub}</p>
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium whitespace-nowrap">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue chart placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Revenue Overview</h2>
                <span className="text-xs text-gray-400">Last 7 days</span>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-2 h-36 mt-2">
                {[45,72,58,89,67,94,78].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${(v / 94) * 100}%`,
                        background: i === 5 ? "linear-gradient(180deg,#f97316,#fb923c)" : "#f3f4f6",
                        minHeight: 8,
                      }} />
                    <span className="text-[9px] text-gray-400">
                      {["M","T","W","T","F","S","S"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total this week</p>
                  <p className="text-lg font-black text-gray-900">LKR 2.4M</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> +23%
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 text-xs text-gray-300">
            &copy; 2026 Aluthpola.lk Admin Dashboard
          </div>
        </main>
      </div>
    </div>
  );
}
