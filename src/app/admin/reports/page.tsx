"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart
} from "lucide-react";
import { UserRole } from "@/types";

export default function ViewReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    // Check authentication
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

    setLoading(false);
  }, [router]);

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
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">View Reports</h1>
                  <p className="text-sm text-gray-600">
                    Analytics and insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">This Year</option>
              </select>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h3 className="text-3xl font-bold">$125,430</h3>
                <p className="text-sm text-green-600 mt-1">+18.2% vs last period</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <h3 className="text-3xl font-bold">1,254</h3>
                <p className="text-sm text-green-600 mt-1">+12.5% vs last period</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <h3 className="text-3xl font-bold">342</h3>
                <p className="text-sm text-green-600 mt-1">+8.1% vs last period</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products Sold</p>
                <h3 className="text-3xl font-bold">3,891</h3>
                <p className="text-sm text-green-600 mt-1">+15.3% vs last period</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Revenue chart will be displayed here</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sales by Category</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Category distribution chart will be displayed here</p>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                      1
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">iPhone 15 Pro</td>
                  <td className="px-6 py-4">342 units</td>
                  <td className="px-6 py-4 font-semibold">$341,916</td>
                  <td className="px-6 py-4 text-green-600">+24%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                      2
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">Samsung Galaxy S24</td>
                  <td className="px-6 py-4">287 units</td>
                  <td className="px-6 py-4 font-semibold">$258,313</td>
                  <td className="px-6 py-4 text-green-600">+18%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                      3
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">AirPods Pro</td>
                  <td className="px-6 py-4">523 units</td>
                  <td className="px-6 py-4 font-semibold">$130,747</td>
                  <td className="px-6 py-4 text-green-600">+31%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                      4
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">MacBook Pro 16</td>
                  <td className="px-6 py-4">89 units</td>
                  <td className="px-6 py-4 font-semibold">$222,491</td>
                  <td className="px-6 py-4 text-green-600">+12%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                      5
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">iPad Air</td>
                  <td className="px-6 py-4">156 units</td>
                  <td className="px-6 py-4 font-semibold">$93,444</td>
                  <td className="px-6 py-4 text-red-600">-5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Customer Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Organic Search</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: "45%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Direct Traffic</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: "30%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Social Media</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: "15%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Referrals</span>
                <span className="font-semibold">10%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600" style={{ width: "10%" }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Delivered</span>
                <span className="font-semibold text-green-700">654 orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Processing</span>
                <span className="font-semibold text-blue-700">234 orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-700">Shipped</span>
                <span className="font-semibold text-purple-700">198 orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-700">Pending</span>
                <span className="font-semibold text-yellow-700">123 orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-700">Cancelled</span>
                <span className="font-semibold text-red-700">45 orders</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
