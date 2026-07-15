import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDeliveries, updateDeliveryStatus, getUsers, updateUser, addTransaction } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deliveries = await getDeliveries();
    const delivery = deliveries.find(d => d.id === id);

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    // Authorization checks
    if (session.role === "CUSTOMER" && delivery.customerId !== session.id) {
      return NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
    }
    if (session.role === "FARMER" && delivery.farmerId !== session.id) {
      return NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
    }

    // Normalizing status values
    let targetStatus: "Delivered" | "Scheduled" | "Paused" | "Skipped" = "Scheduled";
    if (status === "Delivered" || status === "Completed") {
      targetStatus = "Delivered";

      // If a delivery is fulfilled, perform the wallet debit and transaction tracking (if not already debited)
      // Wait, in ApnaDoodh, the prepaid wallet is debited when delivery is fulfilled or on night run.
      // Let's perform the debit if marking as Delivered!
      if (delivery.status !== "Delivered") {
        const users = await getUsers();
        const customer = users.find(u => u.id === delivery.customerId);
        if (customer) {
          const currentBalance = customer.walletBalance || 0;
          const price = delivery.price;
          const newBalance = Math.max(0, currentBalance - price);
          
          await updateUser(customer.id, { walletBalance: newBalance });
          await addTransaction({
            userId: customer.id,
            amount: price,
            type: "DEBIT",
            description: `Debit: Delivered ${delivery.product}`
          });
        }
      }
    } else if (status === "Skipped" || status === "Cancelled") {
      targetStatus = "Skipped";
    } else if (status === "Scheduled") {
      targetStatus = "Scheduled";
    } else if (status === "Paused") {
      targetStatus = "Paused";
    } else {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateDeliveryStatus(id, targetStatus);

    return NextResponse.json({ success: true, delivery: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update delivery status" }, { status: 500 });
  }
}
