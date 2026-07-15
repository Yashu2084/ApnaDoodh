"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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
    <span ref={ref} className="font-black tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function AboutImpact() {
  const stats = [
    {
      value: "500",
      suffix: "+",
      label: "Verified Farmers",
      desc: "Earning sustainable daily payouts",
    },
    {
      value: "15000",
      suffix: "+",
      label: "Orders Delivered",
      desc: "Fresh raw farm milk doorstep drops",
    },
    {
      value: "35",
      suffix: "+",
      label: "Service Locations",
      desc: "Delivered active across Gurugram",
    },
    {
      value: "4.9",
      suffix: "★",
      label: "Average Rating",
      desc: "Highly rated for quality and purity",
    },
    {
      value: "98",
      suffix: "%",
      label: "Happy Customers",
      desc: "Repeat subscription renewals weekly",
    },
  ];

  return (
    <section className="w-full px-6 sm:px-12 lg:px-16 py-20 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100 relative overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-blue-50/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">The Difference We Make</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Our Growing Impact
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            Through simple technology and fair trade, we are creating a positive, transparent ripple effect across rural farms and urban homes.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 items-stretch max-w-6xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`rounded-3xl border border-slate-200/50 bg-white/60 p-6 text-center shadow-xs backdrop-blur-xs flex flex-col justify-between transition-all hover:bg-white hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 ${
                idx === 4 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <h4 className="text-xs font-bold text-slate-900 mt-3 leading-snug">{stat.label}</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-normal">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
