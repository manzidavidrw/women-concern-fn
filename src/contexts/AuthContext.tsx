"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { authService, CurrentUser } from "@/src/services/authService";

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  setUser: (user: CurrentUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // tokenStore already hydrated the access token from its cookie at module
    // load. Just try using it — if it's expired, apiClient's response
    // interceptor transparently refreshes via the httpOnly refresh_token
    // cookie and retries, so we don't need to force a refresh on every mount.
    authService
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);

        if (currentUser.mustChangePassword && pathname !== "/change-password") {
          router.replace("/change-password");
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
