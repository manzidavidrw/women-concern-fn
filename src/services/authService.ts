import api from "@/src/lib/apiClient";
import { ApiEnvelope } from "@/src/lib/apiTypes";
import { tokenStore } from "@/src/lib/tokenStore";

export type UserRole =
  | "ADMIN"
  | "EXECUTIVE_DIRECTOR"
  | "PROJECT_MANAGER"
  | "FINANCE"
  | "FIELD_OFFICER";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface SessionUser {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
  role: UserRole;
  must_change_password: boolean;
}

export interface CurrentUser {
  id: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  address: string | null;
  emergencyContact: string | null;
  certificates: string[];
  dateOfBirth: string | null;
  joinedAt: string | null;
  gender: string | null;
  role: UserRole;
  jobTitle: string | null;
  nationalId: string | null;
  profilePictureUrl: string | null;
  active: boolean;
  mustChangePassword: boolean;
}

async function bootstrapSession(response: Response): Promise<SessionUser> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Session request failed");
  }

  const session = data as SessionUser;
  tokenStore.setAccessToken(session.access_token);
  return session;
}

export const authService = {
  login: (payload: LoginPayload): Promise<SessionUser> =>
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(bootstrapSession),

  logout: async (): Promise<{ message: string }> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    tokenStore.setAccessToken(null);

    if (!response.ok) {
      throw new Error(data?.message ?? "Logout failed");
    }

    return data;
  },

  getCurrentUser: (): Promise<CurrentUser> => api.get<CurrentUser>("/auth/me"),

  resetPassword: async (payload: ResetPasswordPayload): Promise<string> => {
    const response = await api.post<ApiEnvelope<{ message: string }>>(
      "/auth/reset-password",
      payload,
    );
    return response.message;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<string> => {
    const response = await api.post<ApiEnvelope<{ message: string }>>(
      "/auth/forgot-password",
      payload,
    );
    return response.message;
  },
};
