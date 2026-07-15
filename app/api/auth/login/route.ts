import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, addRefreshToken, comparePassword } from "@/lib/db";
import { UserRepository } from "@/lib/repositories/user.repository";
import { signJWT } from "@/lib/jwt";
import { applyCorsHeaders, isRateLimited, sanitizeInput } from "@/lib/security";

const userRepo = new UserRepository();

export async function POST(req: NextRequest) {
  try {
    // 1. IP Sliding Window Rate Limit Enforcement (Part 9.3)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limited = await isRateLimited(ip, "auth_login", 5, 60); // Max 5 req/min
    if (limited) {
      const res = NextResponse.json(
        { error: "Too many login attempts. Please wait 1 minute." }, 
        { status: 429 }
      );
      return applyCorsHeaders(req, res);
    }

    // 2. Input Sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { email, password } = body;

    if (!email || !password) {
      const res = NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // 3. User Retrieval via Repository (Part 11.2)
    const user = await userRepo.getByEmail(email);

    if (!user) {
      const res = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      return applyCorsHeaders(req, res);
    }

    // Check if customer is blocked
    if (user.role === "CUSTOMER" && user.status === "Blocked") {
      const res = NextResponse.json({ error: "Your account has been suspended by the administrator." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      const res = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      return applyCorsHeaders(req, res);
    }

    const claim = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Access Token (Expires in 15 minutes = 900s)
    const accessToken = await signJWT(claim, 900);
    // Refresh Token (Expires in 30 days = 2592000s)
    const refreshToken = await signJWT(claim, 2592000);

    // Save refresh token in DB
    await addRefreshToken(user.id, refreshToken);

    const cookieStore = await cookies();
    
    // Set Access Token Cookie with Secure/HttpOnly/SameSite Strict attributes (Part 9.2)
    cookieStore.set("apnadoodh_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900,
      path: "/",
    });

    // Set Refresh Token Cookie
    cookieStore.set("apnadoodh_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Login failed" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
