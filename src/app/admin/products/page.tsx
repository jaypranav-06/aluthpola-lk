"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Key,
  LogOut, Bell, Search, ChevronRight, Menu, X, Home, Boxes,
  Megaphone, Percent, Star, HeadphonesIcon, Settings,
  Plus, Edit, Trash2, Image as ImageIcon, Filter, Download,
  AlertTriangle, CheckCircle2, MoreHorizontal, Grid3x3, List,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface AdminUser { id: string; email: string; name: string; role: string; }
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at: string;
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

const CATEGORIES = ["All", "Smartphones", "Laptops", "Audio", "Tablets", "Accessories", "Wearables", "Gaming", "Cameras"];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)  return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Out of stock</span>;
  if (stock <= 10)  return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">{stock} left</span>;
  return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{stock} in stock</span>;
}

/* ─── Page ────────────────────────────────────────────────── */
export default function ManageProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "", category: "", image_url: "", discount_price: "",
  });
  const [hasDiscount, setHasDiscount] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", price: "", stock: "", category: "", image_url: "", discount_price: "" });
  const [editHasDiscount, setEditHasDiscount] = useState(false);
  const [editUploadMethod, setEditUploadMethod] = useState<"url" | "file">("url");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const parsed = JSON.parse(raw);
    if (parsed.role !== UserRole.SUPER_ADMIN) { router.push("/"); return; }
    setUser(parsed);
    loadProducts();
  }, [router]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File size must be less than 5MB", "error"); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = formData.image_url;
      if (uploadMethod === "file" && selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) { showToast(upData.error || "Failed to upload image", "error"); return; }
        imageUrl = upData.url;
      }
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, description: formData.description,
          price: parseFloat(formData.price),
          original_price: hasDiscount && formData.discount_price ? parseFloat(formData.discount_price) : null,
          stock: parseInt(formData.stock),
          category: formData.category, image_url: imageUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to add product", "error"); return; }
      showToast("Product added successfully!", "success");
      setShowAddModal(false);
      setFormData({ name: "", description: "", price: "", stock: "", category: "", image_url: "", discount_price: "" });
      setSelectedFile(null); setImagePreview(""); setUploadMethod("url"); setHasDiscount(false); setModalStep(1);
      loadProducts();
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (product: Product) => {
    setShowAddModal(false);
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image_url: product.image_url || "",
      discount_price: product.original_price ? product.original_price.toString() : "",
    });
    setEditHasDiscount(!!product.original_price);
    setEditUploadMethod("url");
    setEditSelectedFile(null);
    setEditImagePreview("");
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== product.id));
        showToast("Product deleted", "success");
      } else {
        showToast(data.error || "Failed to delete", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File size must be less than 5MB", "error"); return; }
    setEditSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setIsEditSubmitting(true);
    try {
      let imageUrl = editFormData.image_url;
      if (editUploadMethod === "file" && editSelectedFile) {
        const fd = new FormData();
        fd.append("file", editSelectedFile);
        const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) { showToast(upData.error || "Failed to upload image", "error"); return; }
        imageUrl = upData.url;
      }
      const res = await fetch(`/api/admin/products/${editProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          stock: parseInt(editFormData.stock),
          category: editFormData.category,
          image_url: imageUrl || null,
          original_price: editHasDiscount && editFormData.discount_price ? parseFloat(editFormData.discount_price) : null,
        }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === editProduct.id ? {
          ...p,
          name: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          original_price: editHasDiscount && editFormData.discount_price ? parseFloat(editFormData.discount_price) : undefined,
          stock: parseInt(editFormData.stock),
          category: editFormData.category,
          image_url: imageUrl || p.image_url,
        } : p));
        showToast("Product updated!", "success");
        setEditProduct(null);
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to update", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>A</div>
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "w-64" : sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 bg-gray-900 flex flex-col transition-all duration-300 ${mobile ? "" : "hidden lg:flex"}`}
      style={{ minHeight: "100vh" }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center min-w-0 flex-1">
          <Image src="/Aluthpola Logo.png" alt="Aluthpola.lk" width={120} height={48}
            className={`object-contain ${sidebarOpen || mobile ? "h-9 w-auto" : "h-8 w-8 object-left"}`}
            />
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
          const active = href === "/admin/products";
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
            {user?.name?.[0]?.toUpperCase()}
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          )}
          {(sidebarOpen || mobile) && (
            <button onClick={() => { localStorage.removeItem("user"); router.push("/login"); }}
              className="text-gray-500 hover:text-red-400 transition-colors" title="Logout">
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

      {/* Mobile sidebar overlay */}
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
        <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Products</h1>
              <p className="text-sm text-gray-400 mt-0.5">{products.length} total products in your store</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}>
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Alert pills */}
          {(lowStock > 0 || outOfStock > 0) && (
            <div className="flex flex-wrap gap-3 mb-5">
              {outOfStock > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-red-600">{outOfStock} out of stock</span>
                </div>
              )}
              {lowStock > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-600">{lowStock} low stock</span>
                </div>
              )}
            </div>
          )}

          {/* Category tabs */}
          <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"}`}>
                {cat}
                {cat !== "All" && (
                  <span className={`ml-1.5 text-[11px] ${activeCategory === cat ? "opacity-70" : "text-gray-400"}`}>
                    {products.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center gap-3"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">No products found</p>
                  <button onClick={() => setShowAddModal(true)}
                    className="mt-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                    + Add your first product
                  </button>
                </div>
              ) : (
                filtered.map(product => (
                  <div key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                          <ImageIcon className="w-10 h-10" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); openEdit(product); }} className="p-2 rounded-xl bg-white shadow-md text-gray-700 hover:text-orange-500 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteProduct(product); }} className="p-2 rounded-xl bg-white shadow-md text-gray-700 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{product.name}</h3>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                          {product.category}
                        </span>
                        <StockBadge stock={product.stock} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-gray-900">
                              LKR {(product.original_price ?? product.price).toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-xs text-gray-400 line-through">LKR {product.price.toLocaleString()}</span>
                            )}
                          </div>
                          {product.original_price && product.original_price < product.price && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                              {Math.round((1 - product.original_price / product.price) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-300">
                          {new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Product</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Price</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Stock</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">Added</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-300" />
                          </div>
                          <p className="text-sm font-semibold text-gray-400">No products found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {product.image_url
                                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                : <ImageIcon className="w-4 h-4 text-gray-300" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-none">{product.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{product.category}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900">
                              LKR {(product.original_price ?? product.price).toLocaleString()}
                            </span>
                            {product.original_price && product.original_price < product.price && (
                              <>
                                <span className="text-xs text-gray-400 line-through">LKR {product.price.toLocaleString()}</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                  {Math.round((1 - product.original_price / product.price) * 100)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <StockBadge stock={product.stock} />
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-gray-400">
                            {new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); openEdit(product); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteProduct(product); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">Showing {filtered.length} of {products.length} products</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex"
            style={{ maxHeight: "88vh", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>

            {/* Left preview panel */}
            <div className="w-52 flex-shrink-0 flex flex-col bg-gray-900 p-5 hidden sm:flex">
              {/* Image preview */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center mb-4 flex-shrink-0">
                {imagePreview || formData.image_url ? (
                  <img src={imagePreview || formData.image_url} alt="Preview"
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-[11px]">No image yet</span>
                  </div>
                )}
              </div>

              {/* Live preview card */}
              <div className="flex-1 min-h-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Live Preview</p>
                {formData.name ? (
                  <div>
                    {formData.category && (
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{formData.category}</span>
                    )}
                    <p className="text-white font-bold text-sm mt-1 leading-snug line-clamp-3">{formData.name}</p>
                    {formData.price && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400 font-black text-base">
                            LKR {hasDiscount && formData.discount_price ? parseFloat(formData.discount_price).toLocaleString() : parseFloat(formData.price).toLocaleString()}
                          </span>
                          {hasDiscount && formData.discount_price && (
                            <span className="text-gray-500 text-xs line-through">
                              LKR {parseFloat(formData.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {hasDiscount && formData.discount_price && parseFloat(formData.discount_price) < parseFloat(formData.price) && (
                          <p className="text-emerald-400 text-[11px] font-semibold mt-0.5">
                            Save {Math.round((1 - parseFloat(formData.discount_price) / parseFloat(formData.price)) * 100)}%
                          </p>
                        )}
                      </div>
                    )}
                    {formData.stock && (
                      <span className={`mt-2 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${parseInt(formData.stock) > 10 ? "bg-emerald-900 text-emerald-400" : parseInt(formData.stock) > 0 ? "bg-yellow-900 text-yellow-400" : "bg-red-900 text-red-400"}`}>
                        {parseInt(formData.stock) > 0 ? `${formData.stock} in stock` : "Out of stock"}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-xs leading-relaxed">Start filling in the form to see a preview here.</p>
                )}
              </div>

              {/* Step indicator */}
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-2">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all ${modalStep >= s ? "bg-orange-500" : "bg-gray-700"}`} />
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Step {modalStep} of 2</p>
              </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    {modalStep === 1 ? "Product Details" : "Image & Pricing"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {modalStep === 1 ? "Basic information about the product" : "Upload an image and set pricing"}
                  </p>
                </div>
                <button onClick={() => { setShowAddModal(false); setModalStep(1); }}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto px-6 py-5">

                {/* Step 1 */}
                {modalStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                      <input type="text" required value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Samsung Galaxy S24"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                      <textarea required value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the product features, specs, and benefits..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all resize-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.filter(c => c !== "All").map(c => (
                          <button key={c} type="button"
                            onClick={() => setFormData({ ...formData, category: c })}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${formData.category === c ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {modalStep === 2 && (
                  <div className="space-y-4">
                    {/* Price + Stock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (LKR) *</label>
                        <input type="number" step="0.01" required value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock Qty *</label>
                        <input type="number" required value={formData.stock}
                          onChange={e => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                      </div>
                    </div>

                    {/* Discount toggle */}
                    <div className={`rounded-xl border p-3.5 transition-all ${hasDiscount ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-700">Discounted Price</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Sale price customer pays — must be lower than the price above</p>
                        </div>
                        <button type="button"
                          onClick={() => { setHasDiscount(!hasDiscount); if (hasDiscount) setFormData({ ...formData, discount_price: "" }); }}
                          className={`relative inline-flex items-center rounded-full transition-colors duration-200 flex-shrink-0 ${hasDiscount ? "bg-orange-500" : "bg-gray-300"}`}
                          style={{ height: "22px", width: "40px", padding: "3px" }}>
                          <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${hasDiscount ? "translate-x-[18px]" : "translate-x-0"}`} />
                        </button>
                      </div>
                      {hasDiscount && (
                        <div className="mt-3">
                          <input type="number" step="0.01" value={formData.discount_price}
                            onChange={e => setFormData({ ...formData, discount_price: e.target.value })}
                            placeholder="Discounted sale price (LKR)"
                            className="w-full px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                          {formData.price && formData.discount_price && parseFloat(formData.discount_price) < parseFloat(formData.price) && (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
                              {Math.round((1 - parseFloat(formData.discount_price) / parseFloat(formData.price)) * 100)}% off — customers save LKR {(parseFloat(formData.price) - parseFloat(formData.discount_price)).toLocaleString()}
                            </p>
                          )}
                          {formData.price && formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price) && (
                            <p className="text-[11px] text-red-500 font-semibold mt-2">Discounted price must be lower than the original price</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>
                      <div className="flex gap-2 mb-3">
                        {(["url", "file"] as const).map(method => (
                          <button key={method} type="button"
                            onClick={() => { setUploadMethod(method); if (method === "url") { setSelectedFile(null); setImagePreview(""); } else { setFormData({ ...formData, image_url: "" }); } }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${uploadMethod === method ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {method === "url" ? "Paste URL" : "Upload File"}
                          </button>
                        ))}
                      </div>
                      {uploadMethod === "url" ? (
                        <input type="text" value={formData.image_url}
                          onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://example.com/product-image.jpg"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                      ) : (
                        <div>
                          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all">
                            <ImageIcon className="w-7 h-7 text-gray-300 mb-1.5" />
                            <p className="text-sm text-gray-400"><span className="font-semibold text-orange-500">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 5MB</p>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                          </label>
                          {imagePreview && (
                            <div className="mt-3 relative">
                              <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                              <button type="button" onClick={() => { setSelectedFile(null); setImagePreview(""); }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/70 text-white hover:bg-red-500 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                              <p className="mt-1.5 text-xs text-gray-400">{selectedFile?.name} · {((selectedFile?.size ?? 0) / 1024).toFixed(1)} KB</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  {modalStep === 1 ? (
                    <>
                      <button type="button" onClick={() => { setShowAddModal(false); setModalStep(1); }}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                        Cancel
                      </button>
                      <button type="button"
                        disabled={!formData.name || !formData.description || !formData.category}
                        onClick={() => setModalStep(2)}
                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                        Continue →
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => setModalStep(1)}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                        ← Back
                      </button>
                      <button type="submit" disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                        {isSubmitting ? "Adding product..." : "Add Product"}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden flex"
            style={{ maxWidth: 860, maxHeight: "90vh", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>

            {/* ── Left dark preview panel ── */}
            <div className="hidden md:flex flex-col w-64 flex-shrink-0 bg-gray-900 p-5 gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Preview</p>

              {/* Product image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center">
                {(editUploadMethod === "file" ? editImagePreview : editFormData.image_url) ? (
                  <img src={editUploadMethod === "file" ? editImagePreview : editFormData.image_url} alt="preview"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1 min-h-0">
                {editFormData.category && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
                    style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}>
                    {editFormData.category}
                  </span>
                )}
                <h3 className="text-white font-black text-sm leading-tight mb-2 line-clamp-2">
                  {editFormData.name || <span className="text-gray-600 italic font-normal">Product name…</span>}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                  {editFormData.description || <span className="italic">Description will appear here…</span>}
                </p>
              </div>

              {/* Price + stock */}
              <div className="border-t border-gray-800 pt-3 space-y-2">
                {editHasDiscount && editFormData.discount_price && editFormData.price && parseFloat(editFormData.discount_price) < parseFloat(editFormData.price) ? (
                  <div>
                    <p className="text-gray-500 text-xs line-through">
                      LKR {parseFloat(editFormData.price).toLocaleString()}
                    </p>
                    <p className="text-white font-black text-lg">
                      LKR {parseFloat(editFormData.discount_price).toLocaleString()}
                    </p>
                    <p className="text-emerald-400 text-xs font-semibold">
                      Save {Math.round((1 - parseFloat(editFormData.discount_price) / parseFloat(editFormData.price)) * 100)}%
                    </p>
                  </div>
                ) : (
                  <p className="text-white font-black text-lg">
                    {editFormData.price ? `LKR ${parseFloat(editFormData.price).toLocaleString()}` : <span className="text-gray-600 text-sm font-normal italic">Price…</span>}
                  </p>
                )}
                {editFormData.stock && (
                  <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${parseInt(editFormData.stock) === 0 ? "bg-red-900/40 text-red-400" : parseInt(editFormData.stock) <= 10 ? "bg-yellow-900/40 text-yellow-400" : "bg-emerald-900/40 text-emerald-400"}`}>
                    {parseInt(editFormData.stock) === 0 ? "Out of stock" : parseInt(editFormData.stock) <= 10 ? `${editFormData.stock} left` : `${editFormData.stock} in stock`}
                  </span>
                )}
              </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-col flex-1 min-w-0">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Edit className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">Edit Product</h2>
                    <p className="text-xs text-gray-400 truncate max-w-[220px]">{editProduct.name}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setEditProduct(null)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable form body */}
              <form onSubmit={handleEditProduct} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input type="text" required value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                  <textarea required value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.filter(c => c !== "All").map(c => (
                      <button key={c} type="button"
                        onClick={() => setEditFormData({ ...editFormData, category: c })}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${editFormData.category === c ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (LKR) *</label>
                    <input type="number" step="0.01" required value={editFormData.price}
                      onChange={e => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock Qty *</label>
                    <input type="number" required value={editFormData.stock}
                      onChange={e => setEditFormData({ ...editFormData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                </div>

                {/* Discount price toggle */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Discounted Price</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Sale price customer pays — must be lower than the price above</p>
                    </div>
                    <button type="button" onClick={() => { setEditHasDiscount(!editHasDiscount); if (editHasDiscount) setEditFormData({ ...editFormData, discount_price: "" }); }}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0 ${editHasDiscount ? "bg-orange-500" : "bg-gray-300"}`}>
                      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${editHasDiscount ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {editHasDiscount && (
                    <div>
                      <input type="number" step="0.01" value={editFormData.discount_price}
                        onChange={e => setEditFormData({ ...editFormData, discount_price: e.target.value })}
                        placeholder="Discounted sale price (LKR)"
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                      {editFormData.discount_price && editFormData.price && parseFloat(editFormData.discount_price) < parseFloat(editFormData.price) && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1.5">
                          ✓ Customer saves {Math.round((1 - parseFloat(editFormData.discount_price) / parseFloat(editFormData.price)) * 100)}% · LKR {(parseFloat(editFormData.price) - parseFloat(editFormData.discount_price)).toLocaleString()} off
                        </p>
                      )}
                      {editFormData.discount_price && editFormData.price && parseFloat(editFormData.discount_price) >= parseFloat(editFormData.price) && (
                        <p className="text-xs text-red-500 font-semibold mt-1.5">Discounted price must be lower than the original price</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Image</label>
                  {/* URL / File toggle */}
                  <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-0.5 mb-2.5 w-fit">
                    {(["url", "file"] as const).map(m => (
                      <button key={m} type="button" onClick={() => { setEditUploadMethod(m); setEditSelectedFile(null); setEditImagePreview(""); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${editUploadMethod === m ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                        {m === "url" ? "Image URL" : "Upload File"}
                      </button>
                    ))}
                  </div>
                  {editUploadMethod === "url" ? (
                    <input type="text" value={editFormData.image_url}
                      onChange={e => setEditFormData({ ...editFormData, image_url: e.target.value })}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all" />
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all">
                        <ImageIcon className="w-7 h-7 text-gray-300 mb-1.5" />
                        <p className="text-sm text-gray-400"><span className="font-semibold text-orange-500">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-300 mt-0.5">PNG, JPG up to 5MB</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleEditFileSelect} />
                      </label>
                      {editImagePreview && (
                        <div className="mt-3 relative">
                          <img src={editImagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                          <button type="button" onClick={() => { setEditSelectedFile(null); setEditImagePreview(""); }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/70 text-white hover:bg-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                          <p className="mt-1.5 text-xs text-gray-400">{editSelectedFile?.name} · {((editSelectedFile?.size ?? 0) / 1024).toFixed(1)} KB</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2 pb-1">
                  <button type="button" onClick={() => setEditProduct(null)} disabled={isEditSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={isEditSubmitting}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                    {isEditSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
