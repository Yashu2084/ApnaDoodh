"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate server subscription
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-14 sm:py-20 bg-white border-t border-slate-100 relative overflow-hidden scroll-mt-24">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-50/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-50/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[3rem] border border-blue-100 bg-gradient-to-br from-blue-50/40 via-white to-blue-50/40 p-8 sm:p-12 lg:p-16 shadow-sm text-center relative overflow-hidden"
        >
          {/* Inner ambient glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Title / Header */}
            <div className="space-y-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50 mb-2">
                <Mail className="h-5.5 w-5.5" />
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Stay Updated With ApnaDoodh
              </h2>
              <p className="text-sm leading-6 text-slate-500 max-w-lg mx-auto">
                Receive updates about new farmers, fresh products, exclusive offers and platform news.
              </p>
            </div>

            {/* Subscribe Form / Success State */}
            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-6 space-y-4"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Successfully Subscribed!</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Thank you for joining. We have added your email to our newsletter dispatch queue.
                  </p>
                  <button
                    onClick={() => setIsSubscribed(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline cursor-pointer"
                  >
                    Subscribe with another email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="relative flex-grow">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4.5 w-4.5 text-blue-600" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 shadow-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-blue-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    No spam. Only valuable updates.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
