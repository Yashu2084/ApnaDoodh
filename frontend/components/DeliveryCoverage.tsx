"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

export default function DeliveryCoverage() {
  const locations = [
    { name: "Gurugram", details: "Core hub • 20+ sectors served" },
    { name: "Delhi", details: "Selected South & West sectors" },
    { name: "Noida", details: "Active sectors 50, 62, 75, 137" },
    { name: "Faridabad", details: "Sector 14, 15, 21 coverage" },
    { name: "Ghaziabad", details: "Indirapuram & Vaishali hubs" },
    { name: "Sonipat", details: "New expansion sector routes" },
  ];

  return (
    <section 
      id="coverage" 
      className="w-full px-4 sm:px-8 lg:px-12 py-14 sm:py-20 border-t border-slate-100 bg-white relative overflow-hidden scroll-mt-24"
    >
      {/* Radial Dotted Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#356be9 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-50/60 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-4xl text-center mb-16 relative z-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Expansion Grid</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Where We Deliver
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-500">
          Fresh dairy products delivered across our growing cold-chain service network.
        </p>

        {/* Highlight Tag */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 shadow-sm backdrop-blur-xs">
          <MapPin className="h-4 w-4 text-blue-600 animate-bounce" />
          <span>30+ Locations Served Daily</span>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto relative z-10">
        {locations.map((loc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-start gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-5 shadow-xs backdrop-blur-xs transition hover:border-blue-200 hover:shadow-md"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">{loc.name}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{loc.details}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
