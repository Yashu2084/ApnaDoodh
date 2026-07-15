import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateReviewStatus, getReviews } from "@/lib/db";
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
    if (!status || !["Approved", "Flagged", "Removed"].includes(status)) {
      return NextResponse.json({ error: "Invalid or missing status parameter" }, { status: 400 });
    }

    // Verify review exists
    const reviews = await getReviews();
    const review = reviews.find(r => r.id === id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updated = await updateReviewStatus(id, status);

    return NextResponse.json({
      success: true,
      message: `Review moderation status updated to ${status}`,
      review: updated
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update review status" }, { status: 500 });
  }
}
