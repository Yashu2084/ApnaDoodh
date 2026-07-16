import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "CUSTOMER" | "FARMER" | "SUPER_ADMIN";
  createdAt: string;
  walletBalance?: number;
  kycStatus?: "Pending" | "Verified" | "Suspended";
  kycGovIdUrl?: string;
  kycFssaiUrl?: string;
  kycDocumentExpiry?: string;
  location?: string;
  joinedDate?: string;
  herdSize?: string;
  storeName?: string;
  storeDesc?: string;
  storePhone?: string;
  storeAddress?: string;
  deliveryRadius?: string;
  dispatchTime?: string;
  deliveryFee?: number;
  status?: "Active" | "Blocked";
  wishlist?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  stock: number;
  category: string;
  farmerId: string;
  status: "Active" | "Flagged";
  badge?: string;
  rating?: number;
}

export interface DeliveryItem {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  date: string;
  product: string;
  quantity: string;
  price: number;
  status: "Delivered" | "Scheduled" | "Paused" | "Skipped";
  farmerId: string;
  skippedDates?: string[];
  temperatureLogs?: number[];
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  text: string;
  date: string;
  product: string;
  status: "Approved" | "Flagged" | "Removed";
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
}

export interface PlatformSettings {
  commissionRate: number;
  baseDeliveryFee: number;
  payoutCycle: string;
  kycRequired: boolean;
}

export interface TrackingLocation {
  lat: number;
  lng: number;
  lastUpdated: string;
}

export interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  adminId: string;
  adminName: string;
  details: string;
}

export function hashPassword(password: string): string {
  try {
    const bcrypt = eval("require")("bcryptjs");
    return bcrypt.hashSync(password, 10);
  } catch {
    try {
      const bcrypt = eval("require")("bcrypt");
      return bcrypt.hashSync(password, 10);
    } catch {
      const salt = "apnadoodh_secure_bcrypt_fallback_salt_123";
      return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    }
  }
}

export function comparePassword(password: string, hash: string): boolean {
  if (hash.length === 64 && /^[0-9a-f]+$/i.test(hash)) {
    const sha256 = crypto.createHash("sha256").update(password).digest("hex");
    return sha256 === hash;
  }

  if (hash.startsWith("$2")) {
    try {
      const bcrypt = eval("require")("bcryptjs");
      return bcrypt.compareSync(password, hash);
    } catch {
      try {
        const bcrypt = eval("require")("bcrypt");
        return bcrypt.compareSync(password, hash);
      } catch {}
    }
  }

  const salt = "apnadoodh_secure_bcrypt_fallback_salt_123";
  const pbkdf2Hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(pbkdf2Hash), Buffer.from(hash));
  } catch {
    return pbkdf2Hash === hash;
  }
}

function mapUser(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash,
    role: u.role as any,
    createdAt: u.createdAt.toISOString(),
    walletBalance: u.walletBalance !== null ? u.walletBalance : undefined,
    kycStatus: u.kycStatus !== null ? u.kycStatus : undefined,
    kycGovIdUrl: u.kycGovIdUrl !== null ? u.kycGovIdUrl : undefined,
    kycFssaiUrl: u.kycFssaiUrl !== null ? u.kycFssaiUrl : undefined,
    kycDocumentExpiry: u.kycDocumentExpiry !== null ? u.kycDocumentExpiry.toISOString() : undefined,
    location: u.location !== null ? u.location : undefined,
    joinedDate: u.joinedDate !== null ? u.joinedDate : undefined,
    herdSize: u.herdSize !== null ? u.herdSize : undefined,
    storeName: u.storeName !== null ? u.storeName : undefined,
    storeDesc: u.storeDesc !== null ? u.storeDesc : undefined,
    storePhone: u.storePhone !== null ? u.storePhone : undefined,
    storeAddress: u.storeAddress !== null ? u.storeAddress : undefined,
    deliveryRadius: u.deliveryRadius !== null ? u.deliveryRadius : undefined,
    dispatchTime: u.dispatchTime !== null ? u.dispatchTime : undefined,
    deliveryFee: u.deliveryFee !== null ? u.deliveryFee : undefined,
    status: u.status as any,
    wishlist: u.wishlist,
  };
}

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    unit: p.unit,
    description: p.description,
    image: p.image,
    stock: p.stock,
    category: p.category,
    farmerId: p.farmerId,
    status: p.status as any,
    badge: p.badge !== null ? p.badge : undefined,
    rating: p.rating !== null ? p.rating : undefined,
  };
}

function mapDeliveryItem(d: any): DeliveryItem {
  return {
    id: d.id,
    customerId: d.customerId,
    customerName: d.customerName,
    address: d.address,
    date: d.date,
    product: d.product,
    quantity: d.quantity,
    price: d.price,
    status: d.status as any,
    farmerId: d.farmerId,
    skippedDates: d.skippedDates,
  };
}

function mapReview(r: any): Review {
  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customerName,
    farmerId: r.farmerId,
    farmerName: r.farmerName,
    rating: r.rating,
    text: r.text,
    date: r.date,
    product: r.product,
    status: r.status as any,
  };
}

function mapTransaction(t: any): Transaction {
  return {
    id: t.id,
    userId: t.userId,
    amount: t.amount,
    type: t.type as any,
    description: t.description,
    createdAt: t.createdAt.toISOString(),
  };
}

function mapPlatformSettings(s: any): PlatformSettings {
  return {
    commissionRate: s.commissionRate,
    baseDeliveryFee: s.baseDeliveryFee,
    payoutCycle: s.payoutCycle,
    kycRequired: s.kycRequired,
  };
}

function mapTrackingLocation(t: any): TrackingLocation {
  return {
    lat: t.lat,
    lng: t.lng,
    lastUpdated: t.lastUpdated.toISOString(),
  };
}

function mapRefreshToken(t: any): RefreshToken {
  return {
    token: t.token,
    userId: t.userId,
    expiresAt: t.expiresAt.toISOString(),
  };
}

function mapAuditLog(l: any): AuditLog {
  return {
    id: l.id,
    timestamp: l.timestamp.toISOString(),
    action: l.action,
    adminId: l.adminId,
    adminName: l.adminName,
    details: l.details,
  };
}

export async function seedIfNeeded() {
  const userCount = await prisma.user.count();
  if (userCount > 0) return;

  const adminPass = hashPassword("admin123");
  const customerPass = hashPassword("customer123");
  const farmerPass = hashPassword("farmer123");

  await prisma.user.createMany({
    data: [
      {
        id: "admin-01",
        name: "ApnaDoodh Admin",
        email: "admin@apnadoodh.com",
        passwordHash: adminPass,
        role: "SUPER_ADMIN",
        joinedDate: "Jan 12, 2026",
      },
      {
        id: "customer-01",
        name: "Rahul Verma",
        email: "customer@apnadoodh.com",
        passwordHash: customerPass,
        role: "CUSTOMER",
        walletBalance: 1430.0,
        location: "Flat 402, Block C, Maple Heights, Sector 56, Gurugram, Haryana - 122011",
        joinedDate: "Jan 15, 2026",
        status: "Active",
        wishlist: ["ghee", "butter"],
      },
      {
        id: "farmer-01",
        name: "Sukhdev Singh",
        email: "farmer@apnadoodh.com",
        passwordHash: farmerPass,
        role: "FARMER",
        kycStatus: "Verified",
        kycGovIdUrl: "gov-id-farmer-01.pdf",
        kycFssaiUrl: "fssai-farmer-01.pdf",
        kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        storeName: "Govardhan A2 Dairy",
        storeDesc: "Premium grass-fed Gir cow milk, pure Vedic-churned ghee, and traditional dairy products delivered directly from farm to table.",
        storePhone: "+91 98765 00000",
        storeAddress: "Farm No. 4, Aravali Foothills Rural Zone, near Sector 62, Gurugram, Haryana",
        deliveryRadius: "8 km",
        dispatchTime: "5:00 AM",
        deliveryFee: 0.0,
        joinedDate: "Jan 12, 2026",
        herdSize: "35 Cows",
      },
      {
        id: "farmer-02",
        name: "Manpreet Singh",
        email: "aravali@gmail.com",
        passwordHash: farmerPass,
        role: "FARMER",
        kycStatus: "Verified",
        kycGovIdUrl: "gov-id-farmer-02.pdf",
        kycFssaiUrl: "fssai-farmer-02.pdf",
        kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 300),
        storeName: "Aravali Foothills Dairy",
        storeDesc: "Handcrafted paneer and fresh white table butter made daily in rural Gurugram.",
        storePhone: "+91 98765 11111",
        storeAddress: "Sector 71 rural pastures, Gurugram",
        deliveryRadius: "6 km",
        dispatchTime: "5:30 AM",
        deliveryFee: 15.0,
        joinedDate: "Feb 05, 2026",
        herdSize: "20 Cows, 10 Buffaloes",
      },
      {
        id: "farmer-03",
        name: "Murrah Heights",
        email: "murrah@gmail.com",
        passwordHash: farmerPass,
        role: "FARMER",
        kycStatus: "Pending",
        kycGovIdUrl: "gov-id-farmer-03.pdf",
        kycFssaiUrl: "fssai-farmer-03.pdf",
        kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
        storeName: "Murrah Heights Farm",
        storeDesc: "High fat Murrah buffalo milk from purebred cattle.",
        storePhone: "+91 98765 22222",
        storeAddress: "Sohna Road, Gurugram",
        deliveryRadius: "10 km",
        dispatchTime: "4:45 AM",
        deliveryFee: 20.0,
        joinedDate: "June 20, 2026",
        herdSize: "25 Buffaloes",
      }
    ]
  });

  await prisma.product.createMany({
    data: [
      {
        id: "cow-milk",
        name: "A2 Cow Milk",
        price: 99,
        unit: "1 Litre",
        description: "Sourced from pasture-fed A2 Gir cows. Naturally sweet, highly digestible, antibiotic-free, and delivered cold in eco-friendly glass bottles.",
        image: "/apnadoodh_cow_milk.webp",
        stock: 150,
        category: "Milk",
        farmerId: "farmer-01",
        status: "Active",
        badge: "Best Seller",
        rating: 4.9
      },
      {
        id: "paneer",
        name: "Handcrafted Paneer",
        price: 249,
        unit: "250g",
        description: "Freshly curdled cottage cheese handmade every morning. Exceedingly soft, moisture-rich, starch-free, and contains zero additives.",
        image: "/apnadoodh_paneer.webp",
        stock: 35,
        category: "Paneer",
        farmerId: "farmer-02",
        status: "Active",
        badge: "Freshly Made",
        rating: 4.9
      },
      {
        id: "curd",
        name: "Probiotic Curd (Dahi)",
        price: 89,
        unit: "500g",
        description: "Slow-cultured over 12 hours with active probiotic strains in clay pots. Thick, velvety, and naturally sweet cooling side dish.",
        image: "/apnadoodh_curd.webp",
        stock: 100,
        category: "Curd",
        farmerId: "farmer-01",
        status: "Active",
        badge: "Probiotic Rich",
        rating: 4.8
      },
      {
        id: "ghee",
        name: "A2 Desi Cow Ghee",
        price: 649,
        unit: "500ml",
        description: "Golden ghee churned via traditional bilona curd curdling. Boasts a rich, grainy texture, immense nutritional value, and clean aroma.",
        image: "/apnadoodh_ghee.webp",
        stock: 45,
        category: "Ghee",
        farmerId: "farmer-01",
        status: "Active",
        badge: "Bilona Method",
        rating: 5.0
      },
      {
        id: "butter",
        name: "Fresh White Butter",
        price: 229,
        unit: "250g",
        description: "Hand-churned unsalted table butter made from fresh dairy cow cream. Rich, smooth taste, perfect for traditional Indian breads.",
        image: "/apnadoodh_butter.webp",
        stock: 20,
        category: "Butter",
        farmerId: "farmer-02",
        status: "Active",
        badge: "100% Organic",
        rating: 4.9
      }
    ]
  });

  await prisma.deliveryItem.createMany({
    data: [
      {
        id: "DLV-901",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        address: "Flat 402, Block C, Sector 56, Gurugram",
        date: "June 24, 2026",
        product: "A2 Cow Milk",
        quantity: "1 Litre",
        price: 99.0,
        status: "Scheduled",
        farmerId: "farmer-01"
      },
      {
        id: "DLV-902",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        address: "Flat 402, Block C, Sector 56, Gurugram",
        date: "June 25, 2026",
        product: "A2 Cow Milk",
        quantity: "1 Litre",
        price: 99.0,
        status: "Scheduled",
        farmerId: "farmer-01"
      },
      {
        id: "DLV-903",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        address: "Flat 402, Block C, Sector 56, Gurugram",
        date: "June 23, 2026",
        product: "A2 Cow Milk",
        quantity: "1 Litre",
        price: 99.0,
        status: "Delivered",
        farmerId: "farmer-01"
      },
      {
        id: "DLV-904",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        address: "Flat 402, Block C, Sector 56, Gurugram",
        date: "June 22, 2026",
        product: "A2 Cow Milk + Paneer",
        quantity: "1 Litre + 250g",
        price: 348.0,
        status: "Delivered",
        farmerId: "farmer-01"
      },
      {
        id: "DLV-905",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        address: "Flat 402, Block C, Sector 56, Gurugram",
        date: "June 21, 2026",
        product: "A2 Cow Milk",
        quantity: "1 Litre",
        price: 99.0,
        status: "Delivered",
        farmerId: "farmer-01"
      }
    ]
  });

  await prisma.review.createMany({
    data: [
      {
        id: "REV-501",
        customerId: "customer-01",
        customerName: "Rahul Verma",
        farmerId: "farmer-01",
        farmerName: "Govardhan A2 Dairy",
        rating: 5,
        text: "Excellent quality milk! There is a distinct thickness and natural sweetness in the A2 milk.",
        date: "June 12, 2026",
        product: "A2 Cow Milk",
        status: "Approved"
      },
      {
        id: "REV-502",
        customerId: "user-ananya",
        customerName: "Ananya Sharma",
        farmerId: "farmer-02",
        farmerName: "Aravali Foothills Dairy",
        rating: 2,
        text: "The delivery courier drops the bottle too loud at 5 AM. Milk tastes fine though.",
        date: "June 15, 2026",
        product: "A2 Cow Milk",
        status: "Flagged"
      },
      {
        id: "REV-503",
        customerId: "user-suresh",
        customerName: "Suresh Mehra",
        farmerId: "farmer-03",
        farmerName: "Krishna Dairy Farms",
        rating: 1,
        text: "SCAM! DO NOT BUY MILK! DILUTED WITH SEWAGE WATER!!",
        date: "June 18, 2026",
        product: "Milk",
        status: "Flagged"
      }
    ]
  });

  await prisma.transaction.create({
    data: {
      id: "TX-101",
      userId: "customer-01",
      amount: 1000.0,
      type: "CREDIT",
      description: "Wallet UPI Top-up",
    }
  });

  await prisma.platformSettings.create({
    data: {
      id: 1,
      commissionRate: 10.0,
      baseDeliveryFee: 15.0,
      payoutCycle: "Weekly",
      kycRequired: true
    }
  });

  await prisma.trackingLocation.create({
    data: {
      id: 1,
      lat: 28.4595,
      lng: 77.0266,
    }
  });
}

// User CRUD operations
export async function getUsers(): Promise<User[]> {
  await seedIfNeeded();
  const list = await prisma.user.findMany();
  return list.map(mapUser);
}

export async function addUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  await seedIfNeeded();
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as any,
      walletBalance: user.role === "CUSTOMER" ? 1500.0 : user.walletBalance || null,
      kycStatus: user.role === "FARMER" ? "Pending" : null,
      status: "Active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      location: user.location || null,
      herdSize: user.herdSize || null,
      storeName: user.storeName || null,
      storeDesc: user.storeDesc || null,
      storePhone: user.storePhone || null,
      storeAddress: user.storeAddress || null,
      deliveryRadius: user.deliveryRadius || null,
      dispatchTime: user.dispatchTime || null,
      deliveryFee: user.deliveryFee || 0.0,
      wishlist: user.wishlist || [],
    }
  });
  return mapUser(newUser);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  await seedIfNeeded();
  
  const data: any = { ...updates };
  if (updates.role) data.role = updates.role as any;
  if (updates.status) data.status = updates.status as any;
  if (updates.kycStatus) data.kycStatus = updates.kycStatus as any;
  if (updates.kycDocumentExpiry) data.kycDocumentExpiry = new Date(updates.kycDocumentExpiry);

  const updated = await prisma.user.update({
    where: { id },
    data
  });
  return mapUser(updated);
}

// Product CRUD operations
export async function getProducts(): Promise<Product[]> {
  await seedIfNeeded();
  const list = await prisma.product.findMany();
  return list.map(mapProduct);
}

export async function addProduct(product: Omit<Product, "id" | "status">): Promise<Product> {
  await seedIfNeeded();
  const newProduct = await prisma.product.create({
    data: {
      name: product.name,
      price: product.price,
      unit: product.unit,
      description: product.description,
      image: product.image,
      stock: product.stock,
      category: product.category,
      farmerId: product.farmerId,
      status: "Active",
      badge: product.badge || null,
      rating: product.rating || 5.0,
    }
  });
  return mapProduct(newProduct);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await seedIfNeeded();
  const data: any = { ...updates };
  if (updates.status) data.status = updates.status as any;

  const updated = await prisma.product.update({
    where: { id },
    data
  });
  return mapProduct(updated);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await seedIfNeeded();
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Deliveries and Daily Drops CRUD
export async function getDeliveries(): Promise<DeliveryItem[]> {
  await seedIfNeeded();
  const list = await prisma.deliveryItem.findMany();
  return list.map(mapDeliveryItem);
}

export async function addDelivery(delivery: Omit<DeliveryItem, "id">): Promise<DeliveryItem> {
  await seedIfNeeded();
  const newD = await prisma.deliveryItem.create({
    data: {
      id: "DLV-" + Math.floor(100 + Math.random() * 900),
      customerId: delivery.customerId,
      customerName: delivery.customerName,
      address: delivery.address,
      date: delivery.date,
      product: delivery.product,
      quantity: delivery.quantity,
      price: delivery.price,
      status: "Scheduled",
      farmerId: delivery.farmerId,
      skippedDates: delivery.skippedDates || [],
    }
  });
  return mapDeliveryItem(newD);
}

export async function updateDeliveryStatus(id: string, status: DeliveryItem["status"]): Promise<DeliveryItem> {
  await seedIfNeeded();
  return await prisma.$transaction(async (tx) => {
    const delivery = await tx.deliveryItem.findUnique({ where: { id } });
    if (!delivery) throw new Error("Delivery drop not found");
    const oldStatus = delivery.status;

    const updatedDelivery = await tx.deliveryItem.update({
      where: { id },
      data: { status: status as any }
    });

    if (status === "Skipped" && oldStatus !== "Skipped") {
      const user = await tx.user.findUnique({ where: { id: delivery.customerId } });
      if (user) {
        const refundAmt = delivery.price;
        const currentBal = user.walletBalance || 0.0;
        await tx.user.update({
          where: { id: delivery.customerId },
          data: { walletBalance: currentBal + refundAmt }
        });

        await tx.transaction.create({
          data: {
            id: "TX-" + Math.floor(100 + Math.random() * 900),
            userId: delivery.customerId,
            amount: refundAmt,
            type: "CREDIT",
            description: `Auto-Refund: Skipped drop ${delivery.id}`,
          }
        });
      }
    }

    return mapDeliveryItem(updatedDelivery);
  });
}

export async function pauseCustomerDeliveries(customerId: string, isPaused: boolean): Promise<void> {
  await seedIfNeeded();
  await prisma.deliveryItem.updateMany({
    where: {
      customerId,
      status: isPaused ? "Scheduled" : "Paused"
    },
    data: {
      status: isPaused ? "Paused" : "Scheduled"
    }
  });
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  await seedIfNeeded();
  const list = await prisma.transaction.findMany();
  return list.map(mapTransaction);
}

export async function addTransaction(tx: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  await seedIfNeeded();
  const newTx = await prisma.transaction.create({
    data: {
      id: "TX-" + Math.floor(100 + Math.random() * 900),
      userId: tx.userId,
      amount: tx.amount,
      type: tx.type as any,
      description: tx.description,
    }
  });
  return mapTransaction(newTx);
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  await seedIfNeeded();
  const list = await prisma.review.findMany();
  return list.map(mapReview);
}

export async function addReview(review: Omit<Review, "id" | "status" | "date">): Promise<Review> {
  await seedIfNeeded();
  const newReview = await prisma.review.create({
    data: {
      id: "REV-" + Math.floor(100 + Math.random() * 900),
      customerId: review.customerId,
      customerName: review.customerName,
      farmerId: review.farmerId,
      farmerName: review.farmerName,
      rating: review.rating,
      text: review.text,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      product: review.product,
      status: "Approved",
    }
  });
  return mapReview(newReview);
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<Review> {
  await seedIfNeeded();
  const updated = await prisma.review.update({
    where: { id },
    data: { status: status as any }
  });
  return mapReview(updated);
}

// Platform settings
export async function getPlatformSettings(): Promise<PlatformSettings> {
  await seedIfNeeded();
  let settings = await prisma.platformSettings.findFirst({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.platformSettings.create({
      data: {
        id: 1,
        commissionRate: 10.0,
        baseDeliveryFee: 15.0,
        payoutCycle: "Weekly",
        kycRequired: true,
      }
    });
  }
  return mapPlatformSettings(settings);
}

export async function updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
  await seedIfNeeded();
  const updated = await prisma.platformSettings.update({
    where: { id: 1 },
    data: updates
  });
  return mapPlatformSettings(updated);
}

// Telemetry Location Tracking
export async function getTrackingLocation(): Promise<TrackingLocation> {
  await seedIfNeeded();
  let tracking = await prisma.trackingLocation.findFirst({ where: { id: 1 } });
  if (!tracking) {
    tracking = await prisma.trackingLocation.create({
      data: {
        id: 1,
        lat: 28.4595,
        lng: 77.0266,
      }
    });
  }
  return mapTrackingLocation(tracking);
}

export async function updateTrackingLocation(lat: number, lng: number): Promise<TrackingLocation> {
  await seedIfNeeded();
  const updated = await prisma.trackingLocation.update({
    where: { id: 1 },
    data: {
      lat,
      lng,
      lastUpdated: new Date()
    }
  });
  return mapTrackingLocation(updated);
}

// Refresh token store
export async function addRefreshToken(userId: string, token: string): Promise<void> {
  await seedIfNeeded();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await prisma.refreshToken.create({
    data: { token, userId, expiresAt }
  });
  await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  await seedIfNeeded();
  const found = await prisma.refreshToken.findUnique({ where: { token } });
  if (!found) return null;
  if (found.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token } });
    return null;
  }
  return mapRefreshToken(found);
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await seedIfNeeded();
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function skipDeliveryDate(id: string, date: string): Promise<DeliveryItem> {
  await seedIfNeeded();
  const delivery = await prisma.deliveryItem.findUnique({ where: { id } });
  if (!delivery) throw new Error("Delivery drop not found");
  const skipped = delivery.skippedDates || [];
  if (!skipped.includes(date)) {
    skipped.push(date);
  }
  const updated = await prisma.deliveryItem.update({
    where: { id },
    data: {
      skippedDates: skipped,
      status: "Skipped"
    }
  });
  return mapDeliveryItem(updated);
}

// Audit Logs CRUD Helpers
export async function addAuditLog(
  action: string,
  adminId: string,
  adminName: string,
  details: string
): Promise<AuditLog> {
  await seedIfNeeded();
  const newLog = await prisma.auditLog.create({
    data: {
      action,
      adminId,
      adminName,
      details,
    }
  });
  return mapAuditLog(newLog);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  await seedIfNeeded();
  const list = await prisma.auditLog.findMany();
  return list.map(mapAuditLog);
}

export async function logDeliveryTemperature(id: string, temperature: number): Promise<DeliveryItem> {
  await seedIfNeeded();
  const delivery = await prisma.deliveryItem.findUnique({ where: { id } });
  if (!delivery) throw new Error("Delivery drop not found");
  const logs = delivery.temperatureLogs || [];
  logs.push(temperature);
  const updated = await prisma.deliveryItem.update({
    where: { id },
    data: {
      temperatureLogs: logs
    }
  });
  return mapDeliveryItem(updated);
}
