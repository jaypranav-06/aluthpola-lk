"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Key,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { UserRole } from "@/types";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  commission: number;
}

interface ApiKey {
  id: string;
  partner_id: string;
  partner_name?: string;
  platform: string;
  api_key: string;
  api_secret?: string;
  endpoint_url?: string;
  is_active: boolean;
  last_sync_at?: string;
  sync_status: string;
  created_at: string;
}

const PLATFORMS = [
  { value: "amazon", label: "Amazon", icon: "🛒" },
  { value: "aliexpress", label: "AliExpress", icon: "🏪" },
  { value: "temu", label: "Temu", icon: "🛍️" },
  { value: "ebay", label: "eBay", icon: "🏷️" },
  { value: "shopify", label: "Shopify", icon: "🏬" },
  { value: "custom", label: "Custom API", icon: "🔧" },
];

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [showApiSecret, setShowApiSecret] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    partner_id: "",
    platform: "",
    api_key: "",
    api_secret: "",
    endpoint_url: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== UserRole.SUPER_ADMIN) {
      router.push("/profile");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Load API keys
      const keysResponse = await fetch("/api/admin/api-keys");
      const keysData = await keysResponse.json();
      if (keysResponse.ok && keysData.success) {
        setApiKeys(keysData.apiKeys);
      }

      // Load partners
      const partnersResponse = await fetch("/api/admin/partners");
      const partnersData = await partnersResponse.json();
      if (partnersResponse.ok && partnersData.success) {
        setPartners(partnersData.partners);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add API key");
        return;
      }

      alert("API key added successfully!");
      setShowAddModal(false);
      setFormData({
        partner_id: "",
        platform: "",
        api_key: "",
        api_secret: "",
        endpoint_url: "",
      });
      loadData();
    } catch (error) {
      console.error("Error adding API key:", error);
      alert("An error occurred while adding the API key");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncProducts = async (apiKeyId: string) => {
    if (!confirm("Sync products from this API? This may take a few minutes.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/api-keys/${apiKeyId}/sync`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to sync products");
        return;
      }

      alert(data.message || "Product sync started successfully!");
      loadData();
    } catch (error) {
      console.error("Error syncing products:", error);
      alert("An error occurred while syncing products");
    }
  };

  const toggleVisibility = (id: string, type: "key" | "secret") => {
    if (type === "key") {
      setShowApiKey({ ...showApiKey, [id]: !showApiKey[id] });
    } else {
      setShowApiSecret({ ...showApiSecret, [id]: !showApiSecret[id] });
    }
  };

  const maskString = (str: string) => {
    if (str.length <= 8) return "••••••••";
    return str.substring(0, 4) + "••••••••" + str.substring(str.length - 4);
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            Success
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Syncing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Key className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">API Keys Management</h1>
                  <p className="text-sm text-gray-600">
                    Connect external platforms to import products
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <Card className="p-12 text-center text-gray-500">
              <Key className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium">No API keys configured</p>
              <p className="mt-2 text-sm">
                Add API keys to import products from external platforms
              </p>
            </Card>
          ) : (
            apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">
                        {PLATFORMS.find((p) => p.value === apiKey.platform)?.icon || "🔑"}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {PLATFORMS.find((p) => p.value === apiKey.platform)?.label || apiKey.platform}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Partner: {apiKey.partner_name || "Unknown"}
                        </p>
                      </div>
                      <div className="ml-4">
                        {getSyncStatusBadge(apiKey.sync_status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">API Key</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 rounded bg-gray-100 px-3 py-2 text-sm font-mono">
                            {showApiKey[apiKey.id] ? apiKey.api_key : maskString(apiKey.api_key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(apiKey.id, "key")}
                          >
                            {showApiKey[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {apiKey.api_secret && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">API Secret</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 rounded bg-gray-100 px-3 py-2 text-sm font-mono">
                              {showApiSecret[apiKey.id]
                                ? apiKey.api_secret
                                : maskString(apiKey.api_secret)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(apiKey.id, "secret")}
                            >
                              {showApiSecret[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {apiKey.last_sync_at && (
                      <p className="text-sm text-gray-500">
                        Last synced: {new Date(apiKey.last_sync_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncProducts(apiKey.id)}
                      disabled={apiKey.sync_status === "syncing"}
                    >
                      <RefreshCw
                        className={`mr-1 h-4 w-4 ${
                          apiKey.sync_status === "syncing" ? "animate-spin" : ""
                        }`}
                      />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-xl font-bold">Add API Key</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddModal(false)}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleAddApiKey} className="p-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Partner *</label>
                <select
                  required
                  value={formData.partner_id}
                  onChange={(e) =>
                    setFormData({ ...formData, partner_id: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a partner</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Platform *</label>
                <select
                  required
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a platform</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">API Key *</label>
                <Input
                  type="text"
                  required
                  value={formData.api_key}
                  onChange={(e) =>
                    setFormData({ ...formData, api_key: e.target.value })
                  }
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  API Secret (Optional)
                </label>
                <Input
                  type="text"
                  value={formData.api_secret}
                  onChange={(e) =>
                    setFormData({ ...formData, api_secret: e.target.value })
                  }
                  placeholder="Enter API secret if required"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Endpoint URL (Optional)
                </label>
                <Input
                  type="url"
                  value={formData.endpoint_url}
                  onChange={(e) =>
                    setFormData({ ...formData, endpoint_url: e.target.value })
                  }
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add API Key"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
