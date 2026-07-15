"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Brand from "@/components/Brand";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPassword = customPass || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // Successful login, trigger global nav update and redirect
      // Wait, let's refresh or redirect, next middleware will route us
      router.refresh();
      
      const role = data.user.role;
      if (role === "SUPER_ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "FARMER") {
        router.push("/dashboard/farmer");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-2">
          <Brand width={150} height={120} />
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">Login to ApnaDoodh</h1>
        <p className="mt-2 text-slate-500 text-sm">
          Access your personalized dashboard and manage your role.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 h-32 w-32 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold p-4 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@gmail.com"
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? "Verifying Credentials..." : "Authenticate Account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Social Logins */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="/api/auth/oauth?provider=google"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="text-base">🌐</span> Google
          </a>
          <a
            href="/api/auth/oauth?provider=apple"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="text-base">🍎</span> Apple
          </a>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to ApnaDoodh?{" "}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </motion.div>


    </div>
  );
}
