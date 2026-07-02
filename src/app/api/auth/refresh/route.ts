import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/src/lib/config";

interface BackendRefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
  role: string;
  must_change_password: boolean;
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const backendResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    cookieStore.delete("refresh_token");
    return NextResponse.json(
      { message: data?.message ?? "Session expired" },
      { status: backendResponse.status },
    );
  }

  const body = data as BackendRefreshResponse;

  cookieStore.set("refresh_token", body.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("access_token", body.access_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: body.expires_in,
  });

  return NextResponse.json({
    access_token: body.access_token,
    token_type: body.token_type,
    expires_in: body.expires_in,
    user_id: body.user_id,
    email: body.email,
    role: body.role,
    must_change_password: body.must_change_password,
  });
}
