import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDeliveries } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer permissions required." }, { status: 403 });
    }

    const allDeliveries = await getDeliveries();
    const customerDeliveries = allDeliveries.filter(d => d.customerId === session.id);

    // Grouping into Scheduled vs Historical
    const scheduled = customerDeliveries.filter(d => ["Scheduled", "Paused", "Skipped"].includes(d.status));
    const historical = customerDeliveries.filter(d => d.status === "Delivered");

    return NextResponse.json({
      success: true,
      deliveries: customerDeliveries,
      scheduled,
      historical
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load deliveries" }, { status: 500 });
  }
}
