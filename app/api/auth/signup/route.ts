import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserRepository } from "@/lib/repositories/user.repository";
import { hashPassword, addRefreshToken } from "@/lib/db";
import { signJWT } from "@/lib/jwt";
import { sendEmail } from "@/lib/services";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const userRepo = new UserRepository();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      const res = NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const validRoles = ["CUSTOMER", "FARMER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    const existing = await userRepo.getByEmail(email);
    if (existing) {
      const res = NextResponse.json({ error: "Email already registered" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    const passwordHash = hashPassword(password);
    const user = await userRepo.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role as "CUSTOMER" | "FARMER",
    });

    // Send Welcome Email (Part 8.3)
    const welcomeHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to ApnaDoodh, ${user.name}!</h2>
        <p>Your account has been registered successfully as a <strong>${user.role}</strong>.</p>
        <p>If you're a Customer, you can now top up your wallet and schedule fresh farm-to-table morning drops.</p>
        <p>If you're a Farmer, please complete your store profile and complete KYC verification to get started listing products.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>The ApnaDoodh Team</strong></p>
      </div>
    `;
    await sendEmail(user.email, "Welcome to ApnaDoodh!", welcomeHtml);

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
    
    // Set Access Token Cookie
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
    const res = NextResponse.json({ error: e.message || "Signup failed" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}
