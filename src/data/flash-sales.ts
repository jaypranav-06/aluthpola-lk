import { FlashSale } from "@/types";
import { products } from "./products";

// Helper function to get a date X hours from now
const hoursFromNow = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

// Helper function to calculate flash sale price
const calculateFlashPrice = (originalPrice: number, discountPercentage: number): number => {
  return Math.round(originalPrice * (1 - discountPercentage / 100));
};

export const flashSales: FlashSale[] = [
  {
    id: "fs001",
    productId: "p001", // Samsung Galaxy S24 Ultra
    discountPercentage: 15,
    flashPrice: calculateFlashPrice(459990, 15),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)), // Today midnight
    endTime: hoursFromNow(6),
    stockLimit: 50,
    soldCount: 23,
    isActive: true,
  },
  {
    id: "fs002",
    productId: "p007", // Sony WH-1000XM5
    discountPercentage: 25,
    flashPrice: calculateFlashPrice(89990, 25),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endTime: hoursFromNow(6),
    stockLimit: 100,
    soldCount: 67,
    isActive: true,
  },
  {
    id: "fs003",
    productId: "p010", // Nike Air Max 270
    discountPercentage: 30,
    flashPrice: calculateFlashPrice(34990, 30),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endTime: hoursFromNow(6),
    stockLimit: 200,
    soldCount: 143,
    isActive: true,
  },
  {
    id: "fs004",
    productId: "p014", // Philips Air Fryer
    discountPercentage: 20,
    flashPrice: calculateFlashPrice(54990, 20),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endTime: hoursFromNow(6),
    stockLimit: 75,
    soldCount: 41,
    isActive: true,
  },
  {
    id: "fs005",
    productId: "p008", // AirPods Pro
    discountPercentage: 18,
    flashPrice: calculateFlashPrice(74990, 18),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endTime: hoursFromNow(6),
    stockLimit: 80,
    soldCount: 52,
    isActive: true,
  },
  {
    id: "fs006",
    productId: "p012", // Adidas Ultraboost
    discountPercentage: 35,
    flashPrice: calculateFlashPrice(42990, 35),
    startTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endTime: hoursFromNow(6),
    stockLimit: 120,
    soldCount: 89,
    isActive: true,
  },
];

// Get active flash sales with product details
export const getActiveFlashSales = (): (FlashSale & { product: typeof products[0] })[] => {
  return flashSales
    .filter((sale) => {
      const now = new Date();
      return sale.isActive && now >= sale.startTime && now <= sale.endTime;
    })
    .map((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (!product) return null;
      return {
        ...sale,
        product,
      };
    })
    .filter((sale): sale is FlashSale & { product: typeof products[0] } => sale !== null);
};

// Calculate remaining stock percentage
export const getRemainingStockPercentage = (sale: FlashSale): number => {
  return ((sale.stockLimit - sale.soldCount) / sale.stockLimit) * 100;
};

// Calculate time remaining in milliseconds
export const getTimeRemaining = (endTime: Date): number => {
  return endTime.getTime() - new Date().getTime();
};
