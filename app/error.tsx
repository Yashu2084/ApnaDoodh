"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the server or local text logs
    console.error("ErrorBoundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-12 text-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-50/50 border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 h-36 w-36 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-inner">
            <AlertTriangle className="h-8 w-8" />
          </span>
        </div>

        <h1 className="text-3xl font-black text-rose-600 tracking-tight leading-none">Application Error</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500 font-medium">
          A processing exception occurred while loading this page. Our team has been notified.
        </p>

        {error.message && (
          <div className="mt-4 p-3 bg-slate-100/60 border border-slate-200 rounded-xl text-left text-xs font-mono text-slate-600 break-all select-all">
            {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Go back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
