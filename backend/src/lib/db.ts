import { Pool, QueryResult, QueryResultRow } from "pg";
import crypto from "crypto";

// =========================================================================
// POSTGRESQL CONNECTION POOL SETUP
// =========================================================================

function getPoolConfig() {
  const rawUrl = process.env.DATABASE_URL?.trim() || "";

  if (!rawUrl) {
    return {
      connectionString: "postgresql://postgres:postgres@localhost:5432/apnadoodh",
      ssl: false,
    };
  }

  // Check if connection is internal Render network or localhost
  let isInternalRender = false;
  const isLocal = rawUrl.includes("localhost") || rawUrl.includes("127.0.0.1");
  const explicitlyDisabled = rawUrl.includes("sslmode=disable") || rawUrl.includes("ssl=false");
  const explicitlyRequired = rawUrl.includes("sslmode=require") || rawUrl.includes("ssl=true");

  try {
    const parsed = new URL(rawUrl);
    // Internal Render hostnames look like 'dpg-xxxxxxxx-a' (no dots in hostname)
    if (parsed.hostname.startsWith("dpg-") && !parsed.hostname.includes(".")) {
      isInternalRender = true;
    }
  } catch {}

  let sslConfig: boolean | { rejectUnauthorized: boolean } = false;

  if (explicitlyDisabled || isLocal) {
    sslConfig = false;
  } else if (explicitlyRequired || !isInternalRender) {
    sslConfig = { rejectUnauthorized: false };
  } else {
    // Render internal private network connection without SSL
    sslConfig = false;
  }

  return {
    connectionString: rawUrl,
    ssl: sslConfig,
  };
}

const poolConfig = getPoolConfig();

export const pool = new Pool({
  connectionString: poolConfig.connectionString,
  ssl: poolConfig.ssl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[PostgreSQL Pool Error]:", err.message);
});

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return await pool.query<T>(text, params);
}

// =========================================================================
// DATA MODELS & INTERFACES
// =========================================================================

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

// =========================================================================
// ROW MAPPERS (Transforms Postgres rows into typed interfaces)
// =========================================================================

function mapUser(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash,
    role: u.role,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
    walletBalance: u.walletBalance !== null && u.walletBalance !== undefined ? parseFloat(u.walletBalance) : undefined,
    kycStatus: u.kycStatus || undefined,
    kycGovIdUrl: u.kycGovIdUrl || undefined,
    kycFssaiUrl: u.kycFssaiUrl || undefined,
    kycDocumentExpiry: u.kycDocumentExpiry instanceof Date ? u.kycDocumentExpiry.toISOString() : (u.kycDocumentExpiry ? String(u.kycDocumentExpiry) : undefined),
    location: u.location || undefined,
    joinedDate: u.joinedDate || undefined,
    herdSize: u.herdSize || undefined,
    storeName: u.storeName || undefined,
    storeDesc: u.storeDesc || undefined,
    storePhone: u.storePhone || undefined,
    storeAddress: u.storeAddress || undefined,
    deliveryRadius: u.deliveryRadius || undefined,
    dispatchTime: u.dispatchTime || undefined,
    deliveryFee: u.deliveryFee !== null && u.deliveryFee !== undefined ? parseFloat(u.deliveryFee) : undefined,
    status: u.status || "Active",
    wishlist: Array.isArray(u.wishlist) ? u.wishlist : [],
  };
}

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    price: parseFloat(p.price),
    unit: p.unit,
    description: p.description,
    image: p.image,
    stock: parseInt(p.stock, 10),
    category: p.category,
    farmerId: p.farmerId,
    status: p.status || "Active",
    badge: p.badge || undefined,
    rating: p.rating !== null && p.rating !== undefined ? parseFloat(p.rating) : 5.0,
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
    price: parseFloat(d.price),
    status: d.status || "Scheduled",
    farmerId: d.farmerId,
    skippedDates: Array.isArray(d.skippedDates) ? d.skippedDates : [],
    temperatureLogs: Array.isArray(d.temperatureLogs) ? d.temperatureLogs.map((t: any) => parseFloat(t)) : [],
  };
}

function mapReview(r: any): Review {
  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customerName,
    farmerId: r.farmerId,
    farmerName: r.farmerName,
    rating: parseInt(r.rating, 10),
    text: r.text,
    date: r.date,
    product: r.product,
    status: r.status || "Approved",
  };
}

function mapTransaction(t: any): Transaction {
  return {
    id: t.id,
    userId: t.userId,
    amount: parseFloat(t.amount),
    type: t.type,
    description: t.description,
    createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
  };
}

function mapPlatformSettings(s: any): PlatformSettings {
  return {
    commissionRate: parseFloat(s.commissionRate),
    baseDeliveryFee: parseFloat(s.baseDeliveryFee),
    payoutCycle: s.payoutCycle,
    kycRequired: Boolean(s.kycRequired),
  };
}

function mapTrackingLocation(t: any): TrackingLocation {
  return {
    lat: parseFloat(t.lat),
    lng: parseFloat(t.lng),
    lastUpdated: t.lastUpdated instanceof Date ? t.lastUpdated.toISOString() : String(t.lastUpdated),
  };
}

function mapRefreshToken(t: any): RefreshToken {
  return {
    token: t.token,
    userId: t.userId,
    expiresAt: t.expiresAt instanceof Date ? t.expiresAt.toISOString() : String(t.expiresAt),
  };
}

function mapAuditLog(l: any): AuditLog {
  return {
    id: l.id,
    timestamp: l.timestamp instanceof Date ? l.timestamp.toISOString() : String(l.timestamp),
    action: l.action,
    adminId: l.adminId,
    adminName: l.adminName,
    details: l.details,
  };
}

// =========================================================================
// PASSWORD HASHING & VERIFICATION
// =========================================================================

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

// =========================================================================
// SCHEMA BOOTSTRAP (Non-destructive CREATE TABLE IF NOT EXISTS)
// =========================================================================

let schemaInitialized = false;
let schemaInitPromise: Promise<void> | null = null;

export async function initSchema(): Promise<void> {
  if (schemaInitialized) return;
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    try {
      // 1. User Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" VARCHAR(255) PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "passwordHash" TEXT NOT NULL,
          "role" VARCHAR(50) DEFAULT 'CUSTOMER',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "walletBalance" DOUBLE PRECISION DEFAULT 1500.0,
          "kycStatus" VARCHAR(50),
          "kycGovIdUrl" TEXT,
          "kycFssaiUrl" TEXT,
          "kycDocumentExpiry" TIMESTAMP WITH TIME ZONE,
          "location" TEXT,
          "joinedDate" VARCHAR(100),
          "herdSize" VARCHAR(100),
          "storeName" VARCHAR(255),
          "storeDesc" TEXT,
          "storePhone" VARCHAR(100),
          "storeAddress" TEXT,
          "deliveryRadius" VARCHAR(100),
          "dispatchTime" VARCHAR(100),
          "deliveryFee" DOUBLE PRECISION DEFAULT 0.0,
          "status" VARCHAR(50) DEFAULT 'Active',
          "wishlist" TEXT[] DEFAULT '{}'
        );
      `);

      // 2. Product Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "Product" (
          "id" VARCHAR(255) PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "price" DOUBLE PRECISION NOT NULL,
          "unit" VARCHAR(100) NOT NULL,
          "description" TEXT NOT NULL,
          "image" TEXT NOT NULL,
          "stock" INTEGER NOT NULL,
          "category" VARCHAR(100) NOT NULL,
          "farmerId" VARCHAR(255) NOT NULL,
          "status" VARCHAR(50) DEFAULT 'Active',
          "badge" VARCHAR(100),
          "rating" DOUBLE PRECISION DEFAULT 5.0
        );
      `);

      // 3. DeliveryItem Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "DeliveryItem" (
          "id" VARCHAR(255) PRIMARY KEY,
          "customerId" VARCHAR(255) NOT NULL,
          "customerName" VARCHAR(255) NOT NULL,
          "address" TEXT NOT NULL,
          "date" VARCHAR(100) NOT NULL,
          "product" VARCHAR(255) NOT NULL,
          "quantity" VARCHAR(100) NOT NULL,
          "price" DOUBLE PRECISION NOT NULL,
          "status" VARCHAR(50) DEFAULT 'Scheduled',
          "farmerId" VARCHAR(255) NOT NULL,
          "skippedDates" TEXT[] DEFAULT '{}',
          "temperatureLogs" DOUBLE PRECISION[] DEFAULT '{}'
        );
      `);

      // 4. Review Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "Review" (
          "id" VARCHAR(255) PRIMARY KEY,
          "customerId" VARCHAR(255) NOT NULL,
          "customerName" VARCHAR(255) NOT NULL,
          "farmerId" VARCHAR(255) NOT NULL,
          "farmerName" VARCHAR(255) NOT NULL,
          "rating" INTEGER NOT NULL,
          "text" TEXT NOT NULL,
          "date" VARCHAR(100) NOT NULL,
          "product" VARCHAR(255) NOT NULL,
          "status" VARCHAR(50) DEFAULT 'Approved'
        );
      `);

      // 5. Transaction Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "Transaction" (
          "id" VARCHAR(255) PRIMARY KEY,
          "userId" VARCHAR(255) NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "type" VARCHAR(50) NOT NULL,
          "description" TEXT NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 6. PlatformSettings Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "PlatformSettings" (
          "id" INTEGER PRIMARY KEY DEFAULT 1,
          "commissionRate" DOUBLE PRECISION DEFAULT 10.0,
          "baseDeliveryFee" DOUBLE PRECISION DEFAULT 15.0,
          "payoutCycle" VARCHAR(100) DEFAULT 'Weekly',
          "kycRequired" BOOLEAN DEFAULT true
        );
      `);

      // 7. TrackingLocation Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "TrackingLocation" (
          "id" INTEGER PRIMARY KEY DEFAULT 1,
          "lat" DOUBLE PRECISION DEFAULT 28.4595,
          "lng" DOUBLE PRECISION DEFAULT 77.0266,
          "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 8. RefreshToken Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "RefreshToken" (
          "id" VARCHAR(255) PRIMARY KEY,
          "token" TEXT UNIQUE NOT NULL,
          "userId" VARCHAR(255) NOT NULL,
          "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL
        );
      `);

      // 9. AuditLog Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "AuditLog" (
          "id" VARCHAR(255) PRIMARY KEY,
          "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "action" VARCHAR(255) NOT NULL,
          "adminId" VARCHAR(255) NOT NULL,
          "adminName" VARCHAR(255) NOT NULL,
          "details" TEXT NOT NULL
        );
      `);

      schemaInitialized = true;
    } catch (err: any) {
      console.error("[PostgreSQL Schema Init Warning]:", err.message);
    }
  })();

  return schemaInitPromise;
}

// =========================================================================
// SEEDING (Only if Database is Fresh/Empty)
// =========================================================================

export async function seedIfNeeded(): Promise<void> {
  await initSchema();

  try {
    const res = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM "User"');
    const userCount = parseInt(res.rows[0]?.count || "0", 10);
    if (userCount > 0) return;

    console.log("[PostgreSQL] Empty database detected. Seeding initial baseline accounts...");

    const adminPass = hashPassword("admin123");
    const customerPass = hashPassword("customer123");
    const farmerPass = hashPassword("farmer123");

    // 1. Seed Users
    await pool.query(
      `INSERT INTO "User" (
        "id", "name", "email", "passwordHash", "role", "joinedDate"
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("id") DO NOTHING`,
      ["admin-01", "ApnaDoodh Admin", "admin@apnadoodh.com", adminPass, "SUPER_ADMIN", "Jan 12, 2026"]
    );

    await pool.query(
      `INSERT INTO "User" (
        "id", "name", "email", "passwordHash", "role", "walletBalance", "location", "joinedDate", "status", "wishlist"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT ("id") DO NOTHING`,
      [
        "customer-01",
        "Rahul Verma",
        "customer@apnadoodh.com",
        customerPass,
        "CUSTOMER",
        1430.0,
        "Flat 402, Block C, Maple Heights, Sector 56, Gurugram, Haryana - 122011",
        "Jan 15, 2026",
        "Active",
        ["ghee", "butter"],
      ]
    );

    await pool.query(
      `INSERT INTO "User" (
        "id", "name", "email", "passwordHash", "role", "kycStatus", "kycGovIdUrl", "kycFssaiUrl",
        "kycDocumentExpiry", "storeName", "storeDesc", "storePhone", "storeAddress", "deliveryRadius",
        "dispatchTime", "deliveryFee", "joinedDate", "herdSize"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT ("id") DO NOTHING`,
      [
        "farmer-01",
        "Sukhdev Singh",
        "farmer@apnadoodh.com",
        farmerPass,
        "FARMER",
        "Verified",
        "gov-id-farmer-01.pdf",
        "fssai-farmer-01.pdf",
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        "Govardhan A2 Dairy",
        "Premium grass-fed Gir cow milk, pure Vedic-churned ghee, and traditional dairy products delivered directly from farm to table.",
        "+91 98765 00000",
        "Farm No. 4, Aravali Foothills Rural Zone, near Sector 62, Gurugram, Haryana",
        "8 km",
        "5:00 AM",
        0.0,
        "Jan 12, 2026",
        "35 Cows",
      ]
    );

    await pool.query(
      `INSERT INTO "User" (
        "id", "name", "email", "passwordHash", "role", "kycStatus", "kycGovIdUrl", "kycFssaiUrl",
        "kycDocumentExpiry", "storeName", "storeDesc", "storePhone", "storeAddress", "deliveryRadius",
        "dispatchTime", "deliveryFee", "joinedDate", "herdSize"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT ("id") DO NOTHING`,
      [
        "farmer-02",
        "Manpreet Singh",
        "aravali@gmail.com",
        farmerPass,
        "FARMER",
        "Verified",
        "gov-id-farmer-02.pdf",
        "fssai-farmer-02.pdf",
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 300),
        "Aravali Foothills Dairy",
        "Handcrafted paneer and fresh white table butter made daily in rural Gurugram.",
        "+91 98765 11111",
        "Sector 71 rural pastures, Gurugram",
        "6 km",
        "5:30 AM",
        15.0,
        "Feb 05, 2026",
        "22 Buffaloes & 10 Cows",
      ]
    );

    // 2. Seed Products
    const productsSeed = [
      ["prod-1", "Pure A2 Gir Cow Raw Milk", 85.0, "1 Liter", "Farm fresh, unpasteurized, non-homogenized pure A2 milk from grass-fed indigenous Gir cows.", "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800", 45, "A2 Milk", "farmer-01", "Active", "Bestseller", 4.9],
      ["prod-2", "Traditional Bilona A2 Desi Ghee", 1450.0, "500 ml", "Made using the ancient Vedic Bilona method from curd churned butter of grass-fed Gir cows.", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800", 20, "Ghee", "farmer-01", "Active", "Vedic Churned", 5.0],
      ["prod-3", "Fresh Malai Paneer", 120.0, "250g", "Soft, melt-in-mouth cottage cheese crafted from fresh full-cream milk every morning.", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800", 30, "Paneer", "farmer-02", "Active", "Fresh Daily", 4.8],
      ["prod-4", "Artisanal White Makkhan", 220.0, "250g", "Unsalted traditional white table butter churned fresh every dawn from whole milk.", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800", 15, "Butter", "farmer-02", "Active", "No Additives", 4.9],
      ["prod-5", "Fresh Raw Buffalo Milk", 75.0, "1 Liter", "Rich, creamy 7.5% fat whole buffalo milk ideal for kheer, tea, and thick curd.", "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&q=80&w=800", 60, "Buffalo Milk", "farmer-02", "Active", "Rich & Creamy", 4.7],
      ["prod-6", "Probiotic Natural Set Dahi", 60.0, "400g", "Thick, naturally fermented clay-pot curd rich in gut-healthy traditional probiotics.", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800", 25, "Curd", "farmer-01", "Active", "Probiotic", 4.8],
    ];

    for (const p of productsSeed) {
      await pool.query(
        `INSERT INTO "Product" (
          "id", "name", "price", "unit", "description", "image", "stock", "category", "farmerId", "status", "badge", "rating"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT ("id") DO NOTHING`,
        p
      );
    }

    // 3. Seed PlatformSettings & TrackingLocation
    await pool.query(
      `INSERT INTO "PlatformSettings" ("id", "commissionRate", "baseDeliveryFee", "payoutCycle", "kycRequired")
       VALUES (1, 10.0, 15.0, 'Weekly', true)
       ON CONFLICT ("id") DO NOTHING`
    );

    await pool.query(
      `INSERT INTO "TrackingLocation" ("id", "lat", "lng", "lastUpdated")
       VALUES (1, 28.4595, 77.0266, NOW())
       ON CONFLICT ("id") DO NOTHING`
    );

    console.log("[PostgreSQL] Seed data loaded successfully.");
  } catch (err: any) {
    console.error("[PostgreSQL Seeding Warning]:", err.message);
  }
}

// =========================================================================
// USER OPERATIONS
// =========================================================================

export async function getUsers(): Promise<User[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "User" ORDER BY "createdAt" ASC');
  return res.rows.map(mapUser);
}

export async function getUserById(id: string): Promise<User | null> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "User" WHERE "id" = $1 LIMIT 1', [id]);
  return res.rows[0] ? mapUser(res.rows[0]) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "User" WHERE LOWER("email") = LOWER($1) LIMIT 1', [email]);
  return res.rows[0] ? mapUser(res.rows[0]) : null;
}

export async function addUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  await seedIfNeeded();
  const id = crypto.randomUUID();
  const joinedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const walletBalance = user.role === "CUSTOMER" ? 1500.0 : user.walletBalance || null;
  const kycStatus = user.role === "FARMER" ? "Pending" : null;

  const res = await pool.query(
    `INSERT INTO "User" (
      "id", "name", "email", "passwordHash", "role", "walletBalance", "kycStatus",
      "location", "joinedDate", "herdSize", "storeName", "storeDesc", "storePhone",
      "storeAddress", "deliveryRadius", "dispatchTime", "deliveryFee", "status", "wishlist"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    ) RETURNING *`,
    [
      id,
      user.name,
      user.email,
      user.passwordHash,
      user.role || "CUSTOMER",
      walletBalance,
      kycStatus,
      user.location || null,
      joinedDate,
      user.herdSize || null,
      user.storeName || null,
      user.storeDesc || null,
      user.storePhone || null,
      user.storeAddress || null,
      user.deliveryRadius || null,
      user.dispatchTime || null,
      user.deliveryFee || 0.0,
      "Active",
      user.wishlist || [],
    ]
  );

  return mapUser(res.rows[0]);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  await seedIfNeeded();
  const existing = await getUserById(id);
  if (!existing) throw new Error("User not found");

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const allowedFields = [
    "name", "email", "passwordHash", "role", "walletBalance", "kycStatus",
    "kycGovIdUrl", "kycFssaiUrl", "kycDocumentExpiry", "location", "joinedDate",
    "herdSize", "storeName", "storeDesc", "storePhone", "storeAddress",
    "deliveryRadius", "dispatchTime", "deliveryFee", "status", "wishlist"
  ];

  for (const key of allowedFields) {
    if (key in updates) {
      fields.push(`"${key}" = $${idx++}`);
      let val = (updates as any)[key];
      if (key === "kycDocumentExpiry" && val) val = new Date(val);
      values.push(val);
    }
  }

  if (fields.length === 0) return existing;

  values.push(id);
  const sql = `UPDATE "User" SET ${fields.join(", ")} WHERE "id" = $${idx} RETURNING *`;
  const res = await pool.query(sql, values);
  return mapUser(res.rows[0]);
}

// =========================================================================
// PRODUCT OPERATIONS
// =========================================================================

export async function getProducts(): Promise<Product[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "Product" ORDER BY "name" ASC');
  return res.rows.map(mapProduct);
}

export async function addProduct(product: Omit<Product, "id" | "status">): Promise<Product> {
  await seedIfNeeded();
  const id = crypto.randomUUID();
  const res = await pool.query(
    `INSERT INTO "Product" (
      "id", "name", "price", "unit", "description", "image", "stock", "category",
      "farmerId", "status", "badge", "rating"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      id,
      product.name,
      product.price,
      product.unit,
      product.description,
      product.image,
      product.stock,
      product.category,
      product.farmerId,
      "Active",
      product.badge || null,
      product.rating || 5.0,
    ]
  );
  return mapProduct(res.rows[0]);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await seedIfNeeded();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const allowedFields = ["name", "price", "unit", "description", "image", "stock", "category", "farmerId", "status", "badge", "rating"];
  for (const key of allowedFields) {
    if (key in updates) {
      fields.push(`"${key}" = $${idx++}`);
      values.push((updates as any)[key]);
    }
  }

  if (fields.length === 0) {
    const res = await pool.query('SELECT * FROM "Product" WHERE "id" = $1', [id]);
    return mapProduct(res.rows[0]);
  }

  values.push(id);
  const sql = `UPDATE "Product" SET ${fields.join(", ")} WHERE "id" = $${idx} RETURNING *`;
  const res = await pool.query(sql, values);
  return mapProduct(res.rows[0]);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await seedIfNeeded();
  const res = await pool.query('DELETE FROM "Product" WHERE "id" = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// =========================================================================
// DELIVERIES & DAILY DROPS OPERATIONS
// =========================================================================

export async function getDeliveries(): Promise<DeliveryItem[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "DeliveryItem" ORDER BY "date" ASC');
  return res.rows.map(mapDeliveryItem);
}

export async function addDelivery(delivery: Omit<DeliveryItem, "id">): Promise<DeliveryItem> {
  await seedIfNeeded();
  const id = "DLV-" + Math.floor(100 + Math.random() * 900);
  const res = await pool.query(
    `INSERT INTO "DeliveryItem" (
      "id", "customerId", "customerName", "address", "date", "product", "quantity",
      "price", "status", "farmerId", "skippedDates", "temperatureLogs"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      id,
      delivery.customerId,
      delivery.customerName,
      delivery.address,
      delivery.date,
      delivery.product,
      delivery.quantity,
      delivery.price,
      delivery.status || "Scheduled",
      delivery.farmerId,
      delivery.skippedDates || [],
      delivery.temperatureLogs || [],
    ]
  );
  return mapDeliveryItem(res.rows[0]);
}

export async function updateDeliveryStatus(id: string, status: DeliveryItem["status"]): Promise<DeliveryItem> {
  await seedIfNeeded();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const getRes = await client.query('SELECT * FROM "DeliveryItem" WHERE "id" = $1 FOR UPDATE', [id]);
    if (getRes.rows.length === 0) throw new Error("Delivery drop not found");
    const delivery = getRes.rows[0];
    const oldStatus = delivery.status;

    const updateRes = await client.query(
      'UPDATE "DeliveryItem" SET "status" = $1 WHERE "id" = $2 RETURNING *',
      [status, id]
    );

    // If status changed to Skipped, auto-refund customer wallet balance
    if (status === "Skipped" && oldStatus !== "Skipped") {
      const refundAmt = parseFloat(delivery.price);
      await client.query(
        'UPDATE "User" SET "walletBalance" = COALESCE("walletBalance", 0) + $1 WHERE "id" = $2',
        [refundAmt, delivery.customerId]
      );

      const txId = "TX-" + Math.floor(100 + Math.random() * 900);
      await client.query(
        `INSERT INTO "Transaction" ("id", "userId", "amount", "type", "description", "createdAt")
         VALUES ($1, $2, $3, 'CREDIT', $4, NOW())`,
        [txId, delivery.customerId, refundAmt, `Auto-Refund: Skipped drop ${delivery.id}`]
      );
    }

    await client.query("COMMIT");
    return mapDeliveryItem(updateRes.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function pauseCustomerDeliveries(customerId: string, isPaused: boolean): Promise<void> {
  await seedIfNeeded();
  const targetStatus = isPaused ? "Paused" : "Scheduled";
  const currentStatus = isPaused ? "Scheduled" : "Paused";
  await pool.query(
    'UPDATE "DeliveryItem" SET "status" = $1 WHERE "customerId" = $2 AND "status" = $3',
    [targetStatus, customerId, currentStatus]
  );
}

export async function skipDeliveryDate(id: string, date: string): Promise<DeliveryItem> {
  await seedIfNeeded();
  const getRes = await pool.query('SELECT * FROM "DeliveryItem" WHERE "id" = $1', [id]);
  if (getRes.rows.length === 0) throw new Error("Delivery drop not found");
  const delivery = getRes.rows[0];
  const skipped: string[] = Array.isArray(delivery.skippedDates) ? [...delivery.skippedDates] : [];
  if (!skipped.includes(date)) skipped.push(date);

  const res = await pool.query(
    'UPDATE "DeliveryItem" SET "skippedDates" = $1, "status" = $2 WHERE "id" = $3 RETURNING *',
    [skipped, "Skipped", id]
  );
  return mapDeliveryItem(res.rows[0]);
}

export async function logDeliveryTemperature(id: string, temperature: number): Promise<DeliveryItem> {
  await seedIfNeeded();
  const getRes = await pool.query('SELECT * FROM "DeliveryItem" WHERE "id" = $1', [id]);
  if (getRes.rows.length === 0) throw new Error("Delivery drop not found");
  const delivery = getRes.rows[0];
  const logs: number[] = Array.isArray(delivery.temperatureLogs) ? [...delivery.temperatureLogs] : [];
  logs.push(temperature);

  const res = await pool.query(
    'UPDATE "DeliveryItem" SET "temperatureLogs" = $1 WHERE "id" = $2 RETURNING *',
    [logs, id]
  );
  return mapDeliveryItem(res.rows[0]);
}

// =========================================================================
// TRANSACTIONS
// =========================================================================

export async function getTransactions(): Promise<Transaction[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "Transaction" ORDER BY "createdAt" DESC');
  return res.rows.map(mapTransaction);
}

export async function addTransaction(tx: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  await seedIfNeeded();
  const id = "TX-" + Math.floor(100 + Math.random() * 900);
  const res = await pool.query(
    `INSERT INTO "Transaction" ("id", "userId", "amount", "type", "description", "createdAt")
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [id, tx.userId, tx.amount, tx.type, tx.description]
  );
  return mapTransaction(res.rows[0]);
}

// =========================================================================
// REVIEWS
// =========================================================================

export async function getReviews(): Promise<Review[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "Review" ORDER BY "date" DESC');
  return res.rows.map(mapReview);
}

export async function addReview(review: Omit<Review, "id" | "status" | "date">): Promise<Review> {
  await seedIfNeeded();
  const id = "REV-" + Math.floor(100 + Math.random() * 900);
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const res = await pool.query(
    `INSERT INTO "Review" (
      "id", "customerId", "customerName", "farmerId", "farmerName", "rating",
      "text", "date", "product", "status"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      id,
      review.customerId,
      review.customerName,
      review.farmerId,
      review.farmerName,
      review.rating,
      review.text,
      date,
      review.product,
      "Approved",
    ]
  );
  return mapReview(res.rows[0]);
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<Review> {
  await seedIfNeeded();
  const res = await pool.query(
    'UPDATE "Review" SET "status" = $1 WHERE "id" = $2 RETURNING *',
    [status, id]
  );
  return mapReview(res.rows[0]);
}

// =========================================================================
// PLATFORM SETTINGS
// =========================================================================

export async function getPlatformSettings(): Promise<PlatformSettings> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "PlatformSettings" WHERE "id" = 1');
  if (res.rows.length === 0) {
    const insertRes = await pool.query(
      `INSERT INTO "PlatformSettings" ("id", "commissionRate", "baseDeliveryFee", "payoutCycle", "kycRequired")
       VALUES (1, 10.0, 15.0, 'Weekly', true) RETURNING *`
    );
    return mapPlatformSettings(insertRes.rows[0]);
  }
  return mapPlatformSettings(res.rows[0]);
}

export async function updatePlatformSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
  await seedIfNeeded();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const allowed = ["commissionRate", "baseDeliveryFee", "payoutCycle", "kycRequired"];
  for (const key of allowed) {
    if (key in updates) {
      fields.push(`"${key}" = $${idx++}`);
      values.push((updates as any)[key]);
    }
  }

  if (fields.length === 0) return await getPlatformSettings();

  const sql = `UPDATE "PlatformSettings" SET ${fields.join(", ")} WHERE "id" = 1 RETURNING *`;
  const res = await pool.query(sql, values);
  return mapPlatformSettings(res.rows[0]);
}

// =========================================================================
// TELEMETRY LOCATION TRACKING
// =========================================================================

export async function getTrackingLocation(): Promise<TrackingLocation> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "TrackingLocation" WHERE "id" = 1');
  if (res.rows.length === 0) {
    const insertRes = await pool.query(
      `INSERT INTO "TrackingLocation" ("id", "lat", "lng", "lastUpdated")
       VALUES (1, 28.4595, 77.0266, NOW()) RETURNING *`
    );
    return mapTrackingLocation(insertRes.rows[0]);
  }
  return mapTrackingLocation(res.rows[0]);
}

export async function updateTrackingLocation(lat: number, lng: number): Promise<TrackingLocation> {
  await seedIfNeeded();
  const res = await pool.query(
    'UPDATE "TrackingLocation" SET "lat" = $1, "lng" = $2, "lastUpdated" = NOW() WHERE "id" = 1 RETURNING *',
    [lat, lng]
  );
  return mapTrackingLocation(res.rows[0]);
}

// =========================================================================
// REFRESH TOKEN STORE
// =========================================================================

export async function addRefreshToken(userId: string, token: string): Promise<void> {
  await seedIfNeeded();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await pool.query(
    'INSERT INTO "RefreshToken" ("id", "token", "userId", "expiresAt") VALUES ($1, $2, $3, $4)',
    [id, token, userId, expiresAt]
  );
  await pool.query('DELETE FROM "RefreshToken" WHERE "expiresAt" < NOW()');
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "RefreshToken" WHERE "token" = $1', [token]);
  if (res.rows.length === 0) return null;
  const tokenDoc = res.rows[0];
  if (new Date(tokenDoc.expiresAt) < new Date()) {
    await pool.query('DELETE FROM "RefreshToken" WHERE "token" = $1', [token]);
    return null;
  }
  return mapRefreshToken(tokenDoc);
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await seedIfNeeded();
  await pool.query('DELETE FROM "RefreshToken" WHERE "token" = $1', [token]);
}

// =========================================================================
// AUDIT LOGS
// =========================================================================

export async function addAuditLog(
  action: string,
  adminId: string,
  adminName: string,
  details: string
): Promise<AuditLog> {
  await seedIfNeeded();
  const id = crypto.randomUUID();
  const res = await pool.query(
    `INSERT INTO "AuditLog" ("id", "action", "adminId", "adminName", "details", "timestamp")
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [id, action, adminId, adminName, details]
  );
  return mapAuditLog(res.rows[0]);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  await seedIfNeeded();
  const res = await pool.query('SELECT * FROM "AuditLog" ORDER BY "timestamp" DESC');
  return res.rows.map(mapAuditLog);
}
