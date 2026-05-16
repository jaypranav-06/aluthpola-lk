import { OrderStatus, PaymentStatus, OrderStatusHistory } from "@/types";

// Define the order status flow
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY_TO_SHIP,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

// Get all statuses up to and including the current status
export function getCompletedStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

  if (currentIndex === -1) {
    // If status is CANCELLED or RETURNED, return empty array or handle separately
    return [];
  }

  // Return all statuses from start up to and including current
  return ORDER_STATUS_FLOW.slice(0, currentIndex + 1);
}

// Get the next possible statuses from current status
export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

  if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
    return [];
  }

  // Return next status in the flow
  return [ORDER_STATUS_FLOW[currentIndex + 1]];
}

// Check if a status transition is valid
export function isValidStatusTransition(
  fromStatus: OrderStatus,
  toStatus: OrderStatus
): boolean {
  // Can always cancel
  if (toStatus === OrderStatus.CANCELLED) {
    return fromStatus !== OrderStatus.DELIVERED;
  }

  // Can return only if delivered
  if (toStatus === OrderStatus.RETURNED) {
    return fromStatus === OrderStatus.DELIVERED;
  }

  const fromIndex = ORDER_STATUS_FLOW.indexOf(fromStatus);
  const toIndex = ORDER_STATUS_FLOW.indexOf(toStatus);

  // Must move forward in the flow
  return toIndex > fromIndex;
}

// Get status display information
export function getStatusInfo(status: OrderStatus) {
  const statusMap = {
    [OrderStatus.PENDING]: {
      label: "Order Placed",
      description: "Your order has been placed",
      color: "bg-gray-500",
      icon: "📋",
    },
    [OrderStatus.CONFIRMED]: {
      label: "Confirmed",
      description: "Order confirmed and payment verified",
      color: "bg-blue-500",
      icon: "✓",
    },
    [OrderStatus.PREPARING]: {
      label: "Preparing for Delivery",
      description: "Your order is being prepared",
      color: "bg-yellow-500",
      icon: "📦",
    },
    [OrderStatus.READY_TO_SHIP]: {
      label: "Ready to Ship",
      description: "Your order is ready for pickup by courier",
      color: "bg-orange-500",
      icon: "📮",
    },
    [OrderStatus.SHIPPED]: {
      label: "Shipped",
      description: "Your order has been shipped",
      color: "bg-purple-500",
      icon: "🚚",
    },
    [OrderStatus.OUT_FOR_DELIVERY]: {
      label: "Out for Delivery",
      description: "Your order is out for delivery",
      color: "bg-indigo-500",
      icon: "🏃",
    },
    [OrderStatus.DELIVERED]: {
      label: "Delivered",
      description: "Your order has been delivered",
      color: "bg-green-500",
      icon: "✅",
    },
    [OrderStatus.CANCELLED]: {
      label: "Cancelled",
      description: "Your order has been cancelled",
      color: "bg-red-500",
      icon: "✖",
    },
    [OrderStatus.RETURNED]: {
      label: "Returned",
      description: "Your order has been returned",
      color: "bg-gray-600",
      icon: "↩",
    },
  };

  return statusMap[status];
}

// Get payment status display information
export function getPaymentStatusInfo(status: PaymentStatus) {
  const paymentMap = {
    [PaymentStatus.PENDING]: {
      label: "Payment Pending",
      color: "bg-yellow-500",
      icon: "⏳",
    },
    [PaymentStatus.PAID]: {
      label: "Paid",
      color: "bg-green-500",
      icon: "✓",
    },
    [PaymentStatus.FAILED]: {
      label: "Payment Failed",
      color: "bg-red-500",
      icon: "✖",
    },
    [PaymentStatus.REFUNDED]: {
      label: "Refunded",
      color: "bg-blue-500",
      icon: "↩",
    },
  };

  return paymentMap[status];
}

// Create status history entry
export function createStatusHistoryEntry(
  status: OrderStatus,
  updatedBy?: string,
  note?: string
): OrderStatusHistory {
  return {
    status,
    timestamp: new Date(),
    updatedBy,
    note,
  };
}

// Format order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ALU${timestamp}${random}`;
}
