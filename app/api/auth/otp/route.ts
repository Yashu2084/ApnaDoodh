import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for simulated OTPs (for demo/testing)
// In production, this would be backed by Redis or an expiring DB table.
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { action, phone, code } = await req.json();

    if (action === "send") {
      if (!phone) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store with 5 minutes expiry
      otpStore.set(phone, {
        code: otpCode,
        expiresAt: Date.now() + 5 * 60 * 1000
      });



      return NextResponse.json({
        success: true,
        message: "OTP sent successfully (Simulated Twilio SMS)",
        // Return code in development response for easy testing
        code: process.env.NODE_ENV !== "production" ? otpCode : undefined
      });
    }

    if (action === "verify") {
      if (!phone || !code) {
        return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
      }

      const stored = otpStore.get(phone);
      if (!stored) {
        return NextResponse.json({ error: "OTP not sent or expired" }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(phone);
        return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
      }

      if (stored.code !== code) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
      }

      // Cleanup on success
      otpStore.delete(phone);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "OTP operation failed" }, { status: 500 });
  }
}
