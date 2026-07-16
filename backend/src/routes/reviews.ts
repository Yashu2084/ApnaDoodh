import { Router } from "express";
import { ReviewRepository } from "../lib/repositories/review.repository";
import { sanitizeInput } from "../lib/security";
import { verifyJWT } from "../lib/jwt";
import { getUsers } from "../lib/db";

const router = Router();
const reviewRepo = new ReviewRepository();

async function getUserIdFromSession(req: any): Promise<string | null> {
  const token = req.cookies?.apnadoodh_token;
  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload ? payload.id : null;
}

router.get("/", async (req: any, res: any) => {
  try {
    const farmerId = req.query.farmerId as string | undefined;
    const status = req.query.status as any || undefined;

    const { reviews } = await reviewRepo.getAll({
      farmerId,
      status,
    });

    return res.json({ success: true, reviews });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    let { customerId, customerName, farmerId, farmerName, rating, text, product } = body;

    if (!customerId) {
      customerId = await getUserIdFromSession(req);
    }

    if (!customerId) {
      return res.status(400).json({ error: "Authentication required to submit review" });
    }

    if (!customerName) {
      const users = await getUsers();
      const user = users.find(u => u.id === customerId);
      if (user) {
        customerName = user.name;
      }
    }

    if (!customerId || !customerName || !farmerId || !farmerName || !rating || !text || !product) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const review = await reviewRepo.create({
      customerId,
      customerName,
      farmerId,
      farmerName,
      rating: parseInt(rating),
      text,
      product,
    });

    return res.status(201).json({ success: true, review });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to submit review" });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = sanitizeInput(req.body);
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    const updated = await reviewRepo.updateStatus(id, status);
    return res.json({ success: true, review: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to update review status" });
  }
});

export default router;
