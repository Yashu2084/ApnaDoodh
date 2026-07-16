"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, Award, Lightbulb, Shield, 
  Users, Leaf, HeartHandshake, Tractor 
} from "lucide-react";

export default function AboutValues() {
  const values = [
    {
      title: "Transparency",
      desc: "Open access to chemical logs and farmer pricing breakdowns.",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Quality",
      desc: "No additives, no preservatives, and dual daily safety checks.",
      icon: Award,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Innovation",
      desc: "Integrated digital ledgers and localized smart cold routes.",
      icon: Lightbulb,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Trust",
      desc: "Bridging urban families directly with verified local farmers.",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Community",
      desc: "Retaining dairy wealth inside rural village communities.",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Sustainability",
      desc: "Circular medical-grade glass bottle sanitizing cycles.",
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-teal-50", // keeping soft bg
    },
    {
      title: "Customer First",
      desc: "7:00 AM doorstep drop-offs and seamless subscription models.",
      icon: HeartHandshake,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Farmer Empowerment",
      desc: "Absolute seller price setting and direct daily cash payouts.",
      icon: Tractor,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-white overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-50/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Our Foundation</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Core Values
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            The values that guide every line of code we write and every bottle of milk we deliver.
          </p>
        </div>

        {/* 8 Grid Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl border border-slate-100 bg-slate-50/30 p-6 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 shadow-xs"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${val.bgColor} ${val.color} border border-slate-100/50 transition group-hover:scale-105 duration-300 shadow-inner`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-5 mb-2 group-hover:text-blue-600 transition">
                  {val.title}
                </h3>
                <p className="text-[11px] leading-5 text-slate-500 font-semibold text-justify">
                  {val.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
