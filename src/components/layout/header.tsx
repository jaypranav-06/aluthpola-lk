"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";
import {
  Search, ShoppingCart, Heart, Bell, User, ChevronDown,
  Menu, X, LogOut, ShieldCheck, TrendingUp,
  Tag, Home, Grid3X3, Package
} from "lucide-react";

const NAV_LINKS = [
  { label: "Categories", href: "/categories", icon: Grid3X3 },
  { label: "New Arrivals", href: "/new-arrivals", icon: TrendingUp },
  { label: "Best Sellers", href: "/best-sellers", icon: Tag },
];

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: favCount } = useFavourites();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          boxShadow: scrolled ? "0 2px 16px 0 rgba(0,0,0,0.08)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        {/* Announcement Bar */}
        <div style={{ background: "linear-gradient(90deg,#f97316,#fb923c)", color: "#fff" }}
          className="py-2 px-4 text-center text-xs font-medium tracking-wide">
          Free delivery on orders over <strong>LKR 5,000</strong> &nbsp;|&nbsp; Islandwide delivery available &nbsp;|&nbsp; Secure payments
        </div>

        {/* Main Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                A
              </div>
              <span className="hidden sm:block text-xl font-black text-gray-900 tracking-tight">
                Aluthpola<span style={{ color: "#f97316" }}>.lk</span>
              </span>
            </Link>

            {/* Search */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex-1 max-w-2xl"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for electronics, fashion, groceries…"
                  className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#f97316" }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Favourites */}
              <Link href="/favourites" className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl hover:bg-orange-50 transition-colors group">
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "#f97316" }}>{favCount}</span>
                )}
              </Link>

              {/* Notifications */}
              <button className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-xl hover:bg-orange-50 transition-colors group">
                <Bell className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f97316" }} />
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative flex w-10 h-10 items-center justify-center rounded-xl hover:bg-orange-50 transition-colors group">
                <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "#f97316" }}>
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative hidden sm:block" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: isAuthenticated ? "#f97316" : "#d1d5db" }}>
                    {isAuthenticated ? (user?.name?.[0]?.toUpperCase() ?? "U") : <User className="w-4 h-4 text-gray-500" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
                    {isAuthenticated ? user?.name?.split(" ")[0] : "Sign In"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 fade-in-up">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        {isAdmin && (
                          <div className="px-3 py-2">
                            <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                              style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                              <ShieldCheck className="w-4 h-4" /> Go to Admin Panel
                            </Link>
                          </div>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-center mx-3 my-1 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                          style={{ background: "#f97316" }}>
                          Sign In
                        </Link>
                        <Link href="/signup" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-center mx-3 my-1 py-2 rounded-xl border border-orange-200 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="bg-white border-b border-gray-100 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1 overflow-x-auto scroll-x py-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 whitespace-nowrap transition-all">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-b border-gray-100 shadow-lg">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="search" placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400" />
              </div>
            </div>
            <nav className="p-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                      <User className="w-4 h-4" /> {user?.name}
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors"
                        style={{ color: "#f97316" }}>
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: "#f97316" }}>
                    Sign In / Create Account
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center"
        style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}>
        {[
          { icon: Home, label: "Home", href: "/" },
          { icon: Grid3X3, label: "Categories", href: "/categories" },
          { icon: ShoppingCart, label: "Cart", href: "/cart", badge: itemCount },
          { icon: Heart, label: "Favourites", href: "/favourites" },
          { icon: User, label: "Account", href: isAuthenticated ? "/profile" : "/login" },
        ].map(({ icon: Icon, label, href, badge }) => (
          <Link key={label} href={href}
            className="flex-1 flex flex-col items-center py-3 gap-0.5 group relative">
            <div className="relative">
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              {badge != null && badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "#f97316" }}>
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-orange-500 transition-colors">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
