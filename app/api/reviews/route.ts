import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { UserRepository } from "@/lib/repositories/user.repository";
import { ReviewRepository } from "@/lib/repositories/review.repository";
import { applyCorsHeaders, sanitizeInput } from "@/lib/security";

const userRepo = new UserRepository();
const reviewRepo = new ReviewRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const farmerId = searchParams.get("farmerId");
    
    // Pagination params (Part 10.3)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;
    const isAdmin = session?.role === "SUPER_ADMIN";

    // Fetch using Repository
    const { reviews, total } = await reviewRepo.getAll({
      limit,
      offset,
      farmerId: farmerId || undefined,
      status: isAdmin ? undefined : "Approved" // Regular users only see Approved reviews
    });

    const res = NextResponse.json({ success: true, reviews, total });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to load reviews" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "CUSTOMER") {
      const res = NextResponse.json({ error: "Unauthorized. Customer account required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Input sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const { farmerName, rating, text, product } = body;

    if (!farmerName || !rating || !text) {
      const res = NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    const users = await userRepo.getAll();
    const farmer = users.find(u => u.role === "FARMER" && u.storeName === farmerName);

    // Create using Repository
    const newReview = await reviewRepo.create({
      customerId: session.id,
      customerName: session.name,
      farmerId: farmer?.id || "farmer-01",
      farmerName,
      rating: parseInt(rating),
      text,
      product: product || "A2 Cow Milk"
    });

    const res = NextResponse.json({ success: true, review: newReview });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to submit review" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
