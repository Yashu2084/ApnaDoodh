"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Sparkles, AlertTriangle, Lightbulb, Handshake, Globe } from "lucide-react";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}

function TimelineItem({ year, title, description, icon: Icon, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;
  
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 last:mb-0 w-full">
      {/* Visual Dot on Vertical Line */}
      <div className="absolute left-[20px] md:left-1/2 top-4 -translate-x-[7px] md:-translate-x-1/2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 border-4 border-white shadow-md shadow-blue-500/30" />

      {/* Card Wrapper */}
      <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isEven ? "md:text-right" : "md:order-last md:text-left"}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40, y: 15 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className={`group relative rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 sm:p-8 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 shadow-sm`}
        >
          {/* Tag & Year */}
          <div className={`flex items-center gap-3 mb-4 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold border border-blue-100/50 group-hover:scale-110 transition duration-300">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-black text-blue-600 tracking-wider font-inter">{year}</span>
          </div>

          {/* Heading & Text */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify font-medium">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Empty Spacer Column for Desktop */}
      <div className="hidden md:block w-[45%]" />
    </div>
  );
}

export default function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const timelineData = [
    {
      year: "2024 — THE INSPIRATION",
      title: "Why ApnaDoodh Was Created",
      description: "Frustrated by the lack of quality in processed corporate milk and the unfair, delayed compensation given to hardworking rural farmers, our founders asked: why can't we bypass the middle steps and buy direct?",
      icon: Sparkles
    },
    {
      year: "2024 — THE PROBLEM",
      title: "The Packaged processed Dairy Crisis",
      description: "Traditional packaged milk undergoes harsh heat processing, strips vital nutrients, sits in cold storage hubs for days, and is often blended with stabilizers. Transparency is completely lost in massive corporate supply chains.",
      icon: AlertTriangle
    },
    {
      year: "2025 — THE SOLUTION",
      title: "Bypassing the Middlemen",
      description: "We established a strict 4°C cold-chain pipeline connecting local farms directly to customers. Eliminating complex distributor channels allows us to deliver pure, unadulterated milk to doorsteps within 12 hours of milking.",
      icon: Lightbulb
    },
    {
      year: "2025 — EMPOWERING FARMERS",
      title: "Sustainable Direct-Trade Fair Pricing",
      description: "By removing distributors, we enabled farmers to set their own pricing models. ApnaDoodh issues daily digital payouts, supporting agricultural sustainability and allowing direct reinvestment into quality cow care.",
      icon: Handshake
    },
    {
      year: "2026 — DIGITAL MARKETPLACE",
      title: "A Trusted Community Platform",
      description: "Today, ApnaDoodh connects hundreds of organic dairy farms to thousands of active families. Daily independent lab tests and purity logs are published directly online, establishing an open era of dairy transparency.",
      icon: Globe
    }
  ];

  return (
    <section id="story" ref={containerRef} className="relative w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-slate-100 bg-white scroll-mt-24">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">The Journey</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          How We Redefined Dairy
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
          A vertical timeline outlining our mission to restore trust, transparency, and fairness in the milk industry.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 pt-4">
        {/* Timeline Central Vertical Line */}
        <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-1 bg-slate-100 rounded-full md:-translate-x-1/2">
          {/* Animated fill line */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="w-full h-full bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 origin-top rounded-full shadow-[0_0_8px_rgba(53,107,233,0.3)]"
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {timelineData.map((item, idx) => (
            <TimelineItem
              key={idx}
              index={idx}
              year={item.year}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
