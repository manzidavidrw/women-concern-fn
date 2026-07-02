"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { authService, LoginPayload } from "@/src/services/authService";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (user) => {
      const currentUser = await authService.getCurrentUser().catch(() => null);
      setUser(currentUser);
      toast.success("Logged in successfully");
      router.push(user.must_change_password ? "/change-password" : "/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid email or password");
    },
  });
}

export function useLogout() {
  const { logout: clearUser } = useAuthContext();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (data) => {
      clearUser();
      toast.success(data.message || "Logged out successfully");
      // Hard navigation: discards client router cache and app state so the
      // browser can't restore /dashboard from bfcache on a later back press.
      window.location.href = "/login";
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });
}
