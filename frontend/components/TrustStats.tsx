"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PREMIUM_EASE, staggerContainer, fadeInUpReveal } from "@/lib/animations";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedNumber({ value, duration = 1.5, suffix = "", prefix = "" }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (!isInView) return;

    const targetVal = parseFloat(value.replace(/,/g, ""));
    if (isNaN(targetVal)) return;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Easing: easeOutQuad
      const easeProgress = progress * (2 - progress);
      
      const currentVal = easeProgress * targetVal;
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setCount(targetVal);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [isInView, value, duration]);

  const isFloat = value.includes(".");
  const formatted = isFloat 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="font-bold tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function TrustStats() {
  const stats = [
    {
      icon: "👨‍🌾",
      value: "278",
      suffix: "+",
      label: "Verified Farmers",
      desc: "Trusted local family dairies",
    },
    {
      icon: "🥛",
      value: "15000",
      suffix: "+",
      label: "Orders Delivered",
      desc: "Doorstep cold chain drops",
    },
    {
      icon: "⭐",
      value: "4.4",
      suffix: "/5",
      label: "Average Rating",
      desc: "From 3,000+ happy homes",
    },
    {
      icon: "📍",
      value: "35",
      suffix: "+",
      label: "Service Locations",
      desc: "Delivered across Gurugram sectors",
    },
    {
      icon: "💚",
      value: "85",
      suffix: "%",
      label: "Customer Satisfaction",
      desc: "Repeat subscription renewals",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 relative overflow-hidden scroll-mt-24">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-50/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div 
          variants={staggerContainer(0.05)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 grid-cols-2 lg:grid-cols-5 items-stretch"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUpReveal}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className={`rounded-3xl border border-white/50 bg-white/60 p-6 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:bg-white/85 hover:border-white/60 hover:shadow-[0_16px_32px_rgba(31,38,135,0.08)] ${
                idx === 4 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                <span className="text-3xl block filter drop-shadow-sm select-none mb-3">{stat.icon}</span>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <h4 className="text-xs font-bold text-slate-900 mt-2.5 leading-snug">{stat.label}</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2 leading-normal">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
