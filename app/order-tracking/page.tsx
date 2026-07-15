"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, CheckCircle2, User, Phone, MapPin, Thermometer, ShieldAlert, Sparkles, Navigation } from "lucide-react";

interface Stage {
  title: string;
  time: string;
  desc: string;
  detail?: string;
  status: "completed" | "active" | "pending";
}

export default function OrderTrackingPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(3); // Default to "Out for Delivery"

  const stages: Stage[] = [
    {
      title: "Sourced & Chilled",
      time: "4:15 AM",
      desc: "Milk extracted at Govardhan A2 Dairy and immediately brought down to 3.8°C.",
      detail: "Batch ID: B-GOV-9828. Gir Cows: Pasture Grazed.",
      status: currentStageIndex >= 0 ? (currentStageIndex === 0 ? "active" : "completed") : "pending",
    },
    {
      title: "Lab Purity Certified",
      time: "4:45 AM",
      desc: "Central hub laboratory clears batch after 40+ levels of rapid testing.",
      detail: "Fat: 4.25% | SNF: 8.75% | Water Dilution: 0% | Antibiotics: Negative.",
      status: currentStageIndex >= 1 ? (currentStageIndex === 1 ? "active" : "completed") : "pending",
    },
    {
      title: "Dispatched to Hub",
      time: "5:20 AM",
      desc: "Loaded into insulated multi-temperature cold vans and sent to Sector 56 Hub.",
      detail: "Transit temperature maintained under 4.0°C.",
      status: currentStageIndex >= 2 ? (currentStageIndex === 2 ? "active" : "completed") : "pending",
    },
    {
      title: "Out for Doorstep Drop",
      time: "5:50 AM",
      desc: "Delivery executive dispatches to Flat 402, Block C, Maple Heights.",
      detail: "Executive: Sunil Kumar (+91 98989 12345) • Vehicle Temp: 3.2°C.",
      status: currentStageIndex >= 3 ? (currentStageIndex === 3 ? "active" : "completed") : "pending",
    },
    {
      title: "Delivered & Proofed",
      time: "6:20 AM",
      desc: "Milk drop left inside your insulated thermal doorstep bag.",
      detail: "Delivered photo proof uploaded to dashboard.",
      status: currentStageIndex >= 4 ? (currentStageIndex === 4 ? "active" : "completed") : "pending",
    },
  ];

  const handleNextStage = () => {
    if (currentStageIndex < 4) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentStageIndex(0);
  };

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 flex items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Animated Scenic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.02, 1.05, 1.02],
            x: [-2, 2, -2],
            y: [1, -1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "easeInOut",
          }}
          className="absolute -inset-4"
          style={{
            backgroundImage: "url('/bg-pasture-2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft color-graded premium overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/50" />
        <div className="absolute inset-0 bg-sky-900/5 backdrop-brightness-[0.98]" />
        
        {/* Subtle glow layers */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-300/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl drop-shadow-sm">Live Delivery Tracker</h1>
          <p className="mt-3.5 text-slate-700 font-semibold drop-shadow-sm">
            Follow your early morning drop journey from the udder to your doorstep bag in real-time.
          </p>
        </div>

        {/* Premium outer glassmorphism container */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-5 sm:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {/* Tracking Grid layout */}
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            
            {/* Left: Timeline stages */}
            <div className="bg-white/75 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Morning Drop Timeline</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Order ID: APNA-2026-62024</p>
                </div>

                {/* Simulation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleNextStage}
                    disabled={currentStageIndex === 4}
                    className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-lg text-[10px] font-bold text-white hover:bg-blue-500 disabled:opacity-50 active:scale-95 transition cursor-pointer"
                  >
                    Simulate Drop Update
                  </button>
                </div>
              </div>

              {/* Stages Stack */}
              <div className="relative pl-6 space-y-8 border-l border-slate-100 ml-4">
                {stages.map((stage, idx) => {
                  const isCompleted = stage.status === "completed";
                  const isActive = stage.status === "active";
                  return (
                    <div key={idx} className="relative">
                      {/* Stage Circle Pin */}
                      <span className={`absolute -left-10 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                        isCompleted
                          ? "bg-blue-100 border-blue-200 text-blue-600"
                          : isActive
                          ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                          : "bg-white border-slate-200 text-slate-300"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : (
                          <span className="text-[11px] font-extrabold">{idx + 1}</span>
                        )}
                      </span>

                      {/* Content */}
                      <div className="space-y-1.5 pl-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-extrabold ${isActive ? "text-blue-600" : "text-slate-900"}`}>{stage.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">{stage.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-5">{stage.desc}</p>
                        
                        {stage.detail && (isCompleted || isActive) && (
                          <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl font-medium leading-4">
                            {stage.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Map mockup & Executive specs */}
            <div className="space-y-6">
              
              {/* Map visual mock */}
              <div className="bg-slate-900/95 border border-slate-800/80 rounded-3xl p-4 shadow-sm text-white overflow-hidden relative aspect-[4/3] flex flex-col justify-between backdrop-blur-md">
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Route Line SVG simulation */}
                  <svg className="absolute w-full h-full stroke-blue-500/40 fill-none stroke-[2] stroke-dasharray-[4]" viewBox="0 0 300 225">
                    <path d="M 50 180 Q 150 140 160 100 T 260 40" />
                  </svg>

                  {/* Farm Pin (Start) */}
                  <div className="absolute top-[160px] left-[40px] flex flex-col items-center">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-[8px] bg-slate-950 px-1 rounded mt-0.5 font-bold">Farm</span>
                  </div>

                  {/* Hub Pin */}
                  <div className="absolute top-[90px] left-[150px] flex flex-col items-center">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-[8px] bg-slate-950 px-1 rounded mt-0.5 font-bold">Hub</span>
                  </div>

                  {/* Delivery Van (Moving) */}
                  {currentStageIndex < 4 && (
                    <motion.div
                      animate={{
                        x: currentStageIndex === 0 ? [-100] : currentStageIndex === 1 ? [-50] : currentStageIndex === 2 ? [0] : [50],
                        y: currentStageIndex === 0 ? [50] : currentStageIndex === 1 ? [20] : currentStageIndex === 2 ? [-10] : [-50],
                      }}
                      transition={{ type: "spring", damping: 12 }}
                      className="absolute flex flex-col items-center z-10"
                    >
                      <Truck className="h-6 w-6 text-blue-400 fill-slate-900 border border-slate-700/80 rounded-xl p-1 bg-slate-950 shadow-lg shadow-blue-500/20" />
                      <span className="text-[8px] bg-slate-950 px-1.5 py-0.5 rounded-full mt-1 border border-slate-800 font-bold whitespace-nowrap">Van (Sunil)</span>
                    </motion.div>
                  )}

                  {/* Customer Pin (End) */}
                  <div className="absolute top-[30px] left-[250px] flex flex-col items-center">
                    <Navigation className="h-5 w-5 text-blue-500 fill-blue-500" />
                    <span className="text-[8px] bg-slate-950 px-1 rounded mt-0.5 font-bold">Home</span>
                  </div>
                </div>

                {/* Map header */}
                <div className="relative z-10 bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-[10px] mb-auto">
                  <span className="font-extrabold uppercase tracking-wider text-slate-400">Transit Coordinates</span>
                  <span className="text-blue-400 font-bold">Sector 56 Sector Road</span>
                </div>
              </div>

              {/* Delivery Executive Detail Card */}
              <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Your Drop Executive</h4>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Sunil Kumar</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Gurugram Central Hub</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919898912345"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95 transition"
                  >
                    <Phone className="h-4.5 w-4.5" />
                  </a>
                </div>

                {/* Cold temperature details */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Truck className="h-4 w-4" /> {/* Fallback lucide truck since it matches nicely */}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Storage Temp</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-1">3.2°C (Optimal)</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Seal Status</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mt-1">Tamper-Proof</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
