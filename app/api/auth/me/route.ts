import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { updateUser, getUsers } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("apnadoodh_token");

    if (!tokenCookie) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyJWT(tokenCookie.value);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === payload.id);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
        kycStatus: user.kycStatus,
        location: user.location,
        joinedDate: user.joinedDate,
        herdSize: user.herdSize,
        storeName: user.storeName,
        storeDesc: user.storeDesc,
        storePhone: user.storePhone,
        storeAddress: user.storeAddress,
        deliveryRadius: user.deliveryRadius,
        dispatchTime: user.dispatchTime,
        deliveryFee: user.deliveryFee,
        status: user.status,
      }
    });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("apnadoodh_token");

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(tokenCookie.value);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Whitelist profile fields that can be updated
    const allowedUpdates: any = {};
    const keys = [
      "name", "storeName", "storeDesc", "storePhone", "storeAddress",
      "deliveryRadius", "dispatchTime", "deliveryFee", "location", "herdSize"
    ];

    for (const key of keys) {
      if (body[key] !== undefined) {
        allowedUpdates[key] = body[key];
      }
    }

    const updated = await updateUser(payload.id, allowedUpdates);

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        walletBalance: updated.walletBalance,
        kycStatus: updated.kycStatus,
        location: updated.location,
        joinedDate: updated.joinedDate,
        herdSize: updated.herdSize,
        storeName: updated.storeName,
        storeDesc: updated.storeDesc,
        storePhone: updated.storePhone,
        storeAddress: updated.storeAddress,
        deliveryRadius: updated.deliveryRadius,
        dispatchTime: updated.dispatchTime,
        deliveryFee: updated.deliveryFee,
        status: updated.status,
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update profile" }, { status: 500 });
  }
}
