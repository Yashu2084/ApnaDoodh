import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { geocodeAddress } from "@/lib/services";
import { optimizeRoute, LocationPoint } from "@/lib/routing";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { deliveries } = body;

    if (!deliveries || !Array.isArray(deliveries)) {
      const res = NextResponse.json({ error: "Deliveries array is required" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // Geocode each delivery location
    const locationPoints: LocationPoint[] = [];
    for (const d of deliveries) {
      if (!d.id || !d.address) continue;
      const coords = await geocodeAddress(d.address);
      locationPoints.push({
        id: d.id,
        lat: coords.lat,
        lng: coords.lng,
        customerName: d.customerName || "Customer",
        address: d.address
      });
    }

    // Run TSP nearest neighbor route optimizer
    const result = optimizeRoute(locationPoints);

    const res = NextResponse.json({
      success: true,
      optimizedRoute: result.optimizedRoute,
      totalDistanceKm: parseFloat(result.totalDistanceKm.toFixed(2)),
      distributionCenter: { lat: 28.4595, lng: 77.0266 }
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to optimize route" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
