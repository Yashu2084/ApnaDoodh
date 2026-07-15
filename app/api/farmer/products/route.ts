import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { uploadProductImage } from "@/lib/services";
import { redisCache } from "@/lib/redis";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const productRepo = new ProductRepository();

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "FARMER") {
      const res = NextResponse.json({ error: "Unauthorized. Farmer permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Fetch using Repository Pattern (Part 11.2)
    const { products } = await productRepo.getAll({
      farmerId: session.id
    });

    const res = NextResponse.json({ success: true, products });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to load products" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "FARMER") {
      const res = NextResponse.json({ error: "Unauthorized. Farmer permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Input sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { name, price, unit, description, image, stock, category } = body;

    if (!name || !price || !unit || !description || stock === undefined || !category) {
      const res = NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    // 1. Process and optimize product image (Part 7.1)
    let imageUrl = "/apnadoodh_cow_milk.webp";
    if (image) {
      imageUrl = await uploadProductImage(image, `${name.toLowerCase().replace(/\s+/g, "_")}.png`);
    }

    // 2. Add product via Repository (Part 11.2)
    const product = await productRepo.create({
      name,
      price: parseFloat(price),
      unit,
      description,
      image: imageUrl,
      stock: parseInt(stock),
      category,
      farmerId: session.id
    });

    // 3. Invalidate Redis Product Cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    const res = NextResponse.json({ success: true, product });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to submit product" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
