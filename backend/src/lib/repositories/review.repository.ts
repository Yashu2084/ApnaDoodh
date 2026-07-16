import { Review, getReviews, addReview, updateReviewStatus } from "../db";

export class ReviewRepository {
  async getById(id: string): Promise<Review | null> {
    const reviews = await getReviews();
    return reviews.find(r => r.id === id) || null;
  }

  async getAll(options?: { 
    limit?: number; 
    offset?: number; 
    status?: "Approved" | "Flagged" | "Removed"; 
    farmerId?: string 
  }): Promise<{ reviews: Review[]; total: number }> {
    let reviews = await getReviews();

    if (options?.status) {
      reviews = reviews.filter(r => r.status === options.status);
    }

    if (options?.farmerId) {
      reviews = reviews.filter(r => r.farmerId === options.farmerId);
    }

    const total = reviews.length;

    const offset = options?.offset || 0;
    const limit = options?.limit !== undefined ? options.limit : total;
    reviews = reviews.slice(offset, offset + limit);

    return { reviews, total };
  }

  async create(review: Omit<Review, "id" | "status" | "date">): Promise<Review> {
    return await addReview(review);
  }

  async updateStatus(id: string, status: Review["status"]): Promise<Review> {
    return await updateReviewStatus(id, status);
  }
}
