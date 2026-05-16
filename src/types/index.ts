export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isWholesale: boolean;
  wholesaleMinQty?: number;
  wholesalePrice?: number;
  partnerId: string;
  partnerName: string;
  partnerLogo?: string;
  tags: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  subcategories?: Category[];
  productCount?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// User roles - supporting user, staff, and super admin
export enum UserRole {
  USER = "user",
  STAFF = "staff",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  role: UserRole;
  isAuthenticated: boolean;
  loginTime?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY_TO_SHIP = "ready_to_ship",
  SHIPPED = "shipped",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  commission: number;
}

export interface FilterOptions {
  categories?: string[];
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
  isWholesale?: boolean;
  partners?: string[];
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest";
}

export interface SearchParams {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
  filters?: FilterOptions;
}

export interface FlashSale {
  id: string;
  productId: string;
  product?: Product;
  discountPercentage: number;
  flashPrice: number;
  startTime: Date;
  endTime: Date;
  stockLimit: number;
  soldCount: number;
  isActive: boolean;
}
