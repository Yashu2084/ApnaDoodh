"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useCart } from "./CartProvider";

interface Product {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  description: string;
  badge: string;
  image: string;
  sellerName: string;
  sellerId: string;
  rating: number;
}

const products: Product[] = [
  {
    id: "cow-milk",
    name: "A2 Cow Milk",
    price: "₹99 / Litre",
    priceNum: 99,
    description: "Sourced from pasture-fed A2 Gir cows. Naturally sweet, highly digestible, antibiotic-free, and delivered cold in eco-friendly glass bottles.",
    badge: "Best Seller",
    image: "/apnadoodh_cow_milk.webp",
    sellerName: "Govardhan A2 Dairy",
    sellerId: "govardhan-pastures",
    rating: 4.9,
  },
  {
    id: "paneer",
    name: "Handcrafted Paneer",
    price: "₹249 / 250g",
    priceNum: 249,
    description: "Freshly curdled cottage cheese handmade every morning. Exceedingly soft, moisture-rich, starch-free, and contains zero additives.",
    badge: "Freshly Made",
    image: "/apnadoodh_paneer.webp",
    sellerName: "Aravali Foothills Dairy",
    sellerId: "aravali-pastures",
    rating: 4.9,
  },
  {
    id: "curd",
    name: "Probiotic Curd (Dahi)",
    price: "₹89 / 500g",
    priceNum: 89,
    description: "Slow-cultured over 12 hours with active probiotic strains in clay pots. Thick, velvety, and naturally sweet cooling side dish.",
    badge: "Probiotic Rich",
    image: "/apnadoodh_curd.webp",
    sellerName: "Govardhan A2 Dairy",
    sellerId: "govardhan-pastures",
    rating: 4.8,
  },
  {
    id: "ghee",
    name: "A2 Desi Cow Ghee",
    price: "₹649 / 500ml",
    priceNum: 649,
    description: "Golden ghee churned via traditional bilona curd curdling. Boasts a rich, grainy texture, immense nutritional value, and clean aroma.",
    badge: "Bilona Method",
    image: "/apnadoodh_ghee.webp",
    sellerName: "Govardhan A2 Dairy",
    sellerId: "govardhan-pastures",
    rating: 5.0,
  },
  {
    id: "butter",
    name: "Fresh White Butter",
    price: "₹229 / 250g",
    priceNum: 229,
    description: "Hand-churned unsalted table butter made from fresh dairy cow cream. Rich, smooth taste, perfect for traditional Indian breads.",
    badge: "100% Organic",
    image: "/apnadoodh_butter.webp",
    sellerName: "Aravali Foothills Dairy",
    sellerId: "aravali-pastures",
    rating: 4.9,
  },
];

// Variants for directional sliding
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
};

export default function ProductsSection() {
  const { addToCart } = useCart();
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProduct = products[activeIndex];
  const nextIndex = (activeIndex + 1) % products.length;
  const nextProduct = products[nextIndex];

  // Auto rotation logic
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isHovered]);

  const handleNext = () => {
    setActiveIndex(([prevIndex]) => [(prevIndex + 1) % products.length, 1]);
  };

  const handlePrev = () => {
    setActiveIndex(([prevIndex]) => [
      (prevIndex - 1 + products.length) % products.length,
      -1,
    ]);
  };

  const handleDotClick = (index: number) => {
    const dir = index > activeIndex ? 1 : -1;
    setActiveIndex([index, dir]);
  };

  return (
    <section
      id="products"
      className="relative w-full min-h-[90vh] flex flex-col justify-center py-16 sm:py-24 overflow-hidden scroll-mt-24"
    >
      {/* Luxury Background Image with subtle alive zoom/pan animation */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1.03 }}
        animate={{
          scale: [1.02, 1.07, 1.02],
          x: [0, 6, -6, 0],
          y: [0, -3, 3, 0],
        }}
        transition={{
          duration: 35,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          backgroundImage: "url('/assets/luxury-product-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Top and Bottom ambient blur and white-fade gradients to seamlessly blend with adjacent sections */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent z-0 pointer-events-none" />
      
      {/* High-end glassmorphism overlay to adjust section contrast and color tone according to background */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1.5px] z-0 pointer-events-none" />

      {/* Content wrapper aligning content grid with the rest of the website layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Wrapper in Premium Apple-like Glassmorphic Capsule */}
        <div className="mx-auto max-w-3xl text-center mb-16 p-6 sm:p-8 rounded-[2.5rem] bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Fresh Produce</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Popular Marketplace Products
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
            Compare farm products, review quality standards, and buy directly from our vetted pasture-based farmers.
          </p>
        </div>

        {/* Main Carousel Stack Area */}
        <div
          className="relative mx-auto max-w-4xl w-full h-[520px] sm:h-[460px] md:h-[400px] flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Navigation arrows (Chevron styles) */}
          <button
            onClick={handlePrev}
            suppressHydrationWarning
            className="absolute left-0 md:-left-12 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-800 shadow-lg backdrop-blur-xl transition hover:bg-white hover:border-white/80 hover:text-blue-700 active:scale-95 cursor-pointer"
            aria-label="Previous product"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNext}
            suppressHydrationWarning
            className="absolute right-0 md:-right-12 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-800 shadow-lg backdrop-blur-xl transition hover:bg-white hover:border-white/80 hover:text-blue-700 active:scale-95 cursor-pointer"
            aria-label="Next product"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* 1. Next Product Preview in Background Stack */}
          <div className="absolute top-4 right-[-24px] sm:right-[-32px] -z-10 w-full h-full scale-[0.93] translate-x-8 opacity-25 blur-[1px] select-none pointer-events-none rounded-[2.5rem] border border-white/40 bg-white/20 backdrop-blur-2xl shadow-lg flex items-center p-6 sm:p-8">
            <div className="grid grid-cols-[1fr_1.2fr] gap-6 w-full items-center">
              <div className="aspect-[4/3] rounded-2xl bg-slate-200/50" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-300/50 rounded w-1/4" />
                <div className="h-6 bg-slate-300/50 rounded w-3/4" />
                <div className="h-4 bg-slate-300/50 rounded w-1/2" />
              </div>
            </div>
          </div>

          {/* 2. Active Card with Slide Animation */}
          <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(31,38,135,0.06)] hover:bg-white/55 hover:border-white/80 hover:shadow-[0_24px_60px_rgba(31,38,135,0.12)] transition-all duration-500">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center w-full h-full"
              >
                <div className="grid gap-8 sm:grid-cols-[1fr_1.2fr] items-center h-full">
                  
                  {/* Product Image and Overlay Shine */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/30 aspect-[4/3] w-full group shadow-inner flex items-center justify-center">
                    <Image
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Glassmorphism Badge */}
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/60 px-3.5 py-1 text-[10px] font-extrabold tracking-wide text-blue-700 shadow-sm backdrop-blur-md">
                      <Award className="h-3.5 w-3.5" />
                      {activeProduct.badge}
                    </span>

                    {/* Shine effect with gradient overlay on hover */}
                    <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                  </div>

                  {/* Typography and checkout content */}
                  <div className="space-y-4 flex flex-col justify-between h-full py-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                          {activeProduct.sellerName}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-slate-800 bg-white/70 border border-white/50 px-2.5 py-0.5 rounded-full shadow-sm">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {activeProduct.rating}
                        </div>
                      </div>

                      <Link href={`/products/${activeProduct.id}`}>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-955 leading-tight hover:text-blue-750 transition-colors">
                          {activeProduct.name}
                        </h3>
                      </Link>

                      <p className="text-lg font-black text-blue-700 leading-none">{activeProduct.price}</p>
                      
                      <p className="text-xs sm:text-sm leading-6 text-slate-700 font-medium text-justify line-clamp-3 md:line-clamp-4">
                        {activeProduct.description}
                      </p>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100/50">
                      <button
                        onClick={() =>
                          addToCart({
                            id: activeProduct.id,
                            name: activeProduct.name,
                            price: activeProduct.priceNum,
                            sellerName: activeProduct.sellerName,
                            image: activeProduct.image,
                          })
                        }
                        suppressHydrationWarning
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add To Cart
                      </button>
                      <Link
                        href={`/farmer/store?farmId=${activeProduct.sellerId}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md px-5 py-3.5 text-xs font-bold text-slate-850 transition hover:bg-slate-950 hover:text-white hover:border-slate-950 active:scale-95 cursor-pointer"
                      >
                        View Seller
                      </Link>
                    </div>

                  </div>

                </div>
              </motion.article>
            </AnimatePresence>
          </div>

        </div>

        {/* Progress Dots Indicator */}
        <div className="relative z-10 mt-10 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/45 backdrop-blur-xl border border-white/50 shadow-md">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                suppressHydrationWarning
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-8 bg-blue-600 shadow-sm"
                    : "w-2.5 bg-slate-350 hover:bg-slate-400"
                }`}
                aria-label={`Go to product slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
