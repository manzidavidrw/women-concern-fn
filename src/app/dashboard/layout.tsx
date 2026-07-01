"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/src/components/layout/DashboardLayout";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useReloadOnBfcacheRestore } from "@/src/hooks/useReloadOnBfcacheRestore";

export default function DashboardRouteLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();

  useReloadOnBfcacheRestore();

  return <DashboardLayout roles={user ? [user.role] : undefined}>{children}</DashboardLayout>;
}
