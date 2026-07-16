"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Milk, ShieldCheck, Heart } from "lucide-react";

export default function AboutMission() {
  const missions = [
    {
      title: "Empower Farmers",
      desc: "Providing local dairy farmers direct access to high-margin markets, absolute pricing freedom, daily payouts, and cold storage support to grow sustainable businesses.",
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      glowColor: "group-hover:shadow-emerald-500/10",
      borderColor: "group-hover:border-emerald-200",
    },
    {
      title: "Deliver Fresh Dairy",
      desc: "Ensuring pure, unadulterated raw milk and freshly set dairy items reach doorsteps under 12 hours of milking, locked at optimal refrigeration temperatures.",
      icon: Milk,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      glowColor: "group-hover:shadow-blue-500/10",
      borderColor: "group-hover:border-blue-200",
    },
    {
      title: "Build Trust",
      desc: "Pioneering traceability by publishing chemical purity and SNF fat quality logs online every single morning, giving consumers ultimate safety insurance.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      glowColor: "group-hover:shadow-blue-500/10",
      borderColor: "group-hover:border-blue-200",
    },
    {
      title: "Support Local Communities",
      desc: "Keeping agricultural wealth within local farming families, supporting organic dairy practices, and funding community-driven cow husbandry models.",
      icon: Heart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      glowColor: "group-hover:shadow-emerald-500/10",
      borderColor: "group-hover:border-emerald-200",
    },
  ];

  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-slate-50/30 overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-50/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Our Pillars</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Our Core Mission
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            Building a dairy marketplace that protects the interests of primary food creators and ensures wholesome nutrition for families.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          {missions.map((mission, idx) => {
            const Icon = mission.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`group relative rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-8 transition-all duration-300 shadow-xs hover:shadow-2xl ${mission.borderColor} ${mission.glowColor}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${mission.bgColor} ${mission.color} border border-slate-100/50 transition group-hover:scale-110 duration-300 shadow-inner`}>
                    <Icon className="h-6.5 w-6.5" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{mission.title}</h3>
                </div>
                <p className="text-xs sm:text-sm leading-6 text-slate-500 mt-5 text-justify font-medium">
                  {mission.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
