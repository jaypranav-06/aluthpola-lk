"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin");
  if (hideHeader) return null;
  return <Header />;
}
