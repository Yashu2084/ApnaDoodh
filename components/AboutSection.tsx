"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Snowflake, CalendarDays, ArrowRight, Heart } from "lucide-react";

export default function AboutSection() {
  const pillars = [
    {
      title: "Ethical Cow Care & Open Pastures",
      desc: "Cattle feed on organic green fodder and custom grains. Absolutely zero synthetic hormones, antibiotics, or chemical enhancers are permitted.",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Strict Cold Chain Logistics",
      desc: "Milk chilled immediately to lock in nutrients. Maintained strictly under 4°C during packaging in glass bottles and transit.",
      icon: Snowflake,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contactless Morning Drops",
      desc: "Runners deliver fresh bottles to doorsteps before 7:00 AM. We collect and sterilize glass bottles in a zero-waste loop.",
      icon: CalendarDays,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section id="about" className="relative w-full px-6 sm:px-12 lg:px-16 py-24 border-t border-slate-100 bg-white overflow-hidden">
      {/* Background soft light */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-50/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Visual Farmer Graphic & Stats */}
          <div className="lg:col-span-6 space-y-8">
            <div className="relative">
              {/* Outer Image container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100"
              >
                <Image
                  src="/about-farmers.webp"
                  alt="Organic Dairy Farmer in India"
                  fill
                  className="object-cover object-top"
                  sizes="(max-w-720px) 100vw, 600px"
                />
              </motion.div>

              {/* Floating Quality Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute -bottom-6 -right-4 sm:right-6 bg-white/90 border border-white/60 shadow-2xl backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </span>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quality Assurance</p>
                  <p className="text-xs font-black text-slate-800">40+ Daily Quality Checks</p>
                </div>
              </motion.div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid gap-4 grid-cols-2 pt-4">
              <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 hover:bg-white hover:shadow-lg hover:border-blue-200 transition duration-300">
                <p className="text-3xl font-black text-blue-600 font-inter">&lt; 12 hrs</p>
                <p className="mt-1.5 text-xs font-bold text-slate-900">Milking to Doorstep</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500 font-semibold">Immediate chilling and express cold transport.</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 hover:bg-white hover:shadow-lg hover:border-blue-200 transition duration-300">
                <p className="text-3xl font-black text-blue-600 font-inter">100%</p>
                <p className="mt-1.5 text-xs font-bold text-slate-900">Glass Bottles</p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500 font-semibold">Sanitized, reusable bottles avoiding plastic waste.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Pillars */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">The Initiative</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Honest Dairy Products, Direct from Farms.
              </h2>
              <p className="text-xs sm:text-sm leading-6 text-slate-500 text-justify font-medium">
                At ApnaDoodh, we are redefining morning dairy delivery. By working directly with certified local family pastures, we eliminate middlemen and cold-storage distribution delays. Farmers earn fair trade daily payouts, and your family enjoys pure, unadulterated milk.
              </p>
            </div>

            {/* Farm Pillars List */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-150 bg-slate-50/50 p-6 sm:p-8 space-y-6">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${pillar.bgColor} ${pillar.color} border border-slate-100/50 shadow-inner`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{pillar.title}</h3>
                      <p className="mt-1.5 text-[11px] text-slate-550 leading-relaxed text-justify font-semibold">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all duration-300"
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
