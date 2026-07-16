"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-12 text-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 h-36 w-36 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-inner">
            <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: "12s" }} />
          </span>
        </div>

        <h1 className="text-6xl font-black text-blue-600 tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900 leading-tight">Page Not Found</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 font-medium">
          The dairy lane you are looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
          >
            Browse Dairies
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
