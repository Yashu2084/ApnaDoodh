import { Router } from "express";
import { DeliveryRepository } from "../lib/repositories/delivery.repository";
import { sanitizeInput } from "../lib/security";
import { verifyJWT } from "../lib/jwt";
import { getUsers } from "../lib/db";

const router = Router();
const deliveryRepo = new DeliveryRepository();

async function getUserIdFromSession(req: any): Promise<string | null> {
  const token = req.cookies?.apnadoodh_token;
  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload ? payload.id : null;
}

router.get("/", async (req: any, res: any) => {
  try {
    let customerId = req.query.customerId as string | undefined;
    const farmerId = req.query.farmerId as string | undefined;

    if (!customerId) {
      customerId = (await getUserIdFromSession(req)) || undefined;
    }

    let list = await deliveryRepo.getAll();
    if (customerId) {
      list = list.filter(d => d.customerId === customerId);
    }
    if (farmerId) {
      list = list.filter(d => d.farmerId === farmerId);
    }

    return res.json({ success: true, deliveries: list });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to fetch deliveries schedule" });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    
    // Check if toggle subscription pause call
    if (body.isPaused !== undefined) {
      let customerId = body.customerId;
      if (!customerId) {
        customerId = await getUserIdFromSession(req);
      }
      if (!customerId) {
        return res.status(400).json({ error: "Authentication required to pause subscription" });
      }
      await deliveryRepo.pauseDeliveries(customerId, body.isPaused);
      return res.json({ success: true, message: `Deliveries successfully ${body.isPaused ? "paused" : "resumed"}` });
    }

    // Otherwise, create a new delivery item
    let { customerId, customerName, address, date, product, quantity, price, farmerId } = body;

    if (!customerId) {
      customerId = await getUserIdFromSession(req);
    }

    if (!customerId) {
      return res.status(400).json({ error: "Authentication required" });
    }

    if (!customerName || !address) {
      const users = await getUsers();
      const user = users.find(u => u.id === customerId);
      if (user) {
        customerName = customerName || user.name;
        address = address || user.location || "";
      }
    }

    if (!customerName || !address || !date || !product || !quantity || !price || !farmerId) {
      return res.status(400).json({ error: "All required fields must be supplied" });
    }

    const delivery = await deliveryRepo.create({
      customerId,
      customerName,
      address,
      date,
      product,
      quantity,
      price: parseFloat(price),
      status: "Scheduled",
      farmerId,
      skippedDates: [],
    });

    return res.status(201).json({ success: true, delivery });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to schedule delivery" });
  }
});

const handleStatusUpdate = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = sanitizeInput(req.body);
    
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    const updated = await deliveryRepo.updateStatus(id, status);
    return res.json({ success: true, delivery: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to update delivery status" });
  }
};

router.put("/:id", handleStatusUpdate);
router.patch("/:id", handleStatusUpdate);

router.post("/pause", async (req: any, res: any) => {
  try {
    const { customerId, isPaused } = sanitizeInput(req.body);
    let targetCustomer = customerId;
    if (!targetCustomer) {
      targetCustomer = await getUserIdFromSession(req);
    }
    if (!targetCustomer || isPaused === undefined) {
      return res.status(400).json({ error: "customerId and isPaused are required" });
    }
    await deliveryRepo.pauseDeliveries(targetCustomer, isPaused);
    return res.json({ success: true, message: `Deliveries successfully ${isPaused ? "paused" : "resumed"}` });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to toggle delivery status" });
  }
});

router.post("/:id/skip", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { date } = sanitizeInput(req.body);
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required to skip drop" });
    }
    const updated = await deliveryRepo.skipDate(id, date);
    return res.json({ success: true, delivery: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to register skip date" });
  }
});

router.post("/:id/temperature", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { temperature } = req.body;
    if (temperature === undefined) {
      return res.status(400).json({ error: "Temperature value required" });
    }
    const updated = await deliveryRepo.logTemperature(id, parseFloat(temperature));
    return res.json({ success: true, delivery: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to log temperature" });
  }
});

export default router;
