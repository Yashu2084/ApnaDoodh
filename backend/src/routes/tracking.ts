import { Router } from "express";
import { getTrackingLocation, updateTrackingLocation } from "../lib/db";
import { sanitizeInput } from "../lib/security";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const tracking = await getTrackingLocation();
    return res.json({ success: true, tracking });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve tracking location" });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const { lat, lng } = sanitizeInput(req.body);
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "lat and lng are required parameters" });
    }
    const tracking = await updateTrackingLocation(parseFloat(lat), parseFloat(lng));
    return res.json({ success: true, tracking });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to update tracking location" });
  }
});

export default router;
