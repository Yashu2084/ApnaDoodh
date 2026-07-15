"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Rohan Sharma",
    role: "Verified Buyer (Gurugram)",
    content: "Switching to ordering from Govardhan pastures on ApnaDoodh has been the best decision for my family. The cow milk is rich, clean, and tastes exactly like what I used to get from my grandparents' farm. Direct delivery from Sohna Valley is incredibly fast.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Priya Patel",
    role: "Verified Buyer (Sector 56)",
    content: "The ability to browse local farm pages, compare lab purity test scores, and order paneer or curd directly is fantastic. I love the transparency. The probiotic curd is thick, rich, and absolutely delicious.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Amit Verma",
    role: "Verified Buyer (Sohna Road)",
    content: "We need high-fat buffalo milk for tea, and ordering directly from Murrah Heights on the platform has been a game-changer. The glass bottle system is great for cutting plastic, and I pay the farmer directly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

export default function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles client-side to prevent hydration issues
    const generated = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 3, // 3px to 9px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
    }));
    setParticles(generated);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="reviews"
      style={{ clipPath: "inset(0)" }}
      className="relative left-1/2 w-screen -ml-[50vw] min-h-screen overflow-hidden border-t border-slate-100 py-20 sm:py-24 lg:py-28 flex flex-col justify-center"
    >
      {/* 1. Animated Scenic Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-30">
        <motion.div
          animate={{
            scale: [1.02, 1.06, 1.02],
            x: [-3, 3, -3],
            y: [2, -2, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 28,
            ease: "easeInOut",
          }}
          className="absolute -inset-4"
          style={{
            backgroundImage: "url('/bg-reviews-custom.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.96) saturate(1.02)",
          }}
        />
      </div>

      {/* 2. Frosted Glass Overlay (Frosted Blue & White layer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-blue-50/80 to-white/75 backdrop-blur-[6px] pointer-events-none -z-20" />

      {/* 3. Base subtle ambient background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/15 to-white/30 pointer-events-none -z-20" />

      {/* 4. Flowing glassmorphism blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.12, 0.93, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-300/12 to-sky-200/8 blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-200/12 to-blue-300/8 blur-[130px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 30, -30, 0],
          scale: [0.95, 1.05, 0.95, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-200/8 to-indigo-100/4 blur-[100px] pointer-events-none -z-10"
      />

      {/* 5. Subtle Light Rays radiating from top center */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-1/2 -translate-x-1/2 w-full min-w-[1440px] h-full opacity-40">
          <g opacity="0.8">
            <motion.path 
              d="M720 -50 L100 950 H250 L720 -50 Z" 
              fill="url(#rayGradReview)" 
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path 
              d="M720 -50 L450 950 H600 L720 -50 Z" 
              fill="url(#rayGradReview)" 
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.path 
              d="M720 -50 L800 950 H950 L720 -50 Z" 
              fill="url(#rayGradReview)" 
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.path 
              d="M720 -50 L1150 950 H1300 L720 -50 Z" 
              fill="url(#rayGradReview)" 
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </g>
          <defs>
            <linearGradient id="rayGradReview" x1="720" y1="-50" x2="720" y2="950" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="0.3" stopColor="#dbeafe" stopOpacity="0.15" />
              <stop offset="0.7" stopColor="#bfdbfe" stopOpacity="0.04" />
              <stop offset="1" stopColor="#eff6ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. Elegant Curved Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1000" preserveAspectRatio="none">
        <motion.path
          d="M -100,250 C 350,450 750,150 1600,350"
          fill="none"
          stroke="url(#lineGradReview1)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M -100,250 C 350,450 750,150 1600,350",
              "M -100,300 C 450,400 650,250 1600,300",
              "M -100,250 C 350,450 750,150 1600,350"
            ]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M -100,600 C 450,300 850,800 1600,550"
          fill="none"
          stroke="url(#lineGradReview2)"
          strokeWidth="1"
          animate={{
            d: [
              "M -100,600 C 450,300 850,800 1600,550",
              "M -100,550 C 350,400 950,700 1600,600",
              "M -100,600 C 450,300 850,800 1600,550"
            ]
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <defs>
          <linearGradient id="lineGradReview1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#356be9" stopOpacity="0" />
            <stop offset="30%" stopColor="#356be9" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradReview2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="40%" stopColor="#356be9" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#356be9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 7. Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20 pointer-events-none -z-10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ["0px", "-150px", "0px"],
            x: ["0px", "60px", "0px"],
            opacity: [0.15, 0.65, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Customer Love</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            What Our Buyers Say
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Read stories from local Gurugram families who order fresh dairy directly from vetted farmers.
          </p>
        </div>

        <div className="relative mt-16 flex flex-col items-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 backdrop-blur-md p-8 shadow-xl shadow-slate-100/40 md:p-12 hover:bg-white/70 transition-all duration-300">
            
            {/* Quote icon background */}
            <div className="absolute right-8 top-8 text-slate-100">
              <svg className="h-24 w-24 fill-current opacity-60" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-4.337 2.658-4.717 5.485.809.053 1.583.473 1.948 1.139.366.664.316 1.488-.13 2.09-.446.602-1.18.91-1.913.793-1.077-.101-1.928.718-2.008 1.839v4.633h4.822v6.002H14.017zm-12 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-4.322 2.658-4.702 5.485.808.053 1.582.473 1.947 1.139.366.664.316 1.488-.13 2.09-.446.602-1.18.91-1.913.793-1.077-.101-1.928.718-2.008 1.839v4.633h4.822v6.002H2.017z" />
              </svg>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review body */}
                <p className="text-lg leading-8 text-slate-800 font-medium relative z-10">
                  &ldquo;{testimonials[index].content}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <Image
                    src={testimonials[index].avatar}
                    alt={testimonials[index].name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-955">{testimonials[index].name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 fill-blue-500 text-blue-500" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      {testimonials[index].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider controls */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handlePrev}
              suppressHydrationWarning
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/60 backdrop-blur-md text-slate-600 transition hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-600 active:scale-95 shadow-md cursor-pointer"
              aria-label="Previous review"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              suppressHydrationWarning
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/60 backdrop-blur-md text-slate-600 transition hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-600 active:scale-95 shadow-md cursor-pointer"
              aria-label="Next review"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
