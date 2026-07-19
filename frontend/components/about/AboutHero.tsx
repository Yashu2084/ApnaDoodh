"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-8 lg:px-12 bg-white scroll-mt-24">
      {/* Dynamic Aurora Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-100/40 blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[70%] rounded-full bg-emerald-50/50 blur-3xl animate-pulse" style={{ animationDuration: "18s" }} />
      </div>

      <div className="max-w-6xl mx-auto w-full grid gap-12 lg:grid-cols-12 lg:items-center relative z-10">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Indian Dairy
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Connecting Farms <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 bg-clip-text text-transparent">
              With Every Home
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
          >
            ApnaDoodh is building India's trusted digital marketplace where local dairy farmers can grow their business while families enjoy fresh, transparent, and locally sourced dairy products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <a
              href="#story"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
            >
              Our Story
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 backdrop-blur-xs px-8 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 cursor-pointer"
            >
              Explore Products
            </a>
          </motion.div>
        </div>

        {/* Right Graphic Column */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100"
          >
            <Image
              src="/about-farmers.webp"
              alt="Indian Farmers standing in pasture"
              fill
              priority
              className="object-cover"
              sizes="(max-w-720px) 100vw, 400px"
            />
            
            {/* Dark gradient overlay for bottom text spacing */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating Stats Glass Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-12 -left-6 sm:-left-12 bg-white/85 border border-white/60 shadow-xl backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
              <ShieldCheck className="h-5.5 w-5.5" />
            </span>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lab Tested Purity</p>
              <p className="text-sm font-extrabold text-slate-900">100% Raw & Organic</p>
            </div>
          </motion.div>

          {/* Floating Stats Glass Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-16 -right-6 sm:-right-8 bg-white/85 border border-white/60 shadow-xl backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner">
              <Heart className="h-5.5 w-5.5" />
            </span>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Farmer Payouts</p>
              <p className="text-sm font-extrabold text-slate-900">Daily Fair Trade</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 pointer-events-none">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em]">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 shadow-xs"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.div>
      </div>
    </section>
  );
}
