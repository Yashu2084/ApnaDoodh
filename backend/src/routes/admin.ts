import { Router } from "express";
import { 
  getUsers, 
  updateUser, 
  getAuditLogs, 
  addAuditLog, 
  getPlatformSettings, 
  updatePlatformSettings, 
  updateProduct, 
  updateReviewStatus,
  getDeliveries,
  addTransaction,
} from "../lib/db";
import { getKycPreSignedUrl, transferPayoutToFarmer, verifyMockPreSignedUrl } from "../lib/services";
import { sanitizeInput } from "../lib/security";
import path from "path";
import fs from "fs/promises";

const router = Router();

router.get("/farmers", async (req: any, res: any) => {
  try {
    const users = await getUsers();
    const farmers = users.filter(u => u.role === "FARMER");
    
    // Inject pre-signed document links if requested
    const farmersWithUrls = await Promise.all(
      farmers.map(async (f) => {
        const govIdUrl = f.kycGovIdUrl ? await getKycPreSignedUrl(f.kycGovIdUrl) : null;
        const fssaiUrl = f.kycFssaiUrl ? await getKycPreSignedUrl(f.kycFssaiUrl) : null;
        return {
          ...f,
          kycGovIdPreSignedUrl: govIdUrl,
          kycFssaiPreSignedUrl: fssaiUrl,
        };
      })
    );

    return res.json({ success: true, farmers: farmersWithUrls });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve farmer list" });
  }
});

router.post("/farmers/:id/kyc", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, remarks } = sanitizeInput(req.body);

    if (!status) {
      return res.status(400).json({ error: "KYC status parameter is required" });
    }

    const updated = await updateUser(id, { kycStatus: status as any });
    
    // Log audit trail
    await addAuditLog(
      "KYC_STATUS_UPDATE",
      "admin-01",
      "ApnaDoodh Admin",
      `Farmer ${id} KYC status updated to ${status}. Remarks: ${remarks || "None"}`
    );

    return res.json({ success: true, farmer: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to update farmer KYC status" });
  }
});

router.get("/actions", async (req: any, res: any) => {
  try {
    const logs = await getAuditLogs();
    const users = await getUsers();
    const customers = users.filter(u => u.role === "CUSTOMER");
    
    const { getProducts: dbGetProducts, getReviews: dbGetReviews } = require("../lib/db");
    const products = await dbGetProducts();
    const reviews = await dbGetReviews();

    return res.json({
      success: true,
      logs,
      customers,
      products,
      reviews
    });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve audit log listings" });
  }
});

router.post("/actions", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    if (body.type === "CUSTOMER_STATUS") {
      const { targetId, status } = body;
      if (!targetId || !status) {
        return res.status(400).json({ error: "targetId and status are required" });
      }
      const updated = await updateUser(targetId, { status: status as any });
      await addAuditLog(
        "CUSTOMER_STATUS_UPDATE",
        "admin-01",
        "ApnaDoodh Admin",
        `Customer ${targetId} status updated to ${status}`
      );
      return res.json({ success: true, customer: updated });
    }

    const { action, adminId, adminName, details } = body;
    if (!action || !adminId || !adminName || !details) {
      return res.status(400).json({ error: "Missing action details parameters" });
    }
    const log = await addAuditLog(action, adminId, adminName, details);
    return res.status(201).json({ success: true, log });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to record audit trail log" });
  }
});

router.get("/settings", async (req: any, res: any) => {
  try {
    const settings = await getPlatformSettings();
    return res.json({ success: true, settings });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve settings parameters" });
  }
});

router.post("/settings", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    const updated = await updatePlatformSettings(body);
    return res.json({ success: true, settings: updated });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to update platform settings" });
  }
});

router.post("/products/:id/flag", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = sanitizeInput(req.body); // e.g. "Flagged" or "Active"
    
    if (!status) {
      return res.status(400).json({ error: "Status flag is required" });
    }

    const updated = await updateProduct(id, { status: status as any });
    await addAuditLog(
      "PRODUCT_MODERATION",
      "admin-01",
      "ApnaDoodh Admin",
      `Product ${id} moderation status updated to ${status}`
    );

    return res.json({ success: true, product: updated });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to flag product" });
  }
});

router.post("/reviews/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { action } = sanitizeInput(req.body); // e.g. "Approved", "Flagged", "Removed"
    
    if (!action) {
      return res.status(400).json({ error: "Action parameter required" });
    }

    const updated = await updateReviewStatus(id, action as any);
    await addAuditLog(
      "REVIEW_MODERATION",
      "admin-01",
      "ApnaDoodh Admin",
      `Review ${id} moderated to status: ${action}`
    );

    return res.json({ success: true, review: updated });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to moderate review" });
  }
});

router.post("/payouts/run", async (req: any, res: any) => {
  try {
    const { farmerId } = sanitizeInput(req.body);
    if (!farmerId) {
      return res.status(400).json({ error: "farmerId parameter is required" });
    }

    const users = await getUsers();
    const farmer = users.find(u => u.id === farmerId && u.role === "FARMER");
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // 1. Calculate pending earnings from delivered drops
    const deliveries = await getDeliveries();
    const farmerDeliveries = deliveries.filter(d => d.farmerId === farmerId && d.status === "Delivered");
    
    // Calculate total delivered revenue
    const totalRevenue = farmerDeliveries.reduce((sum, d) => sum + d.price, 0);
    const commissionRate = (await getPlatformSettings()).commissionRate;
    const platformCommission = (totalRevenue * commissionRate) / 100;
    const payoutAmount = totalRevenue - platformCommission;

    if (payoutAmount <= 0) {
      return res.json({ success: true, amount: 0, message: "No pending earnings found for payout" });
    }

    // 2. Transfer payout via RazorpayX simulation
    const payoutResult = await transferPayoutToFarmer(
      farmerId,
      farmer.storeName || farmer.name,
      payoutAmount
    );

    if (!payoutResult.success) {
      return res.status(500).json({ error: payoutResult.message });
    }

    // 3. Log debit payout transaction
    await addTransaction({
      userId: farmerId,
      amount: -payoutAmount,
      type: "DEBIT",
      description: `Settled Payout Run | ID: ${payoutResult.payoutId} | Fee: INR ${platformCommission.toFixed(2)}`,
    });

    await addAuditLog(
      "PAYOUT_RUN",
      "admin-01",
      "ApnaDoodh Admin",
      `Payout of INR ${payoutAmount.toFixed(2)} transfer processed for farmer ${farmer.storeName || farmer.name} (${farmerId})`
    );

    return res.json({
      success: true,
      amount: payoutAmount,
      commission: platformCommission,
      payoutId: payoutResult.payoutId,
      message: payoutResult.message
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to process payouts run" });
  }
});

router.get("/kyc/view-doc", async (req: any, res: any) => {
  try {
    const documentKey = req.query.key as string;
    const expires = parseInt(req.query.expires as string);
    const signature = req.query.signature as string;

    if (!documentKey || !expires || !signature) {
      return res.status(400).send("Access denied. Invalid pre-signed URL parameter signature.");
    }

    const isValid = verifyMockPreSignedUrl(documentKey, expires, signature);
    if (!isValid) {
      return res.status(403).send("Pre-signed URL is expired or signature check failed.");
    }

    const docPath = path.join("C:\\Users\\MOL\\.gemini\\antigravity\\private_docs", documentKey);
    try {
      const data = await fs.readFile(docPath);
      res.setHeader("Content-Type", "application/pdf");
      return res.send(data);
    } catch {
      return res.status(404).send("Document not found on storage disk.");
    }
  } catch (e) {
    return res.status(500).send("Error reading secure PDF file");
  }
});

export default router;
