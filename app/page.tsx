"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Star, ShoppingBag, Truck, Tractor, ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import FarmerSection from "@/components/FarmerSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import SearchSection from "@/components/SearchSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrustStats from "@/components/TrustStats";
import DownloadApp from "@/components/DownloadApp";

export default function Home() {
  return (
    <>
      <HeroSection />
      
      {/* Search Bar Section (Place below Hero) */}
      <SearchSection />

      {/* Why Choose ApnaDoodh Section */}
      <WhyChooseUs />

      {/* Trust Statistics Section */}
      <TrustStats />
      
      {/* 1. Featured Farmers (from FarmerSection component) */}
      <FarmerSection />
      
      {/* 2. Popular Products (from ProductsSection component) */}
      <ProductsSection />

      {/* 3. How It Works Section */}
      <section className="group relative w-screen left-1/2 -translate-x-1/2 min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-24 overflow-hidden border-t border-slate-200">
        {/* Animated Scenic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1.02, 1.08, 1.02],
              x: [-4, 4, -4],
              y: [3, -3, 3],
            }}
            transition={{
              repeat: Infinity,
              duration: 26,
              ease: "easeInOut",
            }}
            className="absolute -inset-4"
            style={{
              backgroundImage: "url('/bg-pasture-1.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "saturate(1.0) contrast(1.0) brightness(0.9)", // Keep background quality intact (no blur, standard colors)
            }}
          />
          {/* Soft color-graded overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 via-blue-950/15 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-slate-900/20 to-slate-950/65" />
          
          {/* Glowing light source orbs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-sky-200/10 blur-[120px]" />
        </div>

        {/* Section Header wrapped in an enhanced liquid glass panel */}
        <div className="relative z-10 mx-auto max-w-3xl text-center mb-16 p-8 sm:p-10 rounded-[2.5rem] border border-white/50 bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.18)]">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Traceability Lifecycle</p>
          <h2 className="mt-3.5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            How ApnaDoodh Works
          </h2>
          <p className="mt-3.5 text-sm leading-6 text-slate-900 font-bold max-w-2xl mx-auto">
            A transparent connection from India's green pastures straight to your doorstep bag.
          </p>
        </div>

        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto w-full">
          {[
            {
              step: "01",
              title: "Find Farmers",
              desc: "Browse verified local farms nearby and learn about their cow breeds and organic pastures.",
              icon: Compass,
            },
            {
              step: "02",
              title: "Compare Reviews",
              desc: "Compare direct customer feedback and daily lab-verified chemical fat/SNF purity logs.",
              icon: Star,
            },
            {
              step: "03",
              title: "Order Products",
              desc: "Add organic A2 milk, hand-made paneer, or set dahi from your preferred farm to your cart.",
              icon: ShoppingBag,
            },
            {
              step: "04",
              title: "Receive Delivery",
              desc: "Our temperature-locked cold courier fleet drops off your order quietly before 7:00 AM.",
              icon: Truck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-[2.5rem] border border-white/50 bg-white/80 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] hover:bg-white/90 hover:border-white/70 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-400/80 font-inter">{item.step}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/90 border border-blue-200/50 text-blue-700 shadow-xs">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-950 mt-6">{item.title}</h3>
                <p className="text-xs leading-5 text-slate-900 font-bold mt-2 text-justify">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Become A Seller Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl rounded-[3rem] border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/60 px-3.5 py-1 text-[10px] font-bold text-blue-700">
              <Tractor className="h-3.5 w-3.5" /> For Dairy Farmers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Are You a Local Dairy Farmer?
            </h2>
            <p className="text-sm leading-6 text-slate-500 text-justify">
              Set your own prices, showcase pasture reports, and reach thousands of conscious Gurugram buyers. ApnaDoodh handles early morning cold-chain collection and deliveries, paying you daily with zero hidden commissions.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/farmer/register"
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
            >
              Onboard Your Farm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Download App (Coming Soon) Section */}
      <DownloadApp />

      {/* 5. Reviews Section */}
      <ReviewsSection />

      {/* 6. FAQ Section */}
      <FAQSection />
    </>
  );
}
