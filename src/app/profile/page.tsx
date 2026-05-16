"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Package,
  Heart,
  CreditCard,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
      });
    }
  }, [user, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    window.location.reload(); // Refresh to update auth state
  };

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white sm:h-24 sm:w-24">
              <User className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{user.name}</h1>
            <p className="text-sm text-muted-foreground sm:text-base">{user.email}</p>
            {isAdmin && (
              <Badge variant="secondary" className="mt-2">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Account
              </Badge>
            )}
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {/* Quick Actions Sidebar */}
            <div className="space-y-4">
              <Card className="p-4">
                <h2 className="mb-4 font-semibold">Quick Actions</h2>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/orders")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/wishlist")}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/cart")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Shopping Cart
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Profile Content */}
            <div className="md:col-span-2">
              <Card className="p-4 sm:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold sm:text-2xl">Profile Information</h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex-1 sm:flex-initial"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="flex-1 sm:flex-initial">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-4 py-2">
                        {user.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-4 py-2">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-4 py-2">
                        {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Delivery Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your delivery address"
                      />
                    ) : (
                      <p className="rounded-md border border-border bg-muted/30 px-4 py-2">
                        {formData.address || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      Account Type
                    </label>
                    <div className="rounded-md border border-border bg-muted/30 px-4 py-2">
                      <Badge variant={isAdmin ? "secondary" : "outline"}>
                        {isAdmin ? "Administrator" : "User"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Orders Preview */}
              <Card className="mt-4 p-4 sm:mt-6 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold sm:text-xl">Recent Orders</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/orders")}
                    className="w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </div>
                <div className="py-8 text-center text-muted-foreground">
                  <Package className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p className="text-sm sm:text-base">No orders yet</p>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => router.push("/")}
                  >
                    Start Shopping
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
