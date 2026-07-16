import { Router } from "express";
import { ProductRepository } from "../lib/repositories/product.repository";
import { sanitizeInput } from "../lib/security";
import { uploadProductImage } from "../lib/services";

const router = Router();
const productRepo = new ProductRepository();

// Local memory cache fallback for redis
const memoryCache = new Map<string, { data: any; expiry: number }>();
function getCache(key: string): any | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return cached.data;
}
function setCache(key: string, data: any, ttlSeconds = 300) {
  memoryCache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}
function clearCache() {
  memoryCache.clear();
}

router.get("/", async (req: any, res: any) => {
  try {
    const farmerId = req.query.farmerId as string | undefined;
    const category = req.query.category as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    // Check cache first for general list (no farmerId specific query)
    const cacheKey = `products:all:${category || "All"}:${limit || "no"}:${offset || "no"}`;
    if (!farmerId) {
      const cached = getCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }
    }

    const { products, total } = await productRepo.getAll({
      farmerId,
      category,
      limit,
      offset,
      status: "Active",
    });

    const result = { success: true, products, total };

    if (!farmerId) {
      setCache(cacheKey, result, 120); // 2 mins cache
    }

    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to fetch products" });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product = await productRepo.getById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true, product });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to fetch product details" });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    const { name, price, unit, description, imageBase64, imageName, stock, category, farmerId, badge } = body;

    if (!name || !price || !unit || !description || !stock || !category || !farmerId) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    let imageUrl = "/apnadoodh_cow_milk.webp"; // fallback
    if (imageBase64 && imageName) {
      imageUrl = await uploadProductImage(imageBase64, imageName);
    }

    const product = await productRepo.create({
      name,
      price: parseFloat(price),
      unit,
      description,
      image: imageUrl,
      stock: parseInt(stock),
      category,
      farmerId,
      badge: badge || null,
    });

    clearCache();
    return res.status(201).json({ success: true, product });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to create product" });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const body = sanitizeInput(req.body);
    const { imageBase64, imageName, ...updates } = body;

    const existing = await productRepo.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (imageBase64 && imageName) {
      updates.image = await uploadProductImage(imageBase64, imageName);
    }

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock);

    const updated = await productRepo.update(id, updates);
    clearCache();
    return res.json({ success: true, product: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to update product" });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const success = await productRepo.delete(id);
    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }
    clearCache();
    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to delete product" });
  }
});

export default router;
