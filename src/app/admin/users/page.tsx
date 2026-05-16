"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Key,
  LogOut, Bell, Search, ChevronRight, Menu, X, Home, Boxes,
  Megaphone, Percent, Star, HeadphonesIcon, Settings,
  UserPlus, Edit, Trash2, Shield, CheckCircle2, XCircle,
  MoreHorizontal, Filter, Download, Eye, EyeOff, Phone, Mail,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface AdminUser { id: string; email: string; name: string; role: string; }
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

/* ─── Sidebar nav ─────────────────────────────────────────── */
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

const ROLE_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  super_admin: { bg: "#f5f3ff", color: "#7c3aed", label: "Super Admin" },
  staff:       { bg: "#fff7ed", color: "#ea580c", label: "Staff" },
  user:        { bg: "#eff6ff", color: "#2563eb", label: "User" },
};

const PERMISSIONS = [
  { key: "canViewProducts",    label: "View Products",    icon: Package },
  { key: "canManageOrders",    label: "Manage Orders",    icon: ShoppingCart },
  { key: "canManageInventory", label: "Manage Inventory", icon: Boxes },
  { key: "canViewReports",     label: "View Reports",     icon: BarChart3 },
  { key: "canManageUsers",     label: "Manage Users",     icon: Users },
];

const AVATAR_COLORS = [
  "linear-gradient(135deg,#f97316,#fb923c)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  "linear-gradient(135deg,#22c55e,#4ade80)",
  "linear-gradient(135deg,#e11d48,#fb7185)",
];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ManageUsersPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", role: "user",
    permissions: {
      canViewProducts: true, canManageOrders: false,
      canManageInventory: false, canViewReports: false, canManageUsers: false,
    },
  });

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setAdminUser(parsed);
    loadUsers();
  }, [router]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("User created successfully!", "success");
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "", phone: "", role: "user",
          permissions: { canViewProducts: true, canManageOrders: false, canManageInventory: false, canViewReports: false, canManageUsers: false } });
        loadUsers();
      } else {
        showToast(data.error || "Failed to create user", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally { setIsSubmitting(false); }
  };

  const filtered = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleLogout = () => { localStorage.removeItem("user"); router.push("/login"); };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          <p className="text-sm text-gray-400">Loading users...</p>
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Main</p>}
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin/users";
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
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
            {adminUser?.name?.[0]?.toUpperCase()}
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{adminUser?.name}</p>
              <p className="text-gray-500 text-xs truncate">{adminUser?.email}</p>
            </div>
          )}
          {(sidebarOpen || mobile) && (
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar mobile /></div>
          <button onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Customers</h1>
              <p className="text-sm text-gray-400 mt-0.5">{users.length} registered users</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* Role filter tabs */}
          <div className="flex items-center gap-1 mb-5">
            {[
              { key: "all",        label: "All Users",    count: users.length },
              { key: "user",       label: "Customers",    count: users.filter(u => u.role === "user").length },
              { key: "staff",      label: "Staff",        count: users.filter(u => u.role === "staff").length },
              { key: "super_admin",label: "Admins",       count: users.filter(u => u.role === "super_admin").length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setRoleFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all border ${roleFilter === tab.key ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${roleFilter === tab.key ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">User</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Role</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Joined</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-400">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(user => {
                    const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.user;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ background: getAvatarColor(user.name) }}>
                              {user.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                              {user.phone && <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: role.bg, color: role.color }}>
                            {user.role === "super_admin" && <Shield className="w-3 h-3" />}
                            {role.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${user.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                            {user.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 transition-colors">Previous</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 text-white">1</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "88vh", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900">Add New User</h2>
                  <p className="text-xs text-gray-400">Create a new account</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddUser} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input type="text" required value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Perera"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="tel" value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+94 77 000 0000"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="email" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "user",        label: "Customer",    icon: Users,  desc: "Can shop and view orders" },
                    { value: "staff",       label: "Staff",       icon: Shield, desc: "Limited admin access" },
                    { value: "super_admin", label: "Super Admin", icon: Shield, desc: "Full access to everything" },
                  ].map(r => (
                    <button key={r.value} type="button"
                      onClick={() => setFormData({ ...formData, role: r.value })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${formData.role === r.value ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                      <r.icon className={`w-4 h-4 ${formData.role === r.value ? "text-orange-500" : "text-gray-400"}`} />
                      <span className={`text-xs font-bold ${formData.role === r.value ? "text-orange-600" : "text-gray-600"}`}>{r.label}</span>
                      <span className="text-[10px] text-gray-400 leading-tight">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              {(formData.role === "user" || formData.role === "staff") && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Permissions</label>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                    {PERMISSIONS.map(({ key, label, icon: Icon }, i) => {
                      const checked = formData.permissions[key as keyof typeof formData.permissions];
                      return (
                        <label key={key}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${checked ? "bg-orange-100" : "bg-gray-200"}`}>
                              <Icon className={`w-3.5 h-3.5 ${checked ? "text-orange-500" : "text-gray-400"}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                          </div>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={checked}
                              onChange={e => setFormData({ ...formData, permissions: { ...formData.permissions, [key]: e.target.checked } })} />
                            <div className={`w-9 h-5 rounded-full transition-colors ${checked ? "bg-orange-500" : "bg-gray-300"}`}
                              style={{ padding: "2px" }}
                              onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, [key]: !checked } })}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setShowAddModal(false)} disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
