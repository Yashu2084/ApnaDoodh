"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Coins, Lock, Truck, Star } from "lucide-react";

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Verified Farmers",
      desc: "Only verified and trusted local dairy vendors those who meet our quality standards and adhere to ethical practices.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "group-hover:border-blue-200",
      glowColor: "group-hover:shadow-blue-500/5",
    },
    {
      title: "Farm Fresh Products",
      desc: "Fresh milk and dairy products sourced directly from local farms to ensure maximum freshness and quality.",
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "group-hover:border-emerald-200",
      glowColor: "group-hover:shadow-emerald-500/5",
    },
    {
      title: "Fair Prices",
      desc: "Transparent pricing with no unnecessary middlemen to reduce costs of dairy products.",
      icon: Coins,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "group-hover:border-amber-200",
      glowColor: "group-hover:shadow-amber-500/5",
    },
    {
      title: "Secure Payments",
      desc: "Safe online payment with trusted payment gateways to ensure transaction security.",
      icon: Lock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "group-hover:border-indigo-200",
      glowColor: "group-hover:shadow-indigo-500/5",
    },
    {
      title: "Fast Local Delivery",
      desc: "Quick doorstep delivery from nearby farmers so you get your fresh dairy products fast in the comfort of your home that too early morning.",
      icon: Truck,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "group-hover:border-rose-200",
      glowColor: "group-hover:shadow-rose-500/5",
    },
    {
      title: "Trusted Reviews",
      desc: "Verified customer reviews and transparent ratings to help you make informed decisions.",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "group-hover:border-yellow-200",
      glowColor: "group-hover:shadow-yellow-500/5",
    },
  ];

  return (
    <section id="why-us" className="group relative w-full min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden border-t border-slate-200 scroll-mt-24">
      {/* Animated Scenic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.02, 1.08, 1.02],
            x: [-4, 4, -4],
            y: [-3, 3, -3],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute -inset-4"
          style={{
            backgroundImage: "url('/bg-pasture-1.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(0.85) contrast(1.05) brightness(0.88) blur(1.5px)",
          }}
        />
        {/* Soft color-graded overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/65 via-blue-950/25 to-sky-100/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-slate-900/35 to-slate-950/75" />
        
        {/* Glowing light source orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-sky-200/10 blur-[120px]" />
      </div>

      {/* Section Header wrapped in a liquid glass panel */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-16 p-8 sm:p-10 rounded-[2.5rem] border border-white/40 bg-white/60 backdrop-blur-md shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Platform Core Values</p>
        <h2 className="mt-3.5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Why Choose ApnaDoodh
        </h2>
        <p className="mt-3.5 text-sm leading-6 text-slate-800 font-semibold max-w-2xl mx-auto">
          Enjoy premium unadulterated dairy straight from local family farms, delivered with traceability and care.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group relative rounded-[2rem] border border-white/45 bg-white/70 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/85 hover:border-white/60 hover:shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor} ${card.color} border border-white/40 transition group-hover:scale-110 duration-300 shadow-xs`}>
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="text-base font-extrabold text-slate-950">{card.title}</h3>
              </div>
              <p className="text-xs leading-6 text-slate-800 font-semibold mt-4 text-justify">
                {card.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
