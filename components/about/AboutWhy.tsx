"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Users, PiggyBank, Clock, ClipboardCheck, Lock, Recycle } from "lucide-react";

export default function AboutWhy() {
  const cards = [
    {
      title: "Direct Farmer Connections",
      desc: "Connect with the exact family farm producing your milk. No centralized aggregation, no blending of different farmers' outputs.",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Transparent Pricing",
      desc: "We display exactly how much of your purchase goes straight to the farmer. Removing middlemen ensures farmers earn what they deserve.",
      icon: PiggyBank,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Fresh Every Morning",
      desc: "Our delivery fleet collects fresh milk, chills it to 4°C, and delivers it to your doorstep before 7:00 AM in under 12 hours.",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Verified Dairy Farmers",
      desc: "Every vendor farm undergoes frequent checks for organic pasture feed, veterinary hygiene, and zero hormones.",
      icon: ClipboardCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Secure Marketplace",
      desc: "Integrated digital ledgers automate daily payouts directly to farmers, securing subscriptions and refunds instantly.",
      icon: Lock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Sustainable Local Commerce",
      desc: "We package in sterilized medical-grade glass bottles, collecting empty bottles daily to wash and reuse, avoiding plastic landfills.",
      icon: Recycle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-white overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-50/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Why We Exist</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A Better Way to Buy Dairy
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            ApnaDoodh replaces the broken traditional dairy model with a direct-trade ecosystem built on purity, technology, and mutual benefit.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative rounded-[2rem] border border-slate-100 bg-slate-50/50 p-7 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor} ${card.color} border border-slate-100/50 transition group-hover:scale-110 duration-300`}>
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">{card.title}</h3>
                </div>
                <p className="text-xs leading-6 text-slate-500 mt-4 text-justify font-medium">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
