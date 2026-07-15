import { NextRequest, NextResponse } from "next/server";
import { getTrackingLocation, updateTrackingLocation } from "@/lib/db";

export async function GET() {
  try {
    const tracking = await getTrackingLocation();
    return NextResponse.json({ success: true, tracking });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load tracking coordinates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Latitude and Longitude are required" }, { status: 400 });
    }

    const updated = await updateTrackingLocation(parseFloat(lat), parseFloat(lng));

    return NextResponse.json({ success: true, tracking: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update tracking coordinates" }, { status: 500 });
  }
}
