import { Product, getProducts, addProduct, updateProduct, deleteProduct } from "../db";

export class ProductRepository {
  async getById(id: string): Promise<Product | null> {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
  }

  async getAll(options?: { 
    limit?: number; 
    offset?: number; 
    category?: string; 
    farmerId?: string; 
    status?: "Active" | "Flagged" 
  }): Promise<{ products: Product[]; total: number }> {
    let products = await getProducts();

    if (options?.farmerId) {
      products = products.filter(p => p.farmerId === options.farmerId);
    }

    if (options?.category && options.category !== "All") {
      products = products.filter(p => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.status) {
      products = products.filter(p => p.status === options.status);
    }

    const total = products.length;

    const offset = options?.offset || 0;
    const limit = options?.limit !== undefined ? options.limit : total;
    products = products.slice(offset, offset + limit);

    return { products, total };
  }

  async create(product: Omit<Product, "id" | "status">): Promise<Product> {
    return await addProduct(product);
  }

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    return await updateProduct(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return await deleteProduct(id);
  }
}
