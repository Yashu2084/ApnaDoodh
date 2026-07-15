import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addUser, getUsers, addRefreshToken } from "@/lib/db";
import { signJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider") || "google";
    const cleanProvider = provider.toLowerCase() === "apple" ? "Apple" : "Google";
    const oauthEmail = `oauth-${provider.toLowerCase()}@apnadoodh.com`;

    const users = await getUsers();
    let user = users.find(u => u.email === oauthEmail);

    if (!user) {
      // Create a new mock user for this OAuth provider
      user = await addUser({
        name: `${cleanProvider} Demo User`,
        email: oauthEmail,
        passwordHash: "oauth_simulated_placeholder",
        role: "CUSTOMER",
      });
    }

    // Check if customer is blocked
    if (user.status === "Blocked") {
      return NextResponse.redirect(new URL("/login?error=account_blocked", req.url));
    }

    const claim = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signJWT(claim, 900); // 15 mins
    const refreshToken = await signJWT(claim, 2592000); // 30 days

    await addRefreshToken(user.id, refreshToken);

    const cookieStore = await cookies();
    cookieStore.set("apnadoodh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900,
      path: "/",
    });

    cookieStore.set("apnadoodh_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2592000,
      path: "/",
    });

    return NextResponse.redirect(new URL("/dashboard/customer", req.url));
  } catch (e: any) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(e.message || "oauth_failed")}`, req.url));
  }
}
