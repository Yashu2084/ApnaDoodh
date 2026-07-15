import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { UserRepository } from "@/lib/repositories/user.repository";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { redisCache } from "@/lib/redis";
import { sanitizeInput } from "@/lib/security";

const userRepo = new UserRepository();
const productRepo = new ProductRepository();

// Seeding helper to generate rich specs for dynamically added products
const defaultProductDetails: Record<string, any> = {
  milk: {
    nutrition: [
      { label: "Energy", value: "62 kcal" },
      { label: "Fat", value: "3.6 - 4.2 g" },
      { label: "Protein (A2 Beta-Casein)", value: "3.2 g" },
      { label: "Calcium", value: "120 mg" },
      { label: "Carbohydrates", value: "4.8 g" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "4.2%", standard: "Min 3.5%", status: "Passed" },
      { parameter: "Solids-Not-Fat (SNF)", value: "8.75%", standard: "Min 8.5%", status: "Passed" },
      { parameter: "Pesticides & Antibiotics", value: "0.00 ppb", standard: "0.00 ppb (Zero tolerance)", status: "Ideal" },
      { parameter: "Somatic Cell Count (SCC)", value: "110k cells/ml", standard: "Under 200k (Elite Clean)", status: "Ideal" },
    ],
    deliveryInfo: "Delivered daily between 5:30 AM and 7:00 AM by our cold carrier logistics fleet.",
    faqs: [
      { q: "What is A2 beta-casein?", a: "It is a natural milk protein matching the structural profile of human breast milk, making it extremely digestible and reducing stomach inflammation compared to regular A1 milk." },
      { q: "How do you maintain the cold chain?", a: "From milking to bottling to doorstep drops, the milk temperature is logged and monitored constantly under 4°C using refrigerated delivery boxes." }
    ]
  },
  ghee: {
    nutrition: [
      { label: "Energy", value: "897 kcal" },
      { label: "Fat", value: "99.8 g" },
      { label: "Saturated Fat", value: "62 g" },
      { label: "Vitamin A", value: "300 mcg" },
    ],
    purityLab: [
      { parameter: "Moisture Content", value: "0.15%", standard: "Max 0.3%", status: "Passed" },
      { parameter: "Free Fatty Acids", value: "0.25%", standard: "Max 0.5%", status: "Passed" },
      { parameter: "Adulteration / Vegetable Oil", value: "Negative", standard: "Negative", status: "Ideal" },
    ],
    deliveryInfo: "Delivered next morning before 7:00 AM.",
    faqs: [
      { q: "What is the Bilona method?", a: "It is the traditional process where milk is boiled, turned into curd, and curd is churned to butter, which is then heated to get ghee." }
    ]
  },
  butter: {
    nutrition: [
      { label: "Energy", value: "717 kcal" },
      { label: "Fat", value: "81 g" },
      { label: "Moisture", value: "16 g" },
      { label: "Calcium", value: "24 mg" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "81.5%", standard: "Min 80%", status: "Passed" },
      { parameter: "Preservatives", value: "Negative", standard: "Zero", status: "Ideal" },
    ],
    deliveryInfo: "Delivered cold with your morning milk drops.",
    faqs: [
      { q: "Is this butter salted?", a: "No, this is fresh, unsalted country white butter churned from sweet cream." }
    ]
  },
  paneer: {
    nutrition: [
      { label: "Energy", value: "265 kcal" },
      { label: "Fat", value: "20.8 g" },
      { label: "Protein", value: "18.3 g" },
      { label: "Calcium", value: "208 mg" },
      { label: "Moisture Content", value: "52%" },
    ],
    purityLab: [
      { parameter: "Starch & Adulteration", value: "Negative", standard: "Negative", status: "Ideal" },
      { parameter: "Fat on Dry Matter", value: "51%", standard: "Min 50%", status: "Passed" },
      { parameter: "Coliform Bacteria Count", value: "0 CFU/g", standard: "Zero", status: "Ideal" },
    ],
    deliveryInfo: "Delivered fresh alongside morning milk drops. Packaged in vacuum-sealed food-grade packs.",
    faqs: [
      { q: "How long can I store this paneer?", a: "Since we do not add preservatives, we recommend consuming it within 3 days. Store in ice cold water in a refrigerator." }
    ]
  },
  curd: {
    nutrition: [
      { label: "Energy", value: "60 kcal" },
      { label: "Fat", value: "3.2 g" },
      { label: "Protein", value: "3.1 g" },
      { label: "Calcium", value: "110 mg" },
    ],
    purityLab: [
      { parameter: "Active Probiotics", value: "Present", standard: "Lactobacillus strains", status: "Ideal" },
      { parameter: "Preservatives & Starch", value: "Negative", standard: "Negative", status: "Ideal" },
      { parameter: "Whey Separation", value: "Under 2%", standard: "Under 5%", status: "Passed" },
    ],
    deliveryInfo: "Delivered cold before 7:00 AM. Kept under 4°C during transit.",
    faqs: [
      { q: "Why is it not sour?", a: "We control the incubation temperature precisely to ensure a balanced, naturally sweet flavor profile before refrigeration stops fermentation." }
    ]
  }
};

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const product = await productRepo.getById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const farmer = await userRepo.getById(product.farmerId);

    // Get specs based on category
    const catKey = product.category.toLowerCase();
    const specs = defaultProductDetails[catKey] || defaultProductDetails["milk"];

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        sellerName: farmer?.storeName || farmer?.name || "Local Farmer",
        sellerId: product.farmerId,
        nutrition: specs.nutrition,
        purityLab: specs.purityLab,
        deliveryInfo: specs.deliveryInfo,
        faqs: specs.faqs,
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch product details" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await productRepo.getById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Owner or admin only
    if (product.farmerId !== session.id && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
    }

    // Input sanitization (Part 9.4)
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const updated = await productRepo.update(id, body);

    // Invalidate Cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    return NextResponse.json({ success: true, product: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await productRepo.getById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Owner or admin only
    if (product.farmerId !== session.id && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Ownership required." }, { status: 403 });
    }

    await productRepo.delete(id);

    // Invalidate Cache (Part 10.2)
    await redisCache.invalidatePattern("products:*");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete product" }, { status: 500 });
  }
}
