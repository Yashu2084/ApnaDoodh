import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import deliveriesRouter from "./routes/deliveries";
import walletRouter from "./routes/wallet";
import reviewsRouter from "./routes/reviews";
import adminRouter from "./routes/admin";
import trackingRouter from "./routes/tracking";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.apnadoodh.shop",
  "https://apnadoodh.shop"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  const isAllowed = !origin || 
                    allowedOrigins.includes(origin) || 
                    origin.endsWith(".apnadoodh.shop") || 
                    origin === "https://apnadoodh.shop" ||
                    origin.startsWith("http://localhost:") || 
                    origin.startsWith("http://127.0.0.1:");

  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, X-Requested-With");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Serve static public folder for invoices & uploads
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/invoices", express.static(path.join(__dirname, "../public/invoices")));

// REST API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/deliveries", deliveriesRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tracking", trackingRouter);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});

app.listen(port, () => {
console.log("Allowed Origins:", allowedOrigins);
});
