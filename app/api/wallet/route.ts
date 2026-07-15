import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers, updateUser, getTransactions, addTransaction } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer account required." }, { status: 403 });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === session.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transactions = await getTransactions();
    const userTx = transactions.filter(t => t.userId === session.id);

    return NextResponse.json({
      success: true,
      balance: user.walletBalance || 0.0,
      transactions: userTx.reverse() // latest transactions first
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load wallet ledger" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized. Customer account required." }, { status: 403 });
    }

    const { amount } = await req.json();
    const topupVal = parseFloat(amount);

    if (isNaN(topupVal) || topupVal <= 0) {
      return NextResponse.json({ error: "Invalid top-up amount" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === session.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = user.walletBalance || 0.0;
    const newBalance = currentBalance + topupVal;

    // Update user wallet balance
    await updateUser(session.id, { walletBalance: newBalance });

    // Log transaction
    await addTransaction({
      userId: session.id,
      amount: topupVal,
      type: "CREDIT",
      description: "Wallet UPI Top-up"
    });

    return NextResponse.json({
      success: true,
      balance: newBalance,
      message: "Wallet topped up successfully"
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Top-up failed" }, { status: 500 });
  }
}
