import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

// Load environment variables before anything else
dotenv.config({ path: path.join(__dirname, "../.env") });

import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import deliveriesRouter from "./routes/deliveries";
import walletRouter from "./routes/wallet";
import reviewsRouter from "./routes/reviews";
import adminRouter from "./routes/admin";
import trackingRouter from "./routes/tracking";
import aiRouter from "./routes/ai";

const app = express();
const port = process.env.PORT || 3001;

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://www.apnadoodh.shop",
  "https://apnadoodh.shop",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, "")] : [])
];

const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Allow server-to-server / curl / Postman
  if (allowedOrigins.includes(origin)) return true;
  if (origin === "https://apnadoodh.shop" || origin.endsWith(".apnadoodh.shop")) return true;
  if (origin.endsWith(".vercel.app")) return true; // Allow Vercel preview deploys
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) return true;
  return false;
};

// CORS configuration using standard cors library + explicit fallback
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow but do not reflect unauthorized origins if needed
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Explicit Header Fallback Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  }

  // Handle preflight OPTIONS explicitly
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// Body parsers and cookies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Serve static public folder for invoices & uploads
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/invoices", express.static(path.join(__dirname, "../public/invoices")));

import { pool, seedIfNeeded } from "./lib/db";

// Health Check Endpoints
app.get("/health", async (_req, res) => {
  let dbStatus = "disconnected";
  let dbError: string | null = null;
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  
  try {
    const dbRes = await pool.query("SELECT 1 as ping");
    if (dbRes.rows.length > 0) {
      dbStatus = "connected";
    }
  } catch (err: any) {
    dbStatus = "error";
    dbError = err.message || err.code || String(err);
  }

  res.status(200).json({
    status: "ok",
    database: dbStatus,
    hasDatabaseUrl,
    dbError,
    service: "ApnaDoodh Backend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", async (_req, res) => {
  let dbStatus = "disconnected";
  let dbError: string | null = null;
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  
  try {
    const dbRes = await pool.query("SELECT 1 as ping");
    if (dbRes.rows.length > 0) {
      dbStatus = "connected";
    }
  } catch (err: any) {
    dbStatus = "error";
    dbError = err.message || err.code || String(err);
  }

  res.status(200).json({
    status: "ok",
    database: dbStatus,
    hasDatabaseUrl,
    dbError,
    service: "ApnaDoodh Backend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ApnaDoodh Backend API is live and operational",
    service: "ApnaDoodh Backend",
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/deliveries", deliveriesRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/ai", aiRouter);

// Fallback Route for non-existent API routes
app.use((req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});

app.listen(port, () => {
  console.log(`[ApnaDoodh Backend] Server listening on port ${port}`);
  console.log(`[ApnaDoodh Backend] Allowed Origins:`, allowedOrigins);
});
