import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlatformSettings, updatePlatformSettings, addAuditLog } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const settings = await getPlatformSettings();
    const res = NextResponse.json({ success: true, settings });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to load platform settings" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Input sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const updated = await updatePlatformSettings(body);

    // Log admin settings change to audit trail (Part 13.5)
    await addAuditLog(
      "Platform Settings Update",
      session.id,
      session.name,
      `Updated platform settings. Commission: ${updated.commissionRate}%, Base fee: INR ${updated.baseDeliveryFee}, KYC required: ${updated.kycRequired}`
    );

    const res = NextResponse.json({ success: true, settings: updated });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to update platform settings" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
