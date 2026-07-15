import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";
import { getKycPreSignedUrl } from "@/lib/services";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const usersList = await getUsers();
    const farmers = usersList.filter(u => u.role === "FARMER");

    // Dynamically generate 5-minute pre-signed S3 URLs for private files
    const enrichedFarmers = await Promise.all(
      farmers.map(async (farmer) => {
        let signedGovId = "";
        let signedFssai = "";
        
        if (farmer.kycGovIdUrl) {
          signedGovId = await getKycPreSignedUrl(farmer.kycGovIdUrl);
        }
        if (farmer.kycFssaiUrl) {
          signedFssai = await getKycPreSignedUrl(farmer.kycFssaiUrl);
        }

        return {
          ...farmer,
          kycGovIdUrl: signedGovId || farmer.kycGovIdUrl,
          kycFssaiUrl: signedFssai || farmer.kycFssaiUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      farmers: enrichedFarmers
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load farmers list" }, { status: 500 });
  }
}
