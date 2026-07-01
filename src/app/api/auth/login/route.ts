import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/src/lib/config";

interface BackendLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
  role: string;
  must_change_password: boolean;
}

export async function POST(request: Request) {
  const payload = await request.json();

  const backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Invalid email or password" },
      { status: backendResponse.status },
    );
  }

  const body = data as BackendLoginResponse;
  const cookieStore = await cookies();

  cookieStore.set("access_token", body.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: body.expires_in,
  });

  cookieStore.set("refresh_token", body.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    user_id: body.user_id,
    email: body.email,
    role: body.role,
    must_change_password: body.must_change_password,
  });
}
