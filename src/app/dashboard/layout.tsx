"use client";

import { Loader2 } from "lucide-react";
import { ReactNode, useEffect } from "react";
import DashboardLayout from "@/src/components/layout/DashboardLayout";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useReloadOnBfcacheRestore } from "@/src/hooks/useReloadOnBfcacheRestore";
import { authService } from "@/src/services/authService";
import WLoader from "@/src/components/shared/WLoader";

export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuthContext();

  useReloadOnBfcacheRestore();

  useEffect(() => {
    if (!isLoading && !user) {
      // The session cookie is present but invalid/expired (getCurrentUser
      // failed). Clear it server-side before redirecting, otherwise proxy.ts
      // still sees a cookie and bounces /login straight back to /dashboard.
      authService.logout().finally(() => {
        window.location.href = "/login";
      });
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-w-white">
        <WLoader />
      </div>
    );
  }

  return <DashboardLayout roles={[user.role]}>{children}</DashboardLayout>;
}
