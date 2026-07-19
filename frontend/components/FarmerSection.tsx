"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Award, ShieldCheck, ArrowRight, Compass } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  farmer: string;
  location: string;
  distance: string;
  herdSize: string;
  breed: string;
  rating: number;
  qualityScore: string;
  image: string;
  badges: string[];
}

const featuredFarms: Farm[] = [
  {
    id: "govardhan-pastures",
    name: "Govardhan A2 Dairy",
    farmer: "Ram Singh Yadav",
    location: "Sohna Valley, Gurugram",
    distance: "2.4 km",
    herdSize: "45 Gir Cows",
    breed: "A2 Gir Herd",
    rating: 4.9,
    qualityScore: "9.9 Purity",
    image: "/apnadoodh_cow_milk.webp", // Reusing available local images
    badges: ["100% Grass-Fed", "Organic Cert"],
  },
  {
    id: "murrah-heights",
    name: "Murrah Heights Farm",
    farmer: "Sandeep Chaudhary",
    location: "Sultanpur Lake Border, Gurugram",
    distance: "4.1 km",
    herdSize: "30 Murrah Buffaloes",
    breed: "Murrah Buffalo",
    rating: 4.8,
    qualityScore: "9.7 Purity",
    image: "/apnadoodh_buffalo_milk.webp",
    badges: ["Thick Fat (8.2%)", "No Antibiotics"],
  },
  {
    id: "aravali-pastures",
    name: "Aravali Foothills Dairy",
    farmer: "Vikram & Sunita Pal",
    location: "Aravali Hills, Sector 72",
    distance: "1.8 km",
    herdSize: "55 Sahiwal Cows",
    breed: "Sahiwal Breed",
    rating: 4.9,
    qualityScore: "9.8 Purity",
    image: "/apnadoodh_cow_milk.webp",
    badges: ["Free Grazing", "A2 Certified"],
  },
];

export default function FarmerSection() {
  return (
    <section id="farmers" className="group relative w-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden border-t border-slate-200 scroll-mt-24">
      {/* Animated Scenic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.02, 1.06, 1.02],
            x: [2, -2, 2],
            y: [1, -1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 28,
            ease: "easeInOut",
          }}
          className="absolute -inset-4"
          style={{
            backgroundImage: "url('/search-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(1.0) contrast(1.0) brightness(0.9)",
          }}
        />
        {/* Soft overlay to match brand aesthetics while maintaining full image quality */}
        <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />
        
        {/* Glowing light source orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-sky-200/10 blur-[120px]" />
      </div>

      {/* Section Header wrapped in a liquid glass panel */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-16 p-8 sm:p-10 rounded-[2.5rem] border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Pure Source Traceability</p>
        <h2 className="mt-3.5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Meet Our Heritage Farmers
        </h2>
        <p className="mt-3.5 text-sm leading-6 text-slate-800 font-bold max-w-2xl mx-auto">
          We bypass collection centres. Your milk is sourced from specific, audited family-run farms in Gurugram, tested in real-time, and delivered directly to you.
        </p>
      </div>

      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto w-full">
        {featuredFarms.map((farm, idx) => (
          <motion.article
            key={farm.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/50 p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/65 hover:border-white/80 hover:shadow-[0_15px_45px_0_rgba(31,38,135,0.18)] flex flex-col justify-between"
          >
            <div>
              {/* Cover Image & Distance */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 aspect-[4/3] w-full">
                <Image
                  src={farm.image}
                  alt={farm.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/90 border border-slate-700/50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm backdrop-blur-sm">
                  <Compass className="h-3.5 w-3.5 text-blue-400" />
                  {farm.distance} away
                </span>

                <span className="absolute top-3 right-3 rounded-full bg-blue-600 border border-blue-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                  {farm.qualityScore}
                </span>
              </div>

              {/* Farmer and Farm Metadata */}
              <div className="mt-6 space-y-2 px-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wider">{farm.breed}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-800">{farm.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-950 leading-tight group-hover:text-blue-700 transition-colors">
                  {farm.name}
                </h3>
                <p className="text-xs text-slate-800 font-semibold leading-5">Managed by <strong className="text-slate-900">{farm.farmer}</strong> • {farm.herdSize}</p>
                <p className="text-[11px] text-slate-650 font-bold leading-4">{farm.location}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {farm.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-blue-900 border border-blue-200/50 shadow-xs"
                    >
                      <Award className="h-2.5 w-2.5" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* View Farmer Store CTA */}
            <div className="pt-6">
              <Link
                href={`/farmer/store?farmId=${farm.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/80 py-3 text-xs font-bold text-slate-800 transition duration-300 hover:bg-slate-950 hover:text-white hover:border-slate-950 active:scale-95 cursor-pointer shadow-xs"
              >
                Visit Farm Store
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="relative z-10 text-center mt-12">
        <Link
          href="/farmers/nearby"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Discover Nearby Farmers
          <Compass className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
