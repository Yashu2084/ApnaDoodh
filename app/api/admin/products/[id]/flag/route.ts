import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProduct, getProducts } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !["Flagged", "Active"].includes(status)) {
      return NextResponse.json({ error: "Invalid or missing status parameter" }, { status: 400 });
    }

    // Verify product exists
    const products = await getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product listing not found" }, { status: 404 });
    }

    const updated = await updateProduct(id, { status });

    return NextResponse.json({
      success: true,
      message: `Product flag status updated to ${status}`,
      product: updated
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update product status" }, { status: 500 });
  }
}
