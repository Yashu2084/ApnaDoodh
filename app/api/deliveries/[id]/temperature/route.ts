import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { DeliveryRepository } from "@/lib/repositories/delivery.repository";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const deliveryRepo = new DeliveryRepository();

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applyCorsHeaders(req, res);
    }

    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { temperature } = body;
    const tempVal = parseFloat(temperature);

    if (isNaN(tempVal)) {
      const res = NextResponse.json({ error: "Temperature must be a valid number" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    const delivery = await deliveryRepo.getById(id);
    if (!delivery) {
      const res = NextResponse.json({ error: "Delivery not found" }, { status: 404 });
      return applyCorsHeaders(req, res);
    }

    // Log the temperature in the delivery item
    const updatedDelivery = await deliveryRepo.logTemperature(id, tempVal);

    let warning = null;
    if (tempVal > 4.0) {
      warning = `COLD-CHAIN WARNING: Temperature of ${tempVal}°C exceeds safety threshold of 4.0°C! Freshness may be compromised.`;
      console.warn(`[Cold-Chain Control] WARNING on Delivery ${id}: ${warning}`);
    }

    const res = NextResponse.json({
      success: true,
      delivery: updatedDelivery,
      warning,
      message: warning ? "Temperature logged with warning" : "Temperature logged successfully"
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to log temperature" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
