import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRefreshToken, getUsers } from "@/lib/db";
import { verifyJWT, signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("apnadoodh_refresh")?.value;

    // Check if it's passed in body in case of middleware sub-requests
    if (!token) {
      try {
        const body = await req.json();
        token = body.refreshToken;
      } catch {
        // No body
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Refresh token is missing" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    // Verify token against database
    const dbToken = await getRefreshToken(token);
    if (!dbToken) {
      return NextResponse.json({ error: "Refresh token has been revoked or expired" }, { status: 401 });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === dbToken.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (user.role === "CUSTOMER" && user.status === "Blocked") {
      return NextResponse.json({ error: "User is blocked" }, { status: 403 });
    }

    const claim = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Issue new short-lived access token
    const newAccessToken = await signJWT(claim, 900);

    // Set Access Token Cookie on response
    cookieStore.set("apnadoodh_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      user: claim
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Refresh failed" }, { status: 500 });
  }
}
