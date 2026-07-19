"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User, Tractor } from "lucide-react";
import Brand from "@/components/Brand";

import { apiFetch, setCookie } from "@/lib/api-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "FARMER">("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Save tokens to cookies client-side for Next.js middleware visibility
      if (data.accessToken) {
        setCookie("apnadoodh_token", data.accessToken, 900); // 15 mins
      }
      if (data.refreshToken) {
        setCookie("apnadoodh_refresh", data.refreshToken, 2592000); // 30 days
      }

      router.refresh();
      if (role === "FARMER") {
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
    <div className="pt-28 pb-16 sm:pt-36 sm:pb-24 max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-2">
          <Brand width={150} height={120} />
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">Create ApnaDoodh Account</h1>
        <p className="mt-2 text-slate-500 text-sm">
          Select your role and start your journey on the marketplace.
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

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
              suppressHydrationWarning
            />
          </div>

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

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-3">Choose Account Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  role === "CUSTOMER"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600"
                    : "border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50"
                }`}
                suppressHydrationWarning
              >
                <User className="h-5 w-5" />
                <span className="text-[10px] font-extrabold tracking-wide uppercase">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("FARMER")}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  role === "FARMER"
                    ? "border-amber-500 bg-amber-500/10 text-amber-700"
                    : "border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50"
                }`}
                suppressHydrationWarning
              >
                <Tractor className="h-5 w-5" />
                <span className="text-[10px] font-extrabold tracking-wide uppercase">Farmer / Seller</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? "Registering Profile..." : "Create Free Account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Log In here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
