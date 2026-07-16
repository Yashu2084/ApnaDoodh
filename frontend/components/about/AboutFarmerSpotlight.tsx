"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Award, Heart } from "lucide-react";

export default function AboutFarmerSpotlight() {
  const gallery = [
    "/about-cows-pasture.webp", // Pasture cows
    "/dairy_ranges_hero.webp", // Dairy farm chilling
    "/apnadoodh_cow_milk.webp", // Cow milk
  ];

  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-slate-50/30 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-50/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Farmer Spotlight</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Meet Our Food Creators
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            ApnaDoodh does not aggregate or anonymize milk. We shine a light on the dedicated families who raise the herds.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center max-w-6xl mx-auto">
          {/* Left Column: Media & Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-xl bg-slate-100"
            >
              <Image
                src="/about-farmers.webp"
                alt="Farmer Ramesh Kumar with cows"
                fill
                className="object-cover object-top"
                sizes="(max-w-720px) 100vw, 600px"
              />
              
              {/* Floating tags */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 border border-slate-100 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                4.2 Rating
              </div>
              <div className="absolute bottom-4 right-4 bg-blue-600 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-md shadow-blue-500/20">
                Vedic Farms
              </div>
            </motion.div>

            {/* Farm Mini Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {gallery.map((imgUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-100 hover:scale-102 transition duration-200 cursor-pointer"
                >
                  <Image
                    src={imgUrl}
                    alt={`Vedic Farms gallery ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-w-720px) 33vw, 150px"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Story & Stats */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
                <Award className="h-3.5 w-3.5" /> Featured Partner
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Ramesh Kumar
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                3rd Generation Farmer • 15+ Years Care
              </p>
              
              <div className="h-0.5 w-16 bg-blue-600 rounded-full my-4" />

              <p className="text-xs sm:text-sm text-slate-500 leading-6 text-justify font-medium">
                For three generations, Ramesh's family raised purebred Gir cows, yielding A2 milk of exceptional nutrition. However, selling to traditional industrial agents meant his milk was pooled with low-quality batches, and he faced low, delayed payments.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-6 text-justify font-medium">
                Partnering with ApnaDoodh in 2025 changed everything. Today, Ramesh sets his own rates, packs under his own farm label (Vedic Farms), and receives digital daily payouts. He has reinvested this surplus into premium organic alfalfa feed, automatic chilling plants, and cattle welfare.
              </p>
            </motion.div>

            {/* Impact/Offerings */}
            <div className="grid gap-4 sm:grid-cols-3 pt-4">
              {[
                { title: "45+ Herds", subtitle: "Happy Gir Cows" },
                { title: "250+ Litres", subtitle: "Daily Capacity" },
                { title: "12 Hours", subtitle: "Milking to Door" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200/50 bg-white/60 p-4 shadow-xs backdrop-blur-xs text-center">
                  <p className="text-base font-extrabold text-slate-900 leading-none">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 leading-none">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
