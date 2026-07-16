"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  price: string;
  priceNum: number;
  sellerName: string;
  color: string;
  badge: string;
}

const products: Product[] = [
  {
    id: "cow-milk",
    name: "Fresh Cow Milk",
    description: "Rich, creamy milk from grass-fed cows with 3.8% fat content",
    icon: "🥛",
    image: "/apnadoodh_cow_milk.webp",
    price: "₹99 / Litre",
    priceNum: 99,
    sellerName: "Govardhan A2 Dairy",
    color: "from-amber-100/70 to-amber-50/50 border-amber-200/40",
    badge: "Premium A2",
  },
  {
    id: "paneer",
    name: "Handcrafted Paneer",
    description: "Soft, fresh paneer made daily with zero preservatives",
    icon: "🧀",
    image: "/apnadoodh_paneer.webp",
    price: "₹249 / 250g",
    priceNum: 249,
    sellerName: "Aravali Foothills Dairy",
    color: "from-orange-100/70 to-orange-50/50 border-orange-200/40",
    badge: "100% Pure",
  },
  {
    id: "curd",
    name: "Dahi/Yogurt",
    description: "Probiotic-rich yogurt with live cultures for gut health",
    icon: "🍶",
    image: "/apnadoodh_curd.webp",
    price: "₹89 / 500g",
    priceNum: 89,
    sellerName: "Govardhan A2 Dairy",
    color: "from-pink-100/70 to-pink-50/50 border-pink-200/40",
    badge: "Live Cultures",
  },
  {
    id: "ghee",
    name: "A2 Desi Cow Ghee",
    description: "A2 ghee, pure and unadulterated, rich in butyric acid",
    icon: "✨",
    image: "/apnadoodh_ghee.webp",
    price: "₹649 / 500ml",
    priceNum: 649,
    sellerName: "Govardhan A2 Dairy",
    color: "from-yellow-100/70 to-yellow-50/50 border-yellow-200/40",
    badge: "A2 Grade",
  },
  {
    id: "butter",
    name: "Fresh White Butter",
    description: "Cultured butter with authentic taste from fresh cream",
    icon: "🧈",
    image: "/apnadoodh_butter.webp",
    price: "₹229 / 250g",
    priceNum: 229,
    sellerName: "Aravali Foothills Dairy",
    color: "from-yellow-100/70 to-amber-50/50 border-amber-200/40",
    badge: "Fresh Daily",
  },
];

export default function ProductsHero() {
  const { addToCart } = useCart();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentProductIndex, isHovered]);

  const currentProduct = products[currentProductIndex];
  const nextProduct = products[(currentProductIndex + 1) % products.length];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 10,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 280, damping: 28 },
    opacity: { duration: 0.25 },
    scale: { duration: 0.25 },
  };

  return (
    <section 
      className="relative w-full px-6 sm:px-12 lg:px-16 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-white to-slate-50/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight mb-4">
          Premium Dairy Products
        </h2>
        <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
          Every product is crafted with care, tested rigorously, and delivered fresh from verified local farmers
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[430px] flex items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={`next-${nextProduct.id}`}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 0.35, scale: 0.92, y: 15, rotate: 3 }}
              transition={{ duration: 0.3 }}
              className={`absolute w-80 h-[380px] rounded-3xl bg-gradient-to-br ${nextProduct.color} border border-white/20 backdrop-blur-xl shadow-lg p-6 flex flex-col items-center justify-center text-center`}
            >
              <div className="relative w-36 h-36 mb-4 filter blur-[1px]">
                <Image
                  src={nextProduct.image}
                  alt={nextProduct.name}
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentProduct.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className={`relative w-80 h-[380px] rounded-3xl bg-gradient-to-br ${currentProduct.color} border-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-between text-center z-10 hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-[250%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              <div className="w-full flex items-center justify-between z-10">
                <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-slate-800 border border-white/60 shadow-sm">
                  {currentProduct.badge}
                </span>
                <span className="text-xs font-black text-blue-600 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-sm">
                  {currentProduct.price.split(" /")[0]}
                </span>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-40 h-40 my-2 z-10 flex items-center justify-center"
              >
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  sizes="160px"
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </motion.div>

              <div className="z-10">
                <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{currentProduct.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-2 line-clamp-2">{currentProduct.description}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.priceNum,
                    sellerName: currentProduct.sellerName,
                    image: currentProduct.image,
                  });
                }}
                suppressHydrationWarning
                className="w-full z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add To Cart
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {products.map((product, idx) => (
            <motion.button
              key={product.id}
              onClick={() => {
                setDirection(idx > currentProductIndex ? 1 : -1);
                setCurrentProductIndex(idx);
              }}
              whileHover={{ x: 6, scale: 1.01 }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden group cursor-pointer ${
                idx === currentProductIndex
                  ? `border-blue-500/50 bg-blue-500/10 shadow-[0_8px_20px_rgba(53,107,233,0.12)]`
                  : `border-white/30 bg-white/40 shadow-sm hover:border-white/60 hover:bg-white/60 hover:shadow-md`
              }`}
            >
              <div className="absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center bg-white/80 border border-white/60 shadow-inner overflow-hidden ${
                  idx === currentProductIndex ? "scale-110" : ""
                } transition-transform duration-300`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <h4 className={`font-black text-sm tracking-tight ${idx === currentProductIndex ? "text-blue-600" : "text-slate-900"}`}>
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold">{product.badge}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black ${idx === currentProductIndex ? "text-blue-600" : "text-slate-500"}`}>
                    {product.price.split(" /")[0]}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}

          <div className="flex gap-2 justify-center pt-4">
            {products.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentProductIndex ? 1 : -1);
                  setCurrentProductIndex(idx);
                }}
                animate={{
                  scaleX: idx === currentProductIndex ? 1.5 : 1,
                  width: idx === currentProductIndex ? 32 : 8,
                }}
                className={`h-2 rounded-full transition-colors cursor-pointer ${
                  idx === currentProductIndex ? "bg-blue-600" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
