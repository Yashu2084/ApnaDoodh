import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { getAuditLogs } from "@/lib/db";
import { applyCorsHeaders } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin credentials required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const logs = await getAuditLogs();

    // Sort by timestamp descending
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const res = NextResponse.json({ success: true, logs: sortedLogs });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to load audit logs" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
