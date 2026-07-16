"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Award, Compass, FileText, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface FarmDetails {
  id: string;
  name: string;
  farmer: string;
  location: string;
  distance: string;
  rating: number;
  qualityScore: string;
  breed: string;
  herdSize: string;
  pastureType: string;
  image: string;
  story: string;
  labHistory: { date: string; fat: string; snf: string; purity: string }[];
  reviews: { author: string; rating: number; date: string; comment: string; verified: boolean }[];
}

const mockFarmsDb: Record<string, FarmDetails> = {
  "govardhan-pastures": {
    id: "govardhan-pastures",
    name: "Govardhan A2 Dairy",
    farmer: "Ram Singh Yadav",
    location: "Sohna Valley, Gurugram",
    distance: "2.4 km",
    rating: 4.9,
    qualityScore: "9.9 Purity Score",
    breed: "A2 Gir Cow Herd",
    herdSize: "45 Cows",
    pastureType: "100% Free Range Grazing",
    image: "/apnadoodh_cow_milk.webp",
    story: "Govardhan Pastures was founded in Sohna Valley with a simple goal: preserving India's heritage cattle breeds. Our Gir cows are allowed to graze freely in the sunshine all morning, eating native grass varieties, medicinal herbs, and certified organic feed. We never use artificial growth hormones, resulting in a naturally sweet, digestible A2 milk.",
    labHistory: [
      { date: "June 20, 2026", fat: "4.25%", snf: "8.75%", purity: "99.9%" },
      { date: "June 18, 2026", fat: "4.20%", snf: "8.80%", purity: "99.8%" },
      { date: "June 16, 2026", fat: "4.30%", snf: "8.70%", purity: "99.9%" },
    ],
    reviews: [
      { author: "Aditi Sharma", rating: 5, date: "June 18, 2026", comment: "The sweetness of this A2 milk is amazing. My kids refuse to drink any other milk now!", verified: true },
      { author: "Vikram Malhotra", rating: 5, date: "June 15, 2026", comment: "Superb packaging and extremely light on the stomach. The somatic cell score gives me high confidence.", verified: true },
    ]
  },
  "murrah-heights": {
    id: "murrah-heights",
    name: "Murrah Heights Farm",
    farmer: "Sandeep Chaudhary",
    location: "Sultanpur Lake Border, Gurugram",
    distance: "4.1 km",
    rating: 4.8,
    qualityScore: "9.7 Purity Score",
    breed: "Murrah Buffalo Herd",
    herdSize: "30 Buffaloes",
    pastureType: "Mixed Silage + Fodder Feed",
    image: "/apnadoodh_buffalo_milk.webp",
    story: "Murrah Heights Farm is situated on the borders of Sultanpur Bird Sanctuary. Sandeep Chaudhary is a third-generation dairy keeper specialized in breeding Murrah buffaloes. Known for heavy milk density, our buffaloes yield rich, thick milk ideal for setting home-made yogurt, boiling aromatic chai, or preparing traditional Indian sweets.",
    labHistory: [
      { date: "June 19, 2026", fat: "7.85%", snf: "9.10%", purity: "99.7%" },
      { date: "June 17, 2026", fat: "7.90%", snf: "9.15%", purity: "99.7%" },
      { date: "June 15, 2026", fat: "7.80%", snf: "9.05%", purity: "99.6%" },
    ],
    reviews: [
      { author: "Meena Gupta", rating: 5, date: "June 19, 2026", comment: "Absolutely rich and creamy buffalo milk. Setting thick dahi with this is so easy!", verified: true },
      { author: "Rajesh Rawat", rating: 4, date: "June 16, 2026", comment: "High fat content as promised. Great for paneer and morning ghee.", verified: true },
    ]
  },
  "aravali-pastures": {
    id: "aravali-pastures",
    name: "Aravali Foothills Dairy",
    farmer: "Vikram & Sunita Pal",
    location: "Aravali Hills, Sector 72",
    distance: "1.8 km",
    rating: 4.9,
    qualityScore: "9.8 Purity Score",
    breed: "Sahiwal A2 Breed",
    herdSize: "55 Cows",
    pastureType: "Free Grazing + Herb Feed",
    image: "/apnadoodh_cow_milk.webp",
    story: "Nestled in the green valleys of Sector 72, Aravali Foothills Dairy is run by Sunita and Vikram Pal. We graze our Sahiwal cattle on the organic hills. We mix ashwagandha and shatavari in their feed, enhancing the natural immunoglobulins in the milk. Every bottle is sealed directly at the farm chilling station.",
    labHistory: [
      { date: "June 20, 2026", fat: "4.15%", snf: "8.68%", purity: "99.8%" },
      { date: "June 18, 2026", fat: "4.10%", snf: "8.70%", purity: "99.8%" },
      { date: "June 16, 2026", fat: "4.20%", snf: "8.65%", purity: "99.9%" },
    ],
    reviews: [
      { author: "Rohit Verma", rating: 5, date: "June 20, 2026", comment: "Highly digestible cow milk. The glass bottles are always clean and ice cold.", verified: true },
      { author: "Pooja Hegde", rating: 5, date: "June 17, 2026", comment: "Excellent Sahiwal milk. Support local farmers!", verified: true },
    ]
  }
};

function FarmerStoreContent() {
  const searchParams = useSearchParams();
  const farmId = searchParams.get("farmId") || "govardhan-pastures";
  const { addToCart } = useCart();

  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "story" | "lab" | "reviews">("products");

  useEffect(() => {
    if (mockFarmsDb[farmId]) {
      setFarm(mockFarmsDb[farmId]);
    } else {
      setFarm(mockFarmsDb["govardhan-pastures"]);
    }
  }, [farmId]);

  if (!farm) {
    return (
      <div className="py-24 text-center">
        <Compass className="h-12 w-12 text-slate-300 mx-auto animate-spin" />
        <p className="text-slate-500 mt-4">Loading farm storefront...</p>
      </div>
    );
  }

  // Define products based on farm type
  const products = farm.breed.includes("Cow")
    ? [
        { id: "cow-milk", name: "Cow Milk", price: "₹99 / Litre", priceNum: 99, image: "/apnadoodh_cow_milk.webp", badge: "A2 Grass-Fed", desc: "Pure cow milk sourced from grass-fed A2 Gir herds." },
        { id: "paneer", name: "Paneer", price: "₹249 / 250g", priceNum: 249, image: "/apnadoodh_paneer.webp", badge: "Handmade Fresh", desc: "Thick soft paneer made from fresh farm cow milk." },
      ]
    : [
        { id: "buffalo-milk", name: "Buffalo Milk", price: "₹129 / Litre", priceNum: 129, image: "/apnadoodh_buffalo_milk.webp", badge: "Extra Creamy", desc: "Rich heavy buffalo milk from purebred Murrah herds." },
        { id: "curd", name: "Curd", price: "₹89 / 500g", priceNum: 89, image: "/apnadoodh_curd.webp", badge: "Active Probiotics", desc: "Thick set dahi cultured gently with home strains." },
      ];

  return (
    <div className="py-4">
      {/* Farm Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 p-6 sm:p-10 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm bg-white aspect-square">
          <Image
            src={farm.image}
            alt={farm.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="space-y-4 text-center md:text-left flex-grow">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
            <Award className="h-3.5 w-3.5" /> Certified Partner Farm
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-none">{farm.name}</h1>
            <p className="text-xs text-slate-500">Managed by <strong>{farm.farmer}</strong> • {farm.location}</p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap text-xs">
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              {farm.rating} (Verified Ratings)
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-blue-600 font-bold">
              <ShieldCheck className="h-4.5 w-4.5" />
              {farm.qualityScore}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">{farm.herdSize} • {farm.breed}</span>
          </div>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="flex border-b border-slate-100 mb-8 overflow-x-auto gap-6 text-sm">
        {[
          { id: "products", label: "Buy Fresh Dairy", icon: ShoppingBag },
          { id: "story", label: "Our Grazing Story", icon: Compass },
          { id: "lab", label: "Lab Test Reports", icon: FileText },
          { id: "reviews", label: "Customer Reviews", icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 font-semibold transition border-b-2 cursor-pointer whitespace-nowrap px-1 ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Display Panel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          
          {/* Tab: Products */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {products.map((product) => (
                <div key={product.name} className="border border-slate-200/70 rounded-3xl p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{product.name}</h4>
                        <span className="text-[9px] font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{product.badge}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-4 max-w-xs">{product.desc}</p>
                      <p className="text-xs font-bold text-blue-600 mt-2">{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.priceNum,
                        sellerName: farm.name,
                        image: product.image,
                      })
                    }
                    suppressHydrationWarning
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer shrink-0"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add To Cart
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tab: Story */}
          {activeTab === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 leading-7 text-sm text-slate-600 text-justify"
            >
              <h3 className="text-base font-bold text-slate-900">Pasture Health & Cattle Welfare</h3>
              <p>{farm.story}</p>
              
              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100 mt-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cattle Grazing</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{farm.pastureType}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Rating</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">Class-A Organic Soil (Approved)</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Lab Reports */}
          {activeTab === "lab" && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Historical Batch Compliance</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">100% Pathogen Free</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Dispatch Date</th>
                      <th className="pb-3">Fat %</th>
                      <th className="pb-3">SNF % (Solids)</th>
                      <th className="pb-3 text-right">Purity Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {farm.labHistory.map((log) => (
                      <tr key={log.date} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 font-semibold">{log.date}</td>
                        <td className="py-3">{log.fat}</td>
                        <td className="py-3">{log.snf}</td>
                        <td className="py-3 text-right text-blue-600 font-bold">{log.purity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Tab: Reviews */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Verified Dairy Reviews</h3>
                <span className="text-xs font-semibold text-slate-400">Showing recent 5-star drops</span>
              </div>

              <div className="space-y-4">
                {farm.reviews.map((rev, idx) => (
                  <div key={idx} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                        {rev.verified && (
                          <span className="ml-2 text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full font-bold">Verified Buyer</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`} />
                      ))}
                    </div>

                    <p className="text-xs leading-5 text-slate-600 mt-2">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function FarmerStorePage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Suspense fallback={
          <div className="py-24 text-center">
            <Compass className="h-12 w-12 text-slate-300 mx-auto animate-spin" />
            <p className="text-slate-500 mt-4">Loading farm storefront...</p>
          </div>
        }>
          <FarmerStoreContent />
        </Suspense>
      </div>
    </div>
  );
}
