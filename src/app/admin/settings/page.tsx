"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Key,
  LogOut, Bell, Menu, Home, Boxes, Megaphone, Percent, Star,
  HeadphonesIcon, Settings, ChevronRight, X,
  Store, Globe, CreditCard, Truck, Mail, Search as SearchIcon,
  Shield, Palette, Save, Eye, EyeOff, AlertTriangle, CheckCircle2,
  ToggleLeft, ToggleRight, Info,
} from "lucide-react";

interface AdminUser { id: string; email: string; name: string; role: string; }

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

const SECTIONS = [
  { id: "store",         label: "Store & Branding",    icon: Store },
  { id: "general",      label: "General",              icon: Globe },
  { id: "payments",     label: "Payments",             icon: CreditCard },
  { id: "shipping",     label: "Shipping",             icon: Truck },
  { id: "notifications",label: "Notifications",        icon: Mail },
  { id: "seo",          label: "SEO & Analytics",      icon: SearchIcon },
  { id: "security",     label: "Security & Account",   icon: Shield },
  { id: "appearance",   label: "Appearance",           icon: Palette },
];

const CURRENCIES = ["LKR", "USD", "EUR", "GBP", "AUD", "SGD", "INR"];
const TIMEZONES  = ["Asia/Colombo", "UTC", "Asia/Kolkata", "Asia/Singapore", "Europe/London", "America/New_York"];
const DATE_FMTS  = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

type Settings = Record<string, string>;

export default function AdminSettingsPage() {
  const router = useRouter();
  const [adminUser, setAdminUser]       = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState("store");
  const [settings, setSettings]         = useState<Settings>({});
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Password change state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setAdminUser(parsed);
  }, [router]);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || {});
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const set = (key: string, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const toggle = (key: string) =>
    setSettings(prev => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok) showToast("Settings saved successfully!", "success");
      else showToast(data.error || "Failed to save settings", "error");
    } catch { showToast("An error occurred", "error"); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      showToast("New passwords do not match", "error"); return;
    }
    if (pwForm.next.length < 8) {
      showToast("Password must be at least 8 characters", "error"); return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          admin_id: adminUser?.id,
          current_password: pwForm.current,
          new_password: pwForm.next,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully!", "success");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        showToast(data.error || "Failed to update password", "error");
      }
    } catch { showToast("An error occurred", "error"); }
    finally { setPwSaving(false); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); router.push("/login"); };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          <p className="text-sm text-gray-400">Loading settings…</p>
        </div>
      </div>
    );
  }

  /* ─── Sidebar ─────────────────────────────────────────── */
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "w-64" : sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-gray-900 flex flex-col transition-all duration-300 ${mobile ? "" : "hidden lg:flex"}`}
      style={{ minHeight: "100vh" }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center min-w-0 flex-1">
          <Image src="/Aluthpola Logo.png" alt="Aluthpola.lk" width={120} height={48}
            className={`object-contain ${sidebarOpen || mobile ? "h-9 w-auto" : "h-8 w-8 object-left"}`} />
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
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Icon className="w-4 h-4 flex-shrink-0" />
            {(sidebarOpen || mobile) && <span>{label}</span>}
          </Link>
        ))}
        {(sidebarOpen || mobile) && <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-4 mb-1">Tools</p>}
        {NAV2.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin/settings";
          const comingSoon = label !== "Settings";
          return (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {(sidebarOpen || mobile) && <span>{label}</span>}
              {(sidebarOpen || mobile) && active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              {(sidebarOpen || mobile) && comingSoon && (
                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gray-700 text-gray-400">Coming Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
            {adminUser?.name?.[0]?.toUpperCase()}
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{adminUser?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{adminUser?.email}</p>
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

  /* ─── Section content ─────────────────────────────────── */
  const renderSection = () => {
    switch (activeSection) {
      case "store": return (
        <div className="space-y-5">
          <SectionHeader title="Store & Branding" desc="Basic store information visible to customers." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name" required>
              <input value={settings.store_name || ""} onChange={e => set("store_name", e.target.value)}
                className={inputCls} placeholder="Aluthpola.lk" />
            </Field>
            <Field label="Tagline">
              <input value={settings.store_tagline || ""} onChange={e => set("store_tagline", e.target.value)}
                className={inputCls} placeholder="Your trusted online store" />
            </Field>
            <Field label="Contact Email" required>
              <input type="email" value={settings.contact_email || ""} onChange={e => set("contact_email", e.target.value)}
                className={inputCls} placeholder="hello@aluthpola.lk" />
            </Field>
            <Field label="Contact Phone">
              <input value={settings.contact_phone || ""} onChange={e => set("contact_phone", e.target.value)}
                className={inputCls} placeholder="+94 XX XXX XXXX" />
            </Field>
          </div>
          <Field label="Store Address">
            <textarea value={settings.store_address || ""} onChange={e => set("store_address", e.target.value)}
              rows={3} className={inputCls} placeholder="No. 1, Main Street, Colombo 01, Sri Lanka" />
          </Field>
        </div>
      );

      case "general": return (
        <div className="space-y-5">
          <SectionHeader title="General" desc="Currency, locale, and store behaviour." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Currency">
              <select value={settings.currency || "LKR"} onChange={e => set("currency", e.target.value)} className={inputCls}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Timezone">
              <select value={settings.timezone || "Asia/Colombo"} onChange={e => set("timezone", e.target.value)} className={inputCls}>
                {TIMEZONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Date Format">
              <select value={settings.date_format || "DD/MM/YYYY"} onChange={e => set("date_format", e.target.value)} className={inputCls}>
                {DATE_FMTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>
          <ToggleRow
            label="Maintenance Mode"
            desc="When enabled, the storefront shows a maintenance page to visitors."
            value={settings.maintenance_mode === "true"}
            onChange={() => toggle("maintenance_mode")}
            danger
          />
        </div>
      );

      case "payments": return (
        <div className="space-y-5">
          <SectionHeader title="Payments" desc="Configure payment options for your store." />
          <ToggleRow
            label="Cash on Delivery (COD)"
            desc="Allow customers to pay when their order is delivered."
            value={settings.cod_enabled === "true"}
            onChange={() => toggle("cod_enabled")}
          />
          <InfoBanner text="Online payment gateways (Stripe, PayPal) will be configurable once the Payments module is live." />
        </div>
      );

      case "shipping": return (
        <div className="space-y-5">
          <SectionHeader title="Shipping" desc="Set default shipping costs and free-shipping thresholds." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`Default Shipping Cost (${settings.currency || "LKR"})`}>
              <input type="number" min="0" value={settings.default_shipping_cost || "300"}
                onChange={e => set("default_shipping_cost", e.target.value)} className={inputCls} />
            </Field>
            <Field label={`Free Shipping Threshold (${settings.currency || "LKR"})`}>
              <input type="number" min="0" value={settings.free_shipping_threshold || "5000"}
                onChange={e => set("free_shipping_threshold", e.target.value)} className={inputCls} />
            </Field>
          </div>
          <InfoBanner text="Shipping zones and per-region rates will be available in the Shipping module." />
        </div>
      );

      case "notifications": return (
        <div className="space-y-5">
          <SectionHeader title="Notifications" desc="Choose which events trigger email alerts." />
          <Field label="Notification Recipient Email">
            <input type="email" value={settings.notification_email || ""}
              onChange={e => set("notification_email", e.target.value)}
              className={inputCls} placeholder="admin@aluthpola.lk" />
          </Field>
          <div className="space-y-3 pt-1">
            <ToggleRow label="New Order Alert" desc="Receive an email whenever a new order is placed."
              value={settings.new_order_alert === "true"} onChange={() => toggle("new_order_alert")} />
            <ToggleRow label="Low Stock Alert" desc="Get notified when a product's stock falls below 5."
              value={settings.low_stock_alert === "true"} onChange={() => toggle("low_stock_alert")} />
            <ToggleRow label="New User Registration" desc="Receive an email when a new customer registers."
              value={settings.new_user_alert === "true"} onChange={() => toggle("new_user_alert")} />
          </div>
        </div>
      );

      case "seo": return (
        <div className="space-y-5">
          <SectionHeader title="SEO & Analytics" desc="Default meta tags and analytics tracking IDs." />
          <Field label="Default Meta Title">
            <input value={settings.meta_title || ""} onChange={e => set("meta_title", e.target.value)}
              className={inputCls} placeholder="Aluthpola.lk" maxLength={60} />
            <p className="text-xs text-gray-400 mt-1">{(settings.meta_title || "").length}/60 characters</p>
          </Field>
          <Field label="Default Meta Description">
            <textarea value={settings.meta_description || ""} onChange={e => set("meta_description", e.target.value)}
              rows={3} className={inputCls} placeholder="Your trusted online store in Sri Lanka" maxLength={160} />
            <p className="text-xs text-gray-400 mt-1">{(settings.meta_description || "").length}/160 characters</p>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Google Analytics ID">
              <input value={settings.google_analytics_id || ""} onChange={e => set("google_analytics_id", e.target.value)}
                className={inputCls} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Google Tag Manager ID">
              <input value={settings.gtm_id || ""} onChange={e => set("gtm_id", e.target.value)}
                className={inputCls} placeholder="GTM-XXXXXXX" />
            </Field>
          </div>
        </div>
      );

      case "security": return (
        <div className="space-y-6">
          <SectionHeader title="Security & Account" desc="Manage your admin account credentials." />
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Field label="Current Password">
                <div className="relative">
                  <input type={showPw.current ? "text" : "password"}
                    value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                    className={inputCls + " pr-10"} placeholder="Enter current password" required />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="New Password">
                  <div className="relative">
                    <input type={showPw.next ? "text" : "password"}
                      value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                      className={inputCls + " pr-10"} placeholder="At least 8 characters" required minLength={8} />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw.next ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm New Password">
                  <div className="relative">
                    <input type={showPw.confirm ? "text" : "password"}
                      value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                      className={inputCls + " pr-10"} placeholder="Repeat new password" required />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>
              {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={pwSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                  <Shield className="w-4 h-4" />
                  {pwSaving ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      );

      case "appearance": return (
        <div className="space-y-5">
          <SectionHeader title="Appearance" desc="Customize the look of your admin panel." />
          <Field label="Accent Colour">
            <div className="flex items-center gap-3">
              <input type="color" value={settings.accent_color || "#f97316"}
                onChange={e => set("accent_color", e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <input value={settings.accent_color || "#f97316"}
                onChange={e => set("accent_color", e.target.value)}
                className={inputCls + " w-36"} placeholder="#f97316" />
              <div className="flex gap-2">
                {["#f97316","#0ea5e9","#8b5cf6","#22c55e","#e11d48"].map(c => (
                  <button key={c} onClick={() => set("accent_color", c)}
                    className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                    style={{ background: c, borderColor: settings.accent_color === c ? "#1f2937" : "transparent" }} />
                ))}
              </div>
            </div>
          </Field>
          <InfoBanner text="Dark mode for the admin panel is coming in a future update." />
        </div>
      );

      default: return null;
    }
  };

  /* ─── Render ──────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
          <button onClick={() => setMobileSidebar(false)} className="absolute top-4 right-4 text-white z-20">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setMobileSidebar(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-900">Settings</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 w-9 h-9 justify-center rounded-xl hover:bg-gray-100 transition-colors" title="View site">
              <Home className="w-5 h-5 text-gray-500" />
            </Link>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-6 py-6">
          {/* Page title + save */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Settings</h1>
              <p className="text-gray-400 text-sm mt-0.5">Manage your store configuration</p>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Section nav */}
            <aside className="lg:w-52 flex-shrink-0">
              <nav className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-gray-100 last:border-0 text-left
                      ${activeSection === id ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                    {activeSection === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Section panel */}
            <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl p-5 lg:p-6">
              {renderSection()}

              {/* Save button at bottom of each section (except security which has its own) */}
              {activeSection !== "security" && (
                <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all"
                    style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all
          ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4" />
            : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────── */
const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all";

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange, danger }: {
  label: string; desc: string; value: boolean; onChange: () => void; danger?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all
      ${danger && value ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger && value ? "text-red-700" : "text-gray-800"}`}>{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button onClick={onChange} className="flex-shrink-0 mt-0.5">
        {value
          ? <ToggleRight className={`w-7 h-7 ${danger ? "text-red-500" : "text-orange-500"}`} />
          : <ToggleLeft className="w-7 h-7 text-gray-300" />}
      </button>
    </div>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-600">{text}</p>
    </div>
  );
}
