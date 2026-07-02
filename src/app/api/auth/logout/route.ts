import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/src/lib/config";

interface BackendLogoutResponse {
  message: string;
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  let message = "Logged out successfully";

  if (refreshToken) {
    try {
      const backendResponse = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data: BackendLogoutResponse | null = await backendResponse.json().catch(() => null);

      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Backend unreachable — still clear local cookies below so the user isn't stuck logged in.
    }
  }

  cookieStore.delete("refresh_token");
  cookieStore.delete("access_token");

  return NextResponse.json({ message });
}
