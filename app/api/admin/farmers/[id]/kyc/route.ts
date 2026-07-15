import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUser, getUsers, addAuditLog } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";
import { applyCorsHeaders } from "@/lib/security";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const { kycStatus } = await req.json();
    if (!kycStatus || !["Verified", "Suspended", "Pending"].includes(kycStatus)) {
      const res = NextResponse.json({ error: "Invalid or missing kycStatus parameter" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // Verify if user is a farmer
    const users = await getUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      const res = NextResponse.json({ error: "Farmer account not found" }, { status: 404 });
      return applyCorsHeaders(req, res);
    }

    if (user.role !== "FARMER") {
      const res = NextResponse.json({ error: "Target user is not a farmer" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    const updated = await updateUser(id, { kycStatus });

    // 1. Log Admin Audit Action (Part 13.5)
    await addAuditLog(
      "Farmer KYC Update",
      session.id,
      session.name,
      `Updated KYC status for farmer ${user.name} (ID: ${user.id}) to: ${kycStatus}`
    );

    const res = NextResponse.json({
      success: true,
      message: `Farmer KYC status updated to ${kycStatus}`,
      user: {
        id: updated.id,
        name: updated.name,
        kycStatus: updated.kycStatus
      }
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to update farmer KYC" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
