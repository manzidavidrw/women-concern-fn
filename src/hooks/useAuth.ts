"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/src/contexts/AuthContext";
import {
  authService,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
} from "@/src/services/authService";

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

export function usePublicResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, ...payload }: ResetPasswordPayload & { token: string }) =>
      authService.resetPassword(payload, token),
    onSuccess: (message) => {
      toast.success(message || "Password reset successfully. Please log in.");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    onSuccess: (message) => {
      toast.success(message || "If an account exists for that email, a reset link has been sent");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
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
