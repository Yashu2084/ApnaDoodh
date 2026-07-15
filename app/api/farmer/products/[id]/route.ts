import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { redisCache } from "@/lib/redis";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const productRepo = new ProductRepository();

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "FARMER") {
      const res = NextResponse.json({ error: "Unauthorized. Farmer permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Check if product exists via Repository
    const product = await productRepo.getById(id);

    if (!product) {
      const res = NextResponse.json({ error: "Product not found" }, { status: 404 });
      return applyCorsHeaders(req, res);
    }

    if (product.farmerId !== session.id) {
      const res = NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Input sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);
    const { name, price, unit, description, stock, category } = body;

    // Filter updates
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = parseFloat(price);
    if (unit !== undefined) updates.unit = unit;
    if (description !== undefined) updates.description = description;
    if (stock !== undefined) updates.stock = parseInt(stock);
    if (category !== undefined) updates.category = category;

    const updatedProduct = await productRepo.update(id, updates);

    // Invalidate Redis product cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    const res = NextResponse.json({ success: true, product: updatedProduct });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to update product" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "FARMER") {
      const res = NextResponse.json({ error: "Unauthorized. Farmer permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Check if product exists via Repository
    const product = await productRepo.getById(id);

    if (!product) {
      const res = NextResponse.json({ error: "Product not found" }, { status: 404 });
      return applyCorsHeaders(req, res);
    }

    if (product.farmerId !== session.id) {
      const res = NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    await productRepo.delete(id);

    // Invalidate Redis product cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    const res = NextResponse.json({ success: true, message: "Product deleted successfully" });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to delete product" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
