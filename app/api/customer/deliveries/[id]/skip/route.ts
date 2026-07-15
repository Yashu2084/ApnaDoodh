import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { skipDeliveryDate, getDeliveries } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer permissions required." }, { status: 403 });
    }

    const { date } = await req.json();
    if (!date) {
      return NextResponse.json({ error: "Date parameter is required (YYYY-MM-DD)" }, { status: 400 });
    }

    // Verify ownership of the delivery drop
    const deliveries = await getDeliveries();
    const delivery = deliveries.find(d => d.id === id);

    if (!delivery) {
      return NextResponse.json({ error: "Delivery drop not found" }, { status: 404 });
    }

    if (delivery.customerId !== session.id) {
      return NextResponse.json({ error: "Forbidden. You do not own this subscription." }, { status: 403 });
    }

    const updated = await skipDeliveryDate(id, date);

    return NextResponse.json({
      success: true,
      message: `Delivery successfully skipped for date: ${date}`,
      delivery: updated
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Operation failed" }, { status: 500 });
  }
}
