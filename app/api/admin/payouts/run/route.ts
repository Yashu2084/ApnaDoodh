import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { getDeliveries, getPlatformSettings, getUsers, addTransaction, addAuditLog } from "@/lib/db";
import { transferPayoutToFarmer } from "@/lib/services";
import { applyCorsHeaders } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin credentials required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // 1. Gather all delivered orders
    const deliveries = await getDeliveries();
    const deliveredDrops = deliveries.filter(d => d.status === "Delivered");

    if (deliveredDrops.length === 0) {
      const res = NextResponse.json({ success: true, message: "No delivered orders found for payout settlement.", payouts: [] });
      return applyCorsHeaders(req, res);
    }

    // 2. Fetch platform commission rate settings
    const settings = await getPlatformSettings();
    const commissionPct = settings.commissionRate || 10.0;

    // Group deliveries by farmer
    const farmerTotals: Record<string, { gross: number; storeName: string }> = {};
    const users = await getUsers();

    deliveredDrops.forEach(drop => {
      if (!farmerTotals[drop.farmerId]) {
        const farmerUser = users.find(u => u.id === drop.farmerId);
        farmerTotals[drop.farmerId] = {
          gross: 0,
          storeName: farmerUser?.storeName || farmerUser?.name || "Farmer Store"
        };
      }
      farmerTotals[drop.farmerId].gross += drop.price;
    });

    // 3. Process payout releases
    const payoutsProcessed = [];
    for (const farmerId in farmerTotals) {
      const info = farmerTotals[farmerId];
      const commission = info.gross * (commissionPct / 100);
      const netPayout = info.gross - commission;

      if (netPayout <= 0) continue;

      // release transfer
      const result = await transferPayoutToFarmer(farmerId, info.storeName, netPayout);
      if (result.success) {
        // Log ledger debit transaction for payout release
        await addTransaction({
          userId: farmerId,
          amount: netPayout,
          type: "DEBIT",
          description: `Weekly Settlement Payout Run (${result.payoutId})`
        });

        payoutsProcessed.push({
          farmerId,
          storeName: info.storeName,
          grossSales: info.gross,
          commissionDeducted: parseFloat(commission.toFixed(2)),
          netPayoutReleased: parseFloat(netPayout.toFixed(2)),
          payoutId: result.payoutId
        });
      }
    }

    // 4. Write admin audit log
    await addAuditLog(
      "Farmer Payout Run",
      session.id,
      session.name,
      `Triggered weekly settlement payouts. Total net payouts released: INR ${payoutsProcessed.reduce((acc, curr) => acc + curr.netPayoutReleased, 0).toFixed(2)} across ${payoutsProcessed.length} farmers.`
    );

    const res = NextResponse.json({
      success: true,
      message: "Weekly payouts settled successfully",
      commissionRateCharged: `${commissionPct}%`,
      payouts: payoutsProcessed
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to execute weekly payouts" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
