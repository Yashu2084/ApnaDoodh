import { Router } from "express";
import { getTransactions, addTransaction, updateUser, getUsers } from "../lib/db";
import { processPayment, generateAndUploadInvoice } from "../lib/services";
import { sanitizeInput } from "../lib/security";
import { verifyJWT } from "../lib/jwt";

const router = Router();

async function getUserIdFromSession(req: any): Promise<string | null> {
  const token = req.cookies?.apnadoodh_token;
  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload ? payload.id : null;
}

router.get("/", async (req: any, res: any) => {
  try {
    let userId = req.query.userId as string | undefined;
    if (!userId) {
      userId = (await getUserIdFromSession(req)) || undefined;
    }

    if (!userId) {
      return res.status(400).json({ error: "userId parameter is required or user must be logged in" });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allTx = await getTransactions();
    const userTx = allTx.filter(t => t.userId === userId);

    return res.json({
      success: true,
      balance: user.walletBalance || 0.0,
      transactions: userTx,
    });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve wallet information" });
  }
});

const handleTopUp = async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    let userId = body.userId;
    if (!userId) {
      userId = await getUserIdFromSession(req);
    }
    
    const amount = body.amount;
    const paymentMethodId = body.paymentMethodId || "mock_payment_method";

    if (!userId || !amount) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const amtFloat = parseFloat(amount);
    if (isNaN(amtFloat) || amtFloat <= 0) {
      return res.status(400).json({ error: "Invalid payment top-up amount" });
    }

    // 1. Process payment via Stripe/Razorpay
    const paymentResult = await processPayment(amtFloat, paymentMethodId);
    if (!paymentResult.success) {
      return res.status(400).json({ error: paymentResult.message });
    }

    // 2. Generate and upload Invoice PDF (S3/Local)
    const invoiceUrl = await generateAndUploadInvoice(
      user.id,
      user.name,
      amtFloat,
      paymentResult.transactionId
    );

    // 3. Record transaction and update user wallet balance
    const currentBal = user.walletBalance || 0.0;
    const newBal = currentBal + amtFloat;
    await updateUser(user.id, { walletBalance: newBal });

    const newTx = await addTransaction({
      userId: user.id,
      amount: amtFloat,
      type: "CREDIT",
      description: `Wallet top-up | Invoice: ${invoiceUrl}`,
    });

    return res.status(200).json({
      success: true,
      balance: newBal,
      transaction: newTx,
      invoiceUrl,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to process top-up transaction" });
  }
};

router.post("/", handleTopUp);
router.post("/topup", handleTopUp);

export default router;
