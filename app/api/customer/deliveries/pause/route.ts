import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pauseCustomerDeliveries } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer permissions required." }, { status: 403 });
    }

    const { pause } = await req.json();
    if (pause === undefined) {
      return NextResponse.json({ error: "Missing required parameter: pause" }, { status: 400 });
    }

    await pauseCustomerDeliveries(session.id, pause);

    return NextResponse.json({
      success: true,
      message: `Morning drops successfully ${pause ? "paused" : "resumed"}`
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Operation failed" }, { status: 500 });
  }
}
