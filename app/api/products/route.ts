import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { redisCache } from "@/lib/redis";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const productRepo = new ProductRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const farmerId = searchParams.get("farmerId");
    
    // Pagination params (Part 10.3)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;
    const isAdmin = session?.role === "SUPER_ADMIN";

    // 1. Try fetching from Redis Cache (Part 10.2)
    const cacheKey = `products:cat_${category || "all"}:farm_${farmerId || "all"}:lim_${limit ?? "all"}:off_${offset ?? "all"}:admin_${isAdmin}`;
    const cachedData = await redisCache.get(cacheKey);
    if (cachedData) {
      const res = NextResponse.json({ 
        success: true, 
        products: cachedData.products, 
        total: cachedData.total,
        fromCache: true 
      });
      return applyCorsHeaders(req, res);
    }

    // 2. Fetch using Repository Pattern (Part 11.2)
    const { products, total } = await productRepo.getAll({
      limit,
      offset,
      category: category || undefined,
      farmerId: farmerId || undefined,
      status: isAdmin ? undefined : "Active" // Non-admins only see active
    });

    // 3. Cache result in Redis for 5 minutes
    await redisCache.set(cacheKey, { products, total }, 300);

    const res = NextResponse.json({ success: true, products, total });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to fetch products" }, { status: 500 });
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

    // Sanitize Request Body (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const { name, price, unit, description, image, stock, category } = body;

    if (!name || !price || !unit || !description || stock === undefined || !category) {
      const res = NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    const { uploadProductImage } = await import("@/lib/services");
    let imageUrl = "/apnadoodh_cow_milk.webp";
    if (image) {
      imageUrl = await uploadProductImage(image, `${name.toLowerCase().replace(/\s+/g, "_")}.png`);
    }

    // Add using Repository
    const newProduct = await productRepo.create({
      name,
      price: parseFloat(price),
      unit,
      description,
      image: imageUrl,
      stock: parseInt(stock),
      category,
      farmerId: session.id,
    });

    // 4. Invalidate Redis Product Catalog Cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    const res = NextResponse.json({ success: true, product: newProduct });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to add product" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
