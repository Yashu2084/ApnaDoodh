"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Tractor, ShieldCheck, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section 
      id="home" 
      className="group relative w-full min-h-[90vh] flex items-center pt-28 pb-16 sm:pt-36 sm:pb-28 overflow-hidden scroll-mt-24"
    >
      {/* Animated Scenic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1.02, 1.07, 1.02],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/hero-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Overlays for luxury feel and high readability */}
        <div className="absolute inset-0 bg-slate-950/25 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Brand palette glowing circles */}
        <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[130px] pointer-events-none" />
        <div className="absolute right-10 bottom-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left Typography Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-left"
          >
            

            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Fresh Dairy Products <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-sky-300 bg-clip-text text-transparent">
                  From Trusted Local Farmers
                </span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-blue-50/90 sm:text-lg">
                Discover verified dairy farmers near you, compare products, read reviews, and order directly from the source. ApnaDoodh connects you straight to certified family farms, ensuring unadulterated cold-chain delivery within 12 hours of milking.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
              <Link
                href="/farmers/nearby"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Explore Farmers
                <Compass className="h-4 w-4" />
              </Link>
              <Link
                href="/farmer/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Become a Seller
                <Tractor className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-300" />
                  <p className="text-sm font-bold">100% Quality Audited</p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-blue-100/70">Every farmer is subject to 40+ daily chemical lab tests for fat, SNF, and contaminants.</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-2 text-white">
                  <Compass className="h-4.5 w-4.5 text-blue-300" />
                  <p className="text-sm font-bold">Traceable Origins</p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-blue-100/70">View veterinary registers, cattle health stats, and feed records of your chosen farmer.</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-2 text-white">
                  <Tractor className="h-4.5 w-4.5 text-blue-300" />
                  <p className="text-sm font-bold">Direct Farmer Payouts</p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-blue-100/70">No distributors or middlemen. 100% of product prices go directly to local producers.</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="h-4.5 w-4.5 text-blue-300" />
                  <p className="text-sm font-bold">Cattle Well-being First</p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-blue-100/70">Our partner farms prioritize open pastures, organic grazing, and zero synthetic hormones.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Graphic Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glass Card Wrapper */}
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-md max-w-md w-full transition-all duration-500 hover:bg-white/15 hover:border-white/20 hover:shadow-[0_25px_55px_rgba(53,107,233,0.15)] hover:scale-[1.03]">
              <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
              
              <Image
                src="/apnadoodh_hero.webp"
                alt="Premium ApnaDoodh Marketplace Farm Milk"
                width={400}
                height={500}
                priority
                className="w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-sm bg-blue-950/20"
              />
              
              <div className="mt-4 p-4 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">Fresh From Pasture</p>
                  <p className="text-base font-bold text-white mt-1">Direct Dairy Marketplace</p>
                </div>
                <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-200 border border-blue-400/20">
                  Local Farms
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
