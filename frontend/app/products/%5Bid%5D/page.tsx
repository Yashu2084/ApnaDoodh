"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Award, Calendar, ChevronRight, ShoppingCart, Info, Check } from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface ProductDetailsData {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  rating: number;
  badge: string;
  image: string;
  description: string;
  nutrition: { label: string; value: string }[];
  purityLab: { parameter: string; value: string; standard: string; status: "Passed" | "Ideal" }[];
  deliveryInfo: string;
  faqs: { q: string; a: string }[];
}

const productsDb: Record<string, ProductDetailsData> = {
  "cow-milk": {
    id: "cow-milk",
    name: "Cow Milk",
    price: "₹99 / Litre",
    priceNum: 99,
    rating: 4.9,
    badge: "A2 Certified Organic",
    image: "/apnadoodh_cow_milk.webp",
    description: "Sourced from high-pasture grass-fed Gir cows, our A2 Milk is naturally rich in immunoglobulins and highly digestible. Chilled instantly to 4°C at our farm stations, we ensure zero contamination and deliver within 24 hours of milking.",
    nutrition: [
      { label: "Energy", value: "62 kcal" },
      { label: "Fat", value: "3.6 - 4.2 g" },
      { label: "Protein (A2 Beta-Casein)", value: "3.2 g" },
      { label: "Calcium", value: "120 mg" },
      { label: "Carbohydrates", value: "4.8 g" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "4.2%", standard: "Min 3.5%", status: "Passed" },
      { parameter: "Solids-Not-Fat (SNF)", value: "8.75%", standard: "Min 8.5%", status: "Passed" },
      { parameter: "Pesticides & Antibiotics", value: "0.00 ppb", standard: "0.00 ppb (Zero tolerance)", status: "Ideal" },
      { parameter: "Somatic Cell Count (SCC)", value: "110k cells/ml", standard: "Under 200k (Elite Clean)", status: "Ideal" },
    ],
    deliveryInfo: "Delivered daily between 5:30 AM and 7:00 AM by our cold carrier logistics fleet.",
    faqs: [
      { q: "What is A2 beta-casein?", a: "It is a natural milk protein matching the structural profile of human breast milk, making it extremely digestible and reducing stomach inflammation compared to regular A1 milk." },
      { q: "How do you maintain the cold chain?", a: "From milking to bottling to doorstep drops, the milk temperature is logged and monitored constantly under 4°C using refrigerated delivery boxes." }
    ]
  },
  "buffalo-milk": {
    id: "buffalo-milk",
    name: "Buffalo Milk",
    price: "₹129 / Litre",
    priceNum: 129,
    rating: 4.8,
    badge: "Extra Rich & Thick",
    image: "/apnadoodh_buffalo_milk.webp",
    description: "Sourced from purebred Murrah herds, our buffalo milk is extremely rich, creamy, and high in calcium. Excellent for growing kids, boiling thick malai tea, setting thick curd, or churning home ghee.",
    nutrition: [
      { label: "Energy", value: "97 kcal" },
      { label: "Fat", value: "7.2 - 7.9 g" },
      { label: "Protein", value: "3.8 g" },
      { label: "Calcium", value: "180 mg" },
      { label: "Carbohydrates", value: "5.1 g" },
    ],
    purityLab: [
      { parameter: "Fat Content", value: "7.85%", standard: "Min 6.0%", status: "Passed" },
      { parameter: "Solids-Not-Fat (SNF)", value: "9.10%", standard: "Min 9.0%", status: "Passed" },
      { parameter: "Water Dilution Test", value: "0% Added Water", standard: "0% Water", status: "Ideal" },
      { parameter: "Pesticides & Antibiotics", value: "0.00 ppb", standard: "0.00 ppb (Zero)", status: "Ideal" },
    ],
    deliveryInfo: "Delivered daily before 7:00 AM in Gurugram sectors.",
    faqs: [
      { q: "Is buffalo milk harder to digest?", a: "It contains more fat and solids which makes it very rich. It is ideal for active individuals and children who need high energy." }
    ]
  },
  "paneer": {
    id: "paneer",
    name: "Paneer",
    price: "₹249 / 250g",
    priceNum: 249,
    rating: 4.9,
    badge: "Handcrafted Fresh Daily",
    image: "/apnadoodh_paneer.webp",
    description: "Handcrafted fresh each morning using citric curdling of pure cow milk. Our cottage cheese is moisture-rich, buttery soft, and free from starch, dairy whitener, or chemical stabilizers.",
    nutrition: [
      { label: "Energy", value: "265 kcal" },
      { label: "Fat", value: "20.8 g" },
      { label: "Protein", value: "18.3 g" },
      { label: "Calcium", value: "208 mg" },
      { label: "Moisture Content", value: "52%" },
    ],
    purityLab: [
      { parameter: "Starch & Adulteration", value: "Negative", standard: "Negative", status: "Ideal" },
      { parameter: "Fat on Dry Matter", value: "51%", standard: "Min 50%", status: "Passed" },
      { parameter: "Coliform Bacteria Count", value: "0 CFU/g", standard: "Zero", status: "Ideal" },
    ],
    deliveryInfo: "Delivered fresh alongside morning milk drops. Packaged in vacuum-sealed food-grade packs.",
    faqs: [
      { q: "How long can I store this paneer?", a: "Since we do not add preservatives, we recommend consuming it within 3 days. Store in ice cold water in a refrigerator." }
    ]
  },
  "curd": {
    id: "curd",
    name: "Curd",
    price: "₹89 / 500g",
    priceNum: 89,
    rating: 4.9,
    badge: "Probiotic Rich",
    image: "/apnadoodh_curd.webp",
    description: "Cultured slow over 12 hours with active probiotic strains in clay pots. Velvety, thick, and naturally sweet without any sourness, aiding gut health and soothing digestion.",
    nutrition: [
      { label: "Energy", value: "60 kcal" },
      { label: "Fat", value: "3.2 g" },
      { label: "Protein", value: "3.1 g" },
      { label: "Calcium", value: "110 mg" },
      { label: "Active Lactic Cultures", value: "10^8 CFU/g", status: "Passed" } as any,
    ],
    purityLab: [
      { parameter: "Active Probiotics", value: "Present", standard: "Lactobacillus strains", status: "Ideal" },
      { parameter: "Preservatives & Starch", value: "Negative", standard: "Negative", status: "Ideal" },
      { parameter: "Whey Separation", value: "Under 2%", standard: "Under 5%", status: "Passed" },
    ],
    deliveryInfo: "Delivered cold before 7:00 AM. Kept under 4°C during transit.",
    faqs: [
      { q: "Why is it not sour?", a: "We control the incubation temperature precisely to ensure a balanced, naturally sweet flavor profile before refrigeration stops fermentation." }
    ]
  }
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string || "cow-milk";
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);

  useEffect(() => {
    const key = id.toLowerCase();
    if (productsDb[key]) {
      setProduct(productsDb[key]);
    } else {
      setProduct(productsDb["cow-milk"]);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <Info className="h-12 w-12 text-slate-300 mx-auto animate-pulse" />
        <p className="text-slate-500 mt-4 font-semibold">Loading product specifications...</p>
      </div>
    );
  }

  const defaultSeller = product.id.includes("cow") 
    ? { name: "Govardhan A2 Dairy", id: "govardhan-pastures" }
    : product.id.includes("buffalo")
    ? { name: "Murrah Heights Farm", id: "murrah-heights" }
    : { name: "Aravali Foothills Dairy", id: "aravali-pastures" };

  return (
    <div className="pt-28 pb-12 sm:pt-36 sm:pb-16">
      <div className="mx-auto max-w-5xl px-4">
        
        {/* Main Grid */}
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] mb-16">
          
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-slate-50 p-4 shadow-lg backdrop-blur-md">
              <div className="absolute top-0 right-0 h-40 w-40 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
              
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                priority
                className="w-full aspect-square object-cover rounded-[2.5rem] shadow-sm bg-blue-50/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <div className="text-center p-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics</p>
                <p className="text-xs font-bold text-slate-800 mt-1">Direct Cold Transit</p>
              </div>
              <div className="text-center p-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preservatives</p>
                <p className="text-xs font-bold text-slate-800 mt-1">0% Preservative</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Spec, pricing & checkout */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-[10px] font-bold text-blue-700">
                <Award className="h-3.5 w-3.5" /> {product.badge}
              </div>

              <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {product.rating} (Verified Ratings)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-semibold">
                  Seller: <Link href={`/farmer/store?farmId=${defaultSeller.id}`} className="text-blue-600 hover:underline">{defaultSeller.name}</Link>
                </span>
              </div>

              <p className="text-2xl font-black text-slate-900">{product.price}</p>
              
              <p className="text-sm leading-7 text-slate-500 text-justify">{product.description}</p>
            </div>

            {/* Purchase CTA Widget */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 pt-4 mt-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Direct Delivery Fulfillment</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-4">{product.deliveryInfo}</p>
                </div>
              </div>

              <div className="grid gap-3 pt-2">
                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.priceNum,
                      sellerName: defaultSeller.name,
                      image: product.image,
                    })
                  }
                  suppressHydrationWarning
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add To Cart
                </button>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Technical Specification Tabular Data */}
        <div className="grid gap-12 md:grid-cols-2 mb-16 border-t border-slate-100 pt-12">
          
          {/* Nutritional spec */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-blue-600" /> Nutritional Values (Per 100ml)
            </h3>
            
            <div className="border border-slate-200/80 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="divide-y divide-slate-100 text-xs">
                {product.nutrition.map((nut) => (
                  <div key={nut.label} className="flex justify-between p-4 hover:bg-slate-50 transition">
                    <span className="font-semibold text-slate-500">{nut.label}</span>
                    <span className="font-bold text-slate-900">{nut.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chemical/Purity parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600" /> Lab Tested Parameters
            </h3>

            <div className="border border-slate-200/80 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="divide-y divide-slate-100 text-xs">
                {product.purityLab.map((lab) => (
                  <div key={lab.parameter} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                    <div>
                      <p className="font-bold text-slate-800">{lab.parameter}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tolerance: {lab.standard}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-900">{lab.value}</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
