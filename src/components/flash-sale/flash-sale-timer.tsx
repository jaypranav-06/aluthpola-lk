"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface FlashSaleTimerProps {
  endTime: Date;
  onExpire?: () => void;
  className?: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function FlashSaleTimer({ endTime, onExpire, className = "" }: FlashSaleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeRemaining(calculateTimeRemaining(endTime));
  }, [endTime]);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(endTime);
      setTimeRemaining(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire, isMounted]);

  // Show loading state during hydration
  if (!isMounted || !timeRemaining) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="h-4 w-4 text-red-600" />
        <div className="flex gap-1 font-mono text-sm font-semibold">
          <TimeUnit value={0} label="h" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={0} label="m" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={0} label="s" />
        </div>
      </div>
    );
  }

  if (timeRemaining.total <= 0) {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        <Clock className="h-4 w-4" />
        <span className="font-semibold">Expired</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4 text-red-600" />
      <div className="flex gap-1 font-mono text-sm font-semibold">
        <TimeUnit value={timeRemaining.hours} label="h" />
        <span className="text-muted-foreground">:</span>
        <TimeUnit value={timeRemaining.minutes} label="m" />
        <span className="text-muted-foreground">:</span>
        <TimeUnit value={timeRemaining.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center">
      <span className="min-w-[1.5rem] text-center text-red-600">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function calculateTimeRemaining(endTime: Date): TimeRemaining {
  const total = endTime.getTime() - new Date().getTime();

  if (total <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

  return { hours, minutes, seconds, total };
}
