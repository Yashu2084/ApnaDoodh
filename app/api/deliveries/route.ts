import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDeliveries, pauseCustomerDeliveries } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let deliveries = await getDeliveries();

    if (session.role === "CUSTOMER") {
      deliveries = deliveries.filter(d => d.customerId === session.id);
    } else if (session.role === "FARMER") {
      deliveries = deliveries.filter(d => d.farmerId === session.id);
    } // Admin sees all

    return NextResponse.json({ success: true, deliveries });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load deliveries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer account required." }, { status: 403 });
    }

    const { isPaused } = await req.json();

    if (isPaused === undefined) {
      return NextResponse.json({ error: "Missing required parameter: isPaused" }, { status: 400 });
    }

    await pauseCustomerDeliveries(session.id, isPaused);

    return NextResponse.json({
      success: true,
      message: `Morning drops successfully ${isPaused ? "paused" : "resumed"}`
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Operation failed" }, { status: 500 });
  }
}
