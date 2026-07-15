import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addTransaction } from "@/lib/db";
import { UserRepository } from "@/lib/repositories/user.repository";
import { verifyJWT } from "@/lib/jwt";
import { processPayment, generateAndUploadInvoice, sendEmail } from "@/lib/services";
import { applyCorsHeaders, isRateLimited, sanitizeInput } from "@/lib/security";

const userRepo = new UserRepository();

export async function POST(req: NextRequest) {
  try {
    // 1. IP Sliding Window Rate Limit Enforcement (Part 9.3)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limited = await isRateLimited(ip, "wallet_topup", 5, 60); // Max 5 req/min
    if (limited) {
      const res = NextResponse.json(
        { error: "Too many top-up attempts. Please wait 1 minute." }, 
        { status: 429 }
      );
      return applyCorsHeaders(req, res);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      const res = NextResponse.json({ error: "Unauthorized. Customer permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // 2. Input Sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { amount, paymentMethodId } = body;
    
    const topupVal = parseFloat(amount);

    if (isNaN(topupVal) || topupVal <= 0) {
      const res = NextResponse.json({ error: "Invalid top-up amount" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    if (!paymentMethodId) {
      const res = NextResponse.json({ error: "Payment method ID is required" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // 3. Process payment (Part 8.1)
    const paymentResult = await processPayment(topupVal, paymentMethodId);
    if (!paymentResult.success) {
      const res = NextResponse.json({ error: paymentResult.message || "Payment processing failed" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // 4. Fetch customer user details via Repository (Part 11.2)
    const user = await userRepo.getById(session.id);
    if (!user) {
      const res = NextResponse.json({ error: "User profile not found" }, { status: 404 });
      return applyCorsHeaders(req, res);
    }

    const currentBalance = user.walletBalance || 0.0;
    const newBalance = currentBalance + topupVal;

    // 5. Log ledger credit transaction
    const tx = await addTransaction({
      userId: session.id,
      amount: topupVal,
      type: "CREDIT",
      description: `Wallet Top-up (${paymentResult.message})`
    });

    // 6. Update customer wallet balance in database via Repository (Part 11.2)
    await userRepo.update(session.id, { walletBalance: newBalance });

    // 7. Generate and upload Invoice PDF (Part 7.3)
    const invoiceUrl = await generateAndUploadInvoice(
      session.id,
      user.name,
      topupVal,
      tx.id
    );

    // 8. Dispatch Invoice Email (Part 8.3)
    const invoiceHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a5276;">ApnaDoodh Invoice Receipt</h2>
        <p>Dear ${user.name},</p>
        <p>Your top-up of <strong>INR ${topupVal.toFixed(2)}</strong> has been successfully processed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${tx.id}</p>
          <p style="margin: 5px 0;"><strong>Amount Paid:</strong> INR ${topupVal.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>New Balance:</strong> INR ${newBalance.toFixed(2)}</p>
        </div>
        <p>You can view and download your official invoice receipt here:</p>
        <p><a href="${invoiceUrl}" style="background-color: #1a5276; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">View Invoice PDF</a></p>
        <br/>
        <p>Thank you for supporting local dairy farmers!</p>
        <p>Best Regards,<br/><strong>The ApnaDoodh Team</strong></p>
      </div>
    `;
    await sendEmail(user.email, "Invoice Receipt: ApnaDoodh Top-up", invoiceHtml);

    const res = NextResponse.json({
      success: true,
      balance: newBalance,
      invoiceUrl,
      message: "Wallet topped up successfully",
      transactionId: tx.id
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Top-up failed" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
