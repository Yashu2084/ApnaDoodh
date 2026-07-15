"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Award, Calendar, ShoppingCart, Info, Check, Sparkles } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const rangesData = [
  {
    id: "cow-milk",
    hash: "cow-milk",
    name: "A2 Cow Milk",
    price: "₹99 / Litre",
    priceNum: 99,
    rating: 4.9,
    badge: "A2 Certified Organic",
    image: "/apnadoodh_cow_milk.webp",
    sellerName: "Govardhan A2 Dairy",
    sellerId: "govardhan-pastures",
    description: "Sourced from high-pasture grass-fed Gir cows, our A2 Milk is naturally rich in immunoglobulins and highly digestible. Chilled instantly to 4°C at our farm stations, we ensure zero contamination and deliver within 24 hours of milking.",
    nutrition: [
      { label: "Energy", value: "62 kcal" },
      { label: "Fat", value: "3.6 - 4.2 g" },
      { label: "Protein (A2)", value: "3.2 g" },
      { label: "Calcium", value: "120 mg" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "4.2%", standard: "Min 3.5%" },
      { parameter: "SNF Solids", value: "8.75%", standard: "Min 8.5%" },
      { parameter: "Chemicals/Antibiotics", value: "0.00 ppb", standard: "Zero" },
    ],
    benefits: ["Easy to digest (no bloating)", "Boosts natural immunity", "Medical-grade glass packaging"],
  },
  {
    id: "buffalo-milk",
    hash: "buffalo-milk",
    name: "Creamy Buffalo Milk",
    price: "₹129 / Litre",
    priceNum: 129,
    rating: 4.8,
    badge: "Extra Rich & Thick",
    image: "/apnadoodh_buffalo_milk.webp",
    sellerName: "Murrah Heights Farm",
    sellerId: "murrah-heights",
    description: "Sourced from purebred Murrah herds, our buffalo milk is extremely rich, creamy, and high in calcium. Excellent for growing kids, boiling thick malai tea, setting thick curd, or churning home ghee.",
    nutrition: [
      { label: "Energy", value: "97 kcal" },
      { label: "Fat", value: "7.2 - 7.9 g" },
      { label: "Protein", value: "3.8 g" },
      { label: "Calcium", value: "180 mg" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "7.85%", standard: "Min 6.0%" },
      { parameter: "SNF Solids", value: "9.10%", standard: "Min 9.0%" },
      { parameter: "Added Water", value: "0.0%", standard: "Zero" },
    ],
    benefits: ["High calcium for bone strength", "Rich texture for ghee & sweets", "Instantly pasteurized & chilled"],
  },
  {
    id: "paneer",
    hash: "paneer",
    name: "Organic Handcrafted Paneer",
    price: "₹249 / 250g",
    priceNum: 249,
    rating: 4.9,
    badge: "Handcrafted Fresh Daily",
    image: "/apnadoodh_paneer.webp",
    sellerName: "Aravali Foothills Dairy",
    sellerId: "aravali-pastures",
    description: "Handcrafted fresh each morning using citric curdling of pure cow milk. Our cottage cheese is moisture-rich, buttery soft, and free from starch, dairy whitener, or chemical stabilizers.",
    nutrition: [
      { label: "Energy", value: "265 kcal" },
      { label: "Fat", value: "20.8 g" },
      { label: "Protein", value: "18.3 g" },
      { label: "Calcium", value: "208 mg" },
    ],
    purityLab: [
      { parameter: "Starch & Adulteration", value: "Negative", standard: "Zero" },
      { parameter: "Fat on Dry Matter", value: "51.0%", standard: "Min 50.0%" },
      { parameter: "Coliform Bacteria", value: "0 CFU/g", standard: "Zero" },
    ],
    benefits: ["Zero preservatives or starch", "Soft, moist & melts easily", "Vacuum sealed for raw purity"],
  },
  {
    id: "curd",
    hash: "curd",
    name: "Probiotic Curd (Dahi)",
    price: "₹89 / 500g",
    priceNum: 89,
    rating: 4.9,
    badge: "Gut-Friendly Probiotics",
    image: "/apnadoodh_curd.webp",
    sellerName: "Govardhan A2 Dairy",
    sellerId: "govardhan-pastures",
    description: "Slow-cultured over 12 hours with active probiotic strains in clay pots. Velvety, thick, and naturally sweet without any sourness, aiding gut health and soothing digestion.",
    nutrition: [
      { label: "Energy", value: "60 kcal" },
      { label: "Fat", value: "3.2 g" },
      { label: "Protein", value: "3.1 g" },
      { label: "Calcium", value: "110 mg" },
    ],
    purityLab: [
      { parameter: "Active Probiotics", value: "10^8 CFU/g", standard: "Ideal Strains" },
      { parameter: "Preservatives", value: "Negative", standard: "Zero" },
      { parameter: "Whey Separation", value: "Under 2%", standard: "Under 5%" },
    ],
    benefits: ["Aids digestion & metabolism", "No sourness, set naturally", "Velvety thick texture"],
  },
];

export default function DairyRangesPage() {
  const { addToCart } = useCart();
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleAddToCart = (item: typeof rangesData[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.priceNum,
      sellerName: item.sellerName,
      image: item.image,
    });
    setSuccessId(item.id);
    setTimeout(() => setSuccessId(null), 2000);
  };

  return (
    <div className="py-12 sm:py-16 overflow-hidden">
      
      {/* Hero Header Section */}
      <section className="relative w-full rounded-[3.5rem] border border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(53,107,233,0.04)] mb-16 overflow-hidden">
        <div className="absolute top-0 right-0 h-80 w-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 h-64 w-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-left"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
              <Sparkles className="h-4 w-4" /> Pure Farm Ranges
            </span>
            <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
              Explore Our <br />
              <span className="text-blue-600">Premium Dairy Ranges</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
               ApnaDoodh brings you daily fresh yields from pasture-raised cattle. Each range is subjected to rigorous labs audits, keeping the fat content and nutrition logged transparently. Choose pure, direct dairy for your family.
            </p>
            
            {/* Quick jump anchor links */}
            <div className="flex flex-wrap gap-3 pt-4">
              {rangesData.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.hash}`}
                  className="rounded-full bg-white border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/10 active:scale-95 cursor-pointer"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex justify-center"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-4 shadow-[0_20px_50px_rgba(53,107,233,0.05)] backdrop-blur-md max-w-sm w-full">
              <Image
                src="/dairy_ranges_hero.webp"
                alt="Premium ApnaDoodh Showcase"
                width={360}
                height={450}
                priority
                className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-sm bg-blue-50/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main product ranges stack */}
      <div className="space-y-24">
        {rangesData.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <section
              key={item.id}
              id={item.hash}
              className="scroll-mt-24 w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center ${
                  isEven ? "" : "lg:grid-flow-col-dense"
                }`}
              >
                
                {/* Side 1: Product Image Card */}
                <div className={`flex justify-center ${isEven ? "" : "lg:col-start-2"}`}>
                  <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-4 shadow-xl max-w-md w-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-200">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
                    
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={450}
                      height={450}
                      className="w-full aspect-square object-cover rounded-[2.5rem] bg-slate-50"
                    />
                    
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certified Farm Source</p>
                      <p className="text-xs font-bold text-slate-800 mt-1">{item.sellerName}</p>
                    </div>
                  </div>
                </div>

                {/* Side 2: Specifications, Nutrition, Purity Logs & Actions */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3.5 py-1 text-[10px] font-extrabold tracking-wide text-blue-700 border border-blue-100 shadow-sm">
                      <Award className="h-3.5 w-3.5" />
                      {item.badge}
                    </span>

                    <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                      {item.name}
                    </h2>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        {item.rating} (Verified ratings)
                      </span>
                    </div>

                    <p className="text-2xl font-black text-slate-900">{item.price}</p>
                    <p className="text-sm leading-7 text-slate-500 text-justify">{item.description}</p>
                  </div>

                  {/* Highlighted Benefits Grid */}
                  <div className="grid gap-3 pt-2">
                    {item.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Tabs: Nutrition & Lab Testing logs */}
                  <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-blue-605" /> Nutritional Values (Per 100g/L)
                      </p>
                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm text-[11px]">
                        <div className="divide-y divide-slate-100">
                          {item.nutrition.map((nut, nIdx) => (
                            <div key={nIdx} className="flex justify-between p-3">
                              <span className="font-semibold text-slate-500">{nut.label}</span>
                              <span className="font-bold text-slate-900">{nut.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-blue-600" /> Daily Lab Tested Logs
                      </p>
                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm text-[11px]">
                        <div className="divide-y divide-slate-100">
                          {item.purityLab.map((lab, lIdx) => (
                            <div key={lIdx} className="flex items-center justify-between p-3">
                              <div>
                                <p className="font-bold text-slate-800">{lab.parameter}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">Limit: {lab.standard}</p>
                              </div>
                              <span className="font-bold text-slate-900">{lab.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions CTA buttons */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleAddToCart(item)}
                      suppressHydrationWarning
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {successId === item.id ? "Added to Cart! ✓" : "Add to Cart"}
                    </button>
                    <Link
                      href={`/farmer/store?farmId=${item.sellerId}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-950 hover:text-white hover:border-slate-950 active:scale-95 cursor-pointer"
                    >
                      View Seller
                    </Link>
                  </div>

                </div>
              </motion.div>
            </section>
          );
        })}
      </div>

    </div>
  );
}
