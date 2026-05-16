"use client";

import { OrderStatus, PaymentStatus } from "@/types";
import { getStatusInfo, getPaymentStatusInfo, getCompletedStatuses } from "@/lib/order-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  className?: string;
}

interface TimelineStep {
  type: "payment" | "order";
  status: OrderStatus | PaymentStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export function OrderStatusTracker({
  currentStatus,
  paymentStatus,
  className = "",
}: OrderStatusTrackerProps) {
  const completedStatuses = getCompletedStatuses(currentStatus);
  const paymentInfo = getPaymentStatusInfo(paymentStatus);

  // Build combined timeline with payment status integrated
  const buildTimeline = (): TimelineStep[] => {
    const timeline: TimelineStep[] = [];

    // Step 1: Order Placed
    timeline.push({
      type: "order",
      status: OrderStatus.PENDING,
      label: "Order Placed",
      description: "Your order has been placed",
      icon: "📋",
      color: "bg-gray-500",
      isCompleted: true, // Always completed if order exists
      isCurrent: currentStatus === OrderStatus.PENDING && paymentStatus === PaymentStatus.PENDING,
    });

    // Step 2: Payment Status (insert after order placed)
    const paymentCompleted = paymentStatus === PaymentStatus.PAID;
    timeline.push({
      type: "payment",
      status: paymentStatus,
      label: paymentInfo.label,
      description: paymentCompleted ? "Payment confirmed" : "Awaiting payment confirmation",
      icon: paymentInfo.icon,
      color: paymentInfo.color,
      isCompleted: paymentCompleted,
      isCurrent: !paymentCompleted && currentStatus === OrderStatus.PENDING,
    });

    // Step 3: Order Confirmed (only show as completed if payment is done AND status moved forward)
    const confirmedCompleted = paymentCompleted && completedStatuses.includes(OrderStatus.CONFIRMED);
    timeline.push({
      type: "order",
      status: OrderStatus.CONFIRMED,
      label: "Order Confirmed",
      description: "Order confirmed and being processed",
      icon: "✓",
      color: "bg-blue-500",
      isCompleted: confirmedCompleted,
      isCurrent: currentStatus === OrderStatus.CONFIRMED,
    });

    // Remaining order statuses
    const remainingStatuses = [
      OrderStatus.PREPARING,
      OrderStatus.READY_TO_SHIP,
      OrderStatus.SHIPPED,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    remainingStatuses.forEach((status) => {
      const statusInfo = getStatusInfo(status);
      timeline.push({
        type: "order",
        status,
        label: statusInfo.label,
        description: statusInfo.description,
        icon: statusInfo.icon,
        color: statusInfo.color,
        isCompleted: completedStatuses.includes(status),
        isCurrent: currentStatus === status,
      });
    });

    return timeline;
  };

  const timeline = buildTimeline();

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order Tracking</h3>
        <p className="text-sm text-muted-foreground">Track your order status and delivery</p>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        {timeline.map((step, index) => {
          const isLast = index === timeline.length - 1;

          return (
            <div key={`${step.type}-${step.status}`} className="relative flex items-start pb-8 last:pb-0">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`absolute left-5 top-10 h-full w-0.5 ${
                    step.isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Status Icon */}
              <div className="relative z-10 mr-4 flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.isCompleted
                      ? "border-primary bg-primary text-white"
                      : step.isCurrent
                      ? "border-primary bg-white text-primary"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {step.isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>
              </div>

              {/* Status Info */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold ${
                      step.isCompleted || step.isCurrent ? "text-foreground" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  {step.isCurrent && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Current
                    </Badge>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    step.isCompleted || step.isCurrent ? "text-muted-foreground" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Cancelled or Returned Status */}
        {(currentStatus === OrderStatus.CANCELLED || currentStatus === OrderStatus.RETURNED) && (
          <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:bg-red-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="text-lg">{getStatusInfo(currentStatus).icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  {getStatusInfo(currentStatus).label}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {getStatusInfo(currentStatus).description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
