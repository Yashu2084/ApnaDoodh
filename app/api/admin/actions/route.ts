import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { updateUser, updateProduct, updateReviewStatus, addAuditLog, updateDeliveryStatus } from "@/lib/db";
import { applyCorsHeaders } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    const { type, targetId, status } = await req.json();

    if (!type || !targetId || status === undefined) {
      const res = NextResponse.json({ error: "Missing required parameters: type, targetId, status" }, { status: 400 });
      return applyCorsHeaders(req, res);
    }

    switch (type) {
      case "FARMER_KYC":
        await updateUser(targetId, { kycStatus: status });
        // 1. Audit Log Action
        await addAuditLog(
          "Farmer KYC Update", 
          session.id, 
          session.name, 
          `Updated KYC status for farmer ID ${targetId} to: ${status}`
        );
        break;

      case "CUSTOMER_STATUS":
        await updateUser(targetId, { status: status });
        // 2. Audit Log Action
        await addAuditLog(
          "User Block/Unblock", 
          session.id, 
          session.name, 
          `Updated status of user ID ${targetId} to: ${status}`
        );
        break;

      case "DELIVERY_STATUS":
        await updateDeliveryStatus(targetId, status);
        // 3. Audit Log Action
        await addAuditLog(
          "Delivery Status Update", 
          session.id, 
          session.name, 
          `Updated delivery drop ${targetId} status to: ${status}`
        );
        break;

      case "PRODUCT_FLAG":
        await updateProduct(targetId, { status: status });
        // 3. Audit Log Action
        await addAuditLog(
          "Product Flagging", 
          session.id, 
          session.name, 
          `Updated flag status of product ID ${targetId} to: ${status}`
        );
        break;

      case "REVIEW_STATUS":
        await updateReviewStatus(targetId, status);
        // 4. Audit Log Action
        await addAuditLog(
          "Review Moderation", 
          session.id, 
          session.name, 
          `Moderated review ID ${targetId} to: ${status}`
        );
        break;

      default:
        const errRes = NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        return applyCorsHeaders(req, errRes);
    }

    const res = NextResponse.json({
      success: true,
      message: `Admin action '${type}' completed successfully`
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Admin action failed" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      const res = NextResponse.json({ error: "Unauthorized. Admin permissions required." }, { status: 403 });
      return applyCorsHeaders(req, res);
    }

    // Helper GET route to fetch all users, products, reviews for Admin Console
    const { getUsers, getProducts, getReviews } = await import("@/lib/db");
    const usersList = await getUsers();
    const productsList = await getProducts();
    const reviewsList = await getReviews();

    const farmers = usersList.filter(u => u.role === "FARMER");
    const customers = usersList.filter(u => u.role === "CUSTOMER");

    const res = NextResponse.json({
      success: true,
      farmers,
      customers,
      products: productsList,
      reviews: reviewsList
    });
    return applyCorsHeaders(req, res);
  } catch (e: any) {
    const res = NextResponse.json({ error: e.message || "Failed to load audit lists" }, { status: 500 });
    return applyCorsHeaders(req, res);
  }
}

export async function OPTIONS(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }));
}
