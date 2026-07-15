import { NextRequest, NextResponse } from "next/server";
import { getDeliveries, getUsers, addDelivery, updateUser, addTransaction } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetDate = body.date || new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric"
    }); // e.g. "June 26, 2026"

    const users = await getUsers();
    const deliveries = await getDeliveries();
    
    // Settle pending subscriptions for active customers
    const customers = users.filter(u => u.role === "CUSTOMER");
    const newlyScheduled = [];
    const lowBalanceUsers = [];

    for (const customer of customers) {
      // Check if they already have a delivery scheduled for this date
      const alreadyScheduled = deliveries.some(d => d.customerId === customer.id && d.date === targetDate);
      if (alreadyScheduled) continue;

      // Simulate a standing order for A2 Cow Milk (1 Litre, ₹99) from Govardhan A2 Dairy (farmer-01)
      const standingOrderPrice = 99;
      const standingProductName = "A2 Cow Milk";
      const standingQty = "1 Litre";
      const farmerId = "farmer-01";

      // If customer balance is lower than standing order price, we pause their drops
      const currentBalance = customer.walletBalance || 0;
      if (currentBalance < standingOrderPrice) {
        lowBalanceUsers.push(customer.email);
        continue;
      }

      // Generate a new scheduled drop
      const newDrop = await addDelivery({
        customerId: customer.id,
        customerName: customer.name,
        address: customer.location || "Sector 56, Gurugram",
        date: targetDate,
        product: standingProductName,
        quantity: standingQty,
        price: standingOrderPrice,
        status: "Scheduled",
        farmerId: farmerId
      });

      newlyScheduled.push(newDrop);
    }

    return NextResponse.json({
      success: true,
      message: `Logistics run completed for ${targetDate}`,
      scheduledDropsCount: newlyScheduled.length,
      scheduledDrops: newlyScheduled,
      lowBalanceWarnings: lowBalanceUsers
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Scheduler run failed" }, { status: 500 });
  }
}
