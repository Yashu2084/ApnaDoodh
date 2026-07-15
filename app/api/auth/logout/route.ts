import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteRefreshToken } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get("apnadoodh_refresh");

  if (refreshCookie) {
    await deleteRefreshToken(refreshCookie.value);
  }

  cookieStore.delete("apnadoodh_token");
  cookieStore.delete("apnadoodh_refresh");

  return NextResponse.json({ success: true });
}
