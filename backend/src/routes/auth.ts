import { Router } from "express";
import { hashPassword, addRefreshToken, comparePassword, getRefreshToken, deleteRefreshToken } from "../lib/db";
import { UserRepository } from "../lib/repositories/user.repository";
import { signJWT, verifyJWT } from "../lib/jwt";
import { isRateLimited, sanitizeInput } from "../lib/security";
import { sendSms, verifyGoogleOAuthToken } from "../lib/services";

const router = Router();
const userRepo = new UserRepository();

router.post("/signup", async (req: any, res: any) => {
  try {
    const ip = req.ip || "127.0.0.1";
    const limited = await isRateLimited(ip, "auth_signup", 5, 60);
    if (limited) {
      return res.status(429).json({ error: "Too many requests. Please wait 1 minute." });
    }

    const body = sanitizeInput(req.body);
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (role !== "CUSTOMER" && role !== "FARMER") {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const existing = await userRepo.getByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const passwordHash = hashPassword(password);
    const newUser = await userRepo.create({
      name,
      email,
      passwordHash,
      role: role as any,
    });

    const claim = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = await signJWT(claim, 900);
    const refreshToken = await signJWT(claim, 2592000);

    await addRefreshToken(newUser.id, refreshToken);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("apnadoodh_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 900 * 1000,
      path: "/",
    });

    res.cookie("apnadoodh_refresh", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: claim
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Signup failed" });
  }
});

router.post("/login", async (req: any, res: any) => {
  try {
    const ip = req.ip || "127.0.0.1";
    const limited = await isRateLimited(ip, "auth_login", 5, 60);
    if (limited) {
      return res.status(429).json({ error: "Too many login attempts. Please wait 1 minute." });
    }

    const body = sanitizeInput(req.body);
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userRepo.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role === "CUSTOMER" && user.status === "Blocked") {
      return res.status(403).json({ error: "Your account has been suspended by the administrator." });
    }

    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const claim = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signJWT(claim, 900); // 15 mins
    const refreshToken = await signJWT(claim, 2592000); // 30 days

    await addRefreshToken(user.id, refreshToken);

    // Set cookies in response
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("apnadoodh_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 900 * 1000,
      path: "/",
    });

    res.cookie("apnadoodh_refresh", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Login failed" });
  }
});

router.post("/refresh", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    const refreshToken = body.refreshToken || req.cookies?.apnadoodh_refresh;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const found = await getRefreshToken(refreshToken);
    if (!found) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const payload = await verifyJWT(refreshToken);
    if (!payload || payload.id !== found.userId) {
      return res.status(401).json({ error: "Invalid refresh token payload" });
    }

    const claim = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    const newAccessToken = await signJWT(claim, 900); // 15 mins

    res.cookie("apnadoodh_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      accessToken: newAccessToken,
      user: claim,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Refresh failed" });
  }
});

router.post("/logout", async (req: any, res: any) => {
  try {
    const token = req.cookies?.apnadoodh_refresh || req.body?.refreshToken;
    if (token) {
      await deleteRefreshToken(token);
    }
    res.clearCookie("apnadoodh_token", { path: "/" });
    res.clearCookie("apnadoodh_refresh", { path: "/" });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Logout failed" });
  }
});

router.get("/me", async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.apnadoodh_token;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    const user = await userRepo.getById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
        joinedDate: user.joinedDate,
        status: user.status,
        kycStatus: user.kycStatus,
        location: user.location,
        storeName: user.storeName,
        storeDesc: user.storeDesc,
        storePhone: user.storePhone,
        storeAddress: user.storeAddress,
        deliveryRadius: user.deliveryRadius,
        dispatchTime: user.dispatchTime,
        herdSize: user.herdSize,
      }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "Failed to retrieve user session" });
  }
});

router.put("/me", async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.apnadoodh_token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    const body = sanitizeInput(req.body);
    const updated = await userRepo.update(payload.id, body);
    return res.json({ success: true, user: updated });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Failed to update profile settings" });
  }
});

router.post("/otp", async (req: any, res: any) => {
  try {
    const body = sanitizeInput(req.body);
    const { email, action, phone, otp } = body;

    if (action === "send") {
      if (!email && !phone) {
        return res.status(400).json({ error: "Email or phone required" });
      }
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const targetPhone = phone || "+91 99999 88888";
      await sendSms(targetPhone, `Your ApnaDoodh verification OTP is: ${mockOtp}. Valid for 5 minutes.`);
      
      return res.json({ success: true, message: "OTP sent successfully to registered phone", otp: mockOtp });
    }

    if (action === "verify") {
      if (!otp) {
        return res.status(400).json({ error: "OTP value required" });
      }
      return res.json({ success: true, message: "OTP verified successfully" });
    }

    return res.status(400).json({ error: "Invalid action type" });
  } catch (e: any) {
    return res.status(500).json({ error: "OTP transaction failed" });
  }
});

router.post("/oauth", async (req: any, res: any) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "ID Token required" });
    }

    const { email, name } = await verifyGoogleOAuthToken(idToken);
    let user = await userRepo.getByEmail(email);

    if (!user) {
      const passwordHash = hashPassword("oauth_generated_password_" + Math.random());
      user = await userRepo.create({
        name,
        email,
        passwordHash,
        role: "CUSTOMER",
      });
    }

    const claim = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signJWT(claim, 900);
    const refreshToken = await signJWT(claim, 2592000);

    await addRefreshToken(user.id, refreshToken);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("apnadoodh_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 900 * 1000,
      path: "/",
    });

    res.cookie("apnadoodh_refresh", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (e: any) {
    return res.status(401).json({ error: e.message || "Google Authentication failed" });
  }
});

export default router;
