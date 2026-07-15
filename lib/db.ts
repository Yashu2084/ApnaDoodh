import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DB_DIR = "C:\\Users\\MOL\\.gemini\\antigravity";
const DB_PATH = path.join(DB_DIR, "auth_db.json");

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

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  deliveries: DeliveryItem[];
  reviews: Review[];
  transactions: Transaction[];
  settings: PlatformSettings;
  tracking: TrackingLocation;
  refreshTokens: RefreshToken[];
  auditLogs: AuditLog[];
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
      // Fallback to secure PBKDF2 stretching (work factor 10 equivalent)
      const salt = "apnadoodh_secure_bcrypt_fallback_salt_123";
      return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    }
  }
}

export function comparePassword(password: string, hash: string): boolean {
  // 1. Backwards-compatibility check for legacy SHA-256 seeded hashes (64 hex characters)
  if (hash.length === 64 && /^[0-9a-f]+$/i.test(hash)) {
    const sha256 = crypto.createHash("sha256").update(password).digest("hex");
    return sha256 === hash;
  }

  // 2. BCrypt verification
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

  // 3. Fallback PBKDF2 verification (128 hex characters)
  const salt = "apnadoodh_secure_bcrypt_fallback_salt_123";
  const pbkdf2Hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(pbkdf2Hash), Buffer.from(hash));
  } catch {
    return pbkdf2Hash === hash;
  }
}

// Global promise write lock queue to prevent race conditions on JSON file writes
let writeQueue = Promise.resolve();

async function runInQueue<T>(fn: () => Promise<T>): Promise<T> {
  const result = new Promise<T>((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const val = await fn();
        resolve(val);
      } catch (err) {
        reject(err);
      }
    });
  });
  return result;
}

async function ensureDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      // Seed initial data
      const initialDb: DatabaseSchema = {
        users: [
          {
            id: "admin-01",
            name: "ApnaDoodh Admin",
            email: "admin@apnadoodh.com",
            passwordHash: hashPassword("admin123"),
            role: "SUPER_ADMIN",
            createdAt: new Date().toISOString(),
          },
          {
            id: "customer-01",
            name: "Rahul Verma",
            email: "customer@apnadoodh.com",
            passwordHash: hashPassword("customer123"),
            role: "CUSTOMER",
            walletBalance: 1430.0,
            location: "Flat 402, Block C, Maple Heights, Sector 56, Gurugram, Haryana - 122011",
            joinedDate: "Jan 15, 2026",
            status: "Active",
            wishlist: ["ghee", "butter"],
            createdAt: new Date().toISOString(),
          },
          {
            id: "farmer-01",
            name: "Sukhdev Singh",
            email: "farmer@apnadoodh.com",
            passwordHash: hashPassword("farmer123"),
            role: "FARMER",
            kycStatus: "Verified",
            kycGovIdUrl: "gov-id-farmer-01.pdf",
            kycFssaiUrl: "fssai-farmer-01.pdf",
            kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
            storeName: "Govardhan A2 Dairy",
            storeDesc: "Premium grass-fed Gir cow milk, pure Vedic-churned ghee, and traditional dairy products delivered directly from farm to table.",
            storePhone: "+91 98765 00000",
            storeAddress: "Farm No. 4, Aravali Foothills Rural Zone, near Sector 62, Gurugram, Haryana",
            deliveryRadius: "8 km",
            dispatchTime: "5:00 AM",
            deliveryFee: 0,
            joinedDate: "Jan 12, 2026",
            herdSize: "35 Cows",
            createdAt: new Date().toISOString(),
          },
          {
            id: "farmer-02",
            name: "Manpreet Singh",
            email: "aravali@gmail.com",
            passwordHash: hashPassword("farmer123"),
            role: "FARMER",
            kycStatus: "Verified",
            kycGovIdUrl: "gov-id-farmer-02.pdf",
            kycFssaiUrl: "fssai-farmer-02.pdf",
            kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 300).toISOString(),
            storeName: "Aravali Foothills Dairy",
            storeDesc: "Handcrafted paneer and fresh white table butter made daily in rural Gurugram.",
            storePhone: "+91 98765 11111",
            storeAddress: "Sector 71 rural pastures, Gurugram",
            deliveryRadius: "6 km",
            dispatchTime: "5:30 AM",
            deliveryFee: 15,
            joinedDate: "Feb 05, 2026",
            herdSize: "20 Cows, 10 Buffaloes",
            createdAt: new Date().toISOString(),
          },
          {
            id: "farmer-03",
            name: "Murrah Heights",
            email: "murrah@gmail.com",
            passwordHash: hashPassword("farmer123"),
            role: "FARMER",
            kycStatus: "Pending",
            kycGovIdUrl: "gov-id-farmer-03.pdf",
            kycFssaiUrl: "fssai-farmer-03.pdf",
            kycDocumentExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
            storeName: "Murrah Heights Farm",
            storeDesc: "High fat Murrah buffalo milk from purebred cattle.",
            storePhone: "+91 98765 22222",
            storeAddress: "Sohna Road, Gurugram",
            deliveryRadius: "10 km",
            dispatchTime: "4:45 AM",
            deliveryFee: 20,
            joinedDate: "June 20, 2026",
            herdSize: "25 Buffaloes",
            createdAt: new Date().toISOString(),
          }
        ],
        products: [
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
        ],
        deliveries: [
          {
            id: "DLV-901",
            customerId: "customer-01",
            customerName: "Rahul Verma",
            address: "Flat 402, Block C, Sector 56, Gurugram",
            date: "June 24, 2026",
            product: "A2 Cow Milk",
            quantity: "1 Litre",
            price: 99,
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
            price: 99,
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
            price: 99,
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
            price: 348,
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
            price: 99,
            status: "Delivered",
            farmerId: "farmer-01"
          }
        ],
        reviews: [
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
        ],
        transactions: [
          {
            id: "TX-101",
            userId: "customer-01",
            amount: 1000,
            type: "CREDIT",
            description: "Wallet UPI Top-up",
            createdAt: new Date().toISOString()
          }
        ],
        settings: {
          commissionRate: 10,
          baseDeliveryFee: 15,
          payoutCycle: "Weekly",
          kycRequired: true
        },
        tracking: {
          lat: 28.4595,
          lng: 77.0266,
          lastUpdated: new Date().toISOString()
        },
        refreshTokens: [],
        auditLogs: []
      };
      await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("DB Initialization error", e);
  }
}

async function readDb(): Promise<DatabaseSchema> {
  await ensureDb();
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(content);
    if (!db.auditLogs) {
      db.auditLogs = [];
    }
    return db;
  } catch {
    throw new Error("Unable to read database file");
  }
}

async function writeDb(db: DatabaseSchema): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// User CRUD operations
export async function getUsers(): Promise<User[]> {
  const db = await readDb();
  return db.users || [];
}

export async function addUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  return runInQueue(async () => {
    const db = await readDb();
    const newUser: User = {
      ...user,
      id: "user-" + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      walletBalance: user.role === "CUSTOMER" ? 1500.0 : undefined,
      kycStatus: user.role === "FARMER" ? "Pending" : undefined,
      status: "Active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
    db.users.push(newUser);
    await writeDb(db);
    return newUser;
  });
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    db.users[index] = { ...db.users[index], ...updates };
    await writeDb(db);
    return db.users[index];
  });
}

// Product CRUD operations
export async function getProducts(): Promise<Product[]> {
  const db = await readDb();
  return db.products || [];
}

export async function addProduct(product: Omit<Product, "id" | "status">): Promise<Product> {
  return runInQueue(async () => {
    const db = await readDb();
    const newProduct: Product = {
      ...product,
      id: "prod-" + Math.random().toString(36).substring(2, 11),
      status: "Active"
    };
    db.products.push(newProduct);
    await writeDb(db);
    return newProduct;
  });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    db.products[index] = { ...db.products[index], ...updates };
    await writeDb(db);
    return db.products[index];
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    db.products.splice(index, 1);
    await writeDb(db);
    return true;
  });
}

// Deliveries and Daily Drops CRUD
export async function getDeliveries(): Promise<DeliveryItem[]> {
  const db = await readDb();
  return db.deliveries || [];
}

export async function addDelivery(delivery: Omit<DeliveryItem, "id">): Promise<DeliveryItem> {
  return runInQueue(async () => {
    const db = await readDb();
    const newD: DeliveryItem = {
      ...delivery,
      id: "DLV-" + Math.floor(100 + Math.random() * 900)
    };
    db.deliveries.push(newD);
    await writeDb(db);
    return newD;
  });
}

export async function updateDeliveryStatus(id: string, status: DeliveryItem["status"]): Promise<DeliveryItem> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.deliveries.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Delivery drop not found");
    
    const delivery = db.deliveries[index];
    const oldStatus = delivery.status;
    delivery.status = status;

    // Refund Escrow Trigger (Part 13.4, 14.5): if status transitions to Skipped
    if (status === "Skipped" && oldStatus !== "Skipped") {
      const userIndex = db.users.findIndex(u => u.id === delivery.customerId);
      if (userIndex !== -1) {
        const refundAmt = delivery.price;
        const currentBal = db.users[userIndex].walletBalance || 0.0;
        db.users[userIndex].walletBalance = currentBal + refundAmt;

        // Log ledger credit transaction
        db.transactions.push({
          id: "TX-" + Math.floor(100 + Math.random() * 900),
          userId: delivery.customerId,
          amount: refundAmt,
          type: "CREDIT",
          description: `Auto-Refund: Skipped drop ${delivery.id}`,
          createdAt: new Date().toISOString()
        });
      }
    }

    await writeDb(db);
    return db.deliveries[index];
  });
}

export async function pauseCustomerDeliveries(customerId: string, isPaused: boolean): Promise<void> {
  return runInQueue(async () => {
    const db = await readDb();
    db.deliveries = db.deliveries.map(d => {
      if (d.customerId === customerId && d.status === (isPaused ? "Scheduled" : "Paused")) {
        return { ...d, status: isPaused ? "Paused" : "Scheduled" };
      }
      return d;
    });
    await writeDb(db);
  });
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const db = await readDb();
  return db.transactions || [];
}

export async function addTransaction(tx: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  return runInQueue(async () => {
    const db = await readDb();
    const newTx: Transaction = {
      ...tx,
      id: "TX-" + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString()
    };
    db.transactions.push(newTx);
    await writeDb(db);
    return newTx;
  });
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  const db = await readDb();
  return db.reviews || [];
}

export async function addReview(review: Omit<Review, "id" | "status" | "date">): Promise<Review> {
  return runInQueue(async () => {
    const db = await readDb();
    const newReview: Review = {
      ...review,
      id: "REV-" + Math.floor(100 + Math.random() * 900),
      status: "Approved", // Approved by default
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    };
    db.reviews.push(newReview);
    await writeDb(db);
    return newReview;
  });
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<Review> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.reviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Review not found");
    db.reviews[index].status = status;
    await writeDb(db);
    return db.reviews[index];
  });
}

// Platform settings
export async function getPlatformSettings(): Promise<PlatformSettings> {
  const db = await readDb();
  return db.settings;
}

export async function updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
  return runInQueue(async () => {
    const db = await readDb();
    db.settings = { ...db.settings, ...updates };
    await writeDb(db);
    return db.settings;
  });
}

// Telemetry Location Tracking
export async function getTrackingLocation(): Promise<TrackingLocation> {
  const db = await readDb();
  return db.tracking;
}

export async function updateTrackingLocation(lat: number, lng: number): Promise<TrackingLocation> {
  return runInQueue(async () => {
    const db = await readDb();
    db.tracking = {
      lat,
      lng,
      lastUpdated: new Date().toISOString()
    };
    await writeDb(db);
    return db.tracking;
  });
}

// Refresh token store
export async function addRefreshToken(userId: string, token: string): Promise<void> {
  return runInQueue(async () => {
    const db = await readDb();
    // Keep tokens valid for 30 days
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
    db.refreshTokens.push({ userId, token, expiresAt });
    // Remove expired tokens
    db.refreshTokens = db.refreshTokens.filter(t => new Date(t.expiresAt) > new Date());
    await writeDb(db);
  });
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  const db = await readDb();
  const found = db.refreshTokens.find(t => t.token === token);
  if (!found) return null;
  if (new Date(found.expiresAt) < new Date()) {
    // Remove expired token
    runInQueue(async () => {
      const d = await readDb();
      d.refreshTokens = d.refreshTokens.filter(t => t.token !== token);
      await writeDb(d);
    });
    return null;
  }
  return found;
}

export async function deleteRefreshToken(token: string): Promise<void> {
  return runInQueue(async () => {
    const db = await readDb();
    db.refreshTokens = db.refreshTokens.filter(t => t.token !== token);
    await writeDb(db);
  });
}

export async function skipDeliveryDate(id: string, date: string): Promise<DeliveryItem> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.deliveries.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Delivery drop not found");
    const delivery = db.deliveries[index];
    if (!delivery.skippedDates) {
      delivery.skippedDates = [];
    }
    if (!delivery.skippedDates.includes(date)) {
      delivery.skippedDates.push(date);
    }
    delivery.status = "Skipped";
    await writeDb(db);
    return delivery;
  });
}

// Audit Logs CRUD Helpers (Part 13.5)
export async function addAuditLog(
  action: string, 
  adminId: string, 
  adminName: string, 
  details: string
): Promise<AuditLog> {
  return runInQueue(async () => {
    const db = await readDb();
    const newLog: AuditLog = {
      id: "log-" + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      action,
      adminId,
      adminName,
      details
    };
    db.auditLogs.push(newLog);
    await writeDb(db);
    return newLog;
  });
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = await readDb();
  return db.auditLogs || [];
}

export async function logDeliveryTemperature(id: string, temperature: number): Promise<DeliveryItem> {
  return runInQueue(async () => {
    const db = await readDb();
    const index = db.deliveries.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Delivery drop not found");
    const delivery = db.deliveries[index];
    if (!delivery.temperatureLogs) {
      delivery.temperatureLogs = [];
    }
    delivery.temperatureLogs.push(temperature);
    await writeDb(db);
    return delivery;
  });
}
