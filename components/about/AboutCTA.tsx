"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Tractor, ShoppingBag } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-16 py-16 bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-5xl rounded-[3rem] border border-blue-800 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
      >
        {/* Animated Background Mesh Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -20, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
            }}
            className="absolute -top-[30%] -right-[10%] w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -15, 15, 0],
              y: [0, 15, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "easeInOut",
            }}
            className="absolute -bottom-[30%] -left-[10%] w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"
          />
        </div>

        {/* Content Column */}
        <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3.5 py-1 text-[10px] font-black text-blue-300 uppercase tracking-wider">
            <Tractor className="h-3.5 w-3.5" /> Join Our Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Become Part of the <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-sky-300 bg-clip-text text-transparent">
              Future of Dairy
            </span>
          </h2>
          <p className="text-xs sm:text-sm leading-6 text-slate-200 text-justify font-medium">
            Whether you are a conscious customer looking for chemical-free pasture milk or a local family dairy farmer seeking fair prices and daily payouts, ApnaDoodh is built for you.
          </p>
        </div>

        {/* Action Buttons Column */}
        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-black text-slate-900 shadow-xl transition hover:bg-slate-50 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            Explore Farmers
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/farmer/register"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xs px-8 py-4 text-xs font-black text-white transition hover:bg-white/10 hover:border-white/40 active:scale-95 cursor-pointer"
          >
            Become a Seller
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
