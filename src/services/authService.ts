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

export interface LoginUser {
  user_id: string;
  email: string;
  role: UserRole;
  must_change_password: boolean;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginUser> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message ?? "Invalid email or password");
    }

    return data as LoginUser;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message ?? "Logout failed");
    }

    return data;
  },
};
