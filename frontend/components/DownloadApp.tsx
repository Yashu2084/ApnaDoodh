"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Apple, Play, Home, ShoppingBag, ClipboardList, User, Wifi, Battery, Signal, Search } from "lucide-react";

export default function DownloadApp() {
  const features = [
    { title: "Real-time Order Tracking", desc: "Follow our morning cold courier dispatch route in real time." },
    { title: "Live Delivery Updates", desc: "Get SMS and push notifications at door drop, with bottle exchange logging." },
    { title: "Easy Subscriptions & Reordering", desc: "Manage calendars, pause milk delivery for holidays with one tap." },
    { title: "Secure One-Tap Payments", desc: "Auto debit via UPI, credit cards, or integrated ApnaDoodh wallet." },
  ];

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden flex items-center justify-center min-h-screen py-20 px-6 sm:px-12 lg:px-16">
      {/* Animated Scenic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
            backgroundImage: "url('/bg-pasture-1.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft color-graded premium overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/45" />
        <div className="absolute inset-0 bg-sky-900/5 backdrop-brightness-[0.97]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl rounded-[3rem] border border-white/70 bg-white/92 p-8 sm:p-12 lg:p-16 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.18)] backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 opacity-70 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.82),transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(236,255,255,0.95),transparent_24%)]" />
          <div className="absolute left-[-5%] top-0 h-48 w-48 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute right-[-5%] bottom-10 h-44 w-44 rounded-full bg-blue-100/55 blur-3xl" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-blue-200/30 blur-sm opacity-30" />
          <div className="absolute left-8 top-24 h-1.5 w-24 rounded-full bg-white/90 blur-sm opacity-90" />
          <div className="absolute right-8 top-32 h-1.5 w-20 rounded-full bg-white/90 blur-sm opacity-85" />

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative">
            {/* Left Column: Text & Store Links */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-left"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/60 px-4 py-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                Mobile App Coming Soon
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Our Mobile App Is Coming Soon
              </h2>
              <p className="text-sm leading-7 text-slate-500 max-w-lg">
                Order fresh dairy products anytime, anywhere. Experience unadulterated cold-chain delivery management directly in your pocket.
              </p>

              {/* Features Checklist */}
              <div className="space-y-3.5 pt-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 mt-0.5 border border-blue-100/40">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{feat.title}</h3>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disabled Store Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-slate-900/5 backdrop-blur-xs pointer-events-none" />
                  <button
                    disabled
                    className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/40 px-5 py-2.5 text-slate-400 select-none cursor-not-allowed text-left max-w-[170px]"
                  >
                    <Play className="h-5 w-5 fill-slate-300 stroke-none" />
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">Get it on</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 leading-none">Google Play</p>
                    </div>
                  </button>
                  <span className="absolute -top-2.5 right-2 rounded-md bg-slate-900 text-white text-[8px] font-bold py-0.5 px-2 uppercase tracking-wide select-none">
                    Soon
                  </span>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-slate-900/5 backdrop-blur-xs pointer-events-none" />
                  <button
                    disabled
                    className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/40 px-5 py-2.5 text-slate-400 select-none cursor-not-allowed text-left max-w-[170px]"
                  >
                    <Apple className="h-5 w-5 fill-slate-400 stroke-none" />
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">Download on the</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 leading-none">App Store</p>
                    </div>
                  </button>
                  <span className="absolute -top-2.5 right-2 rounded-md bg-slate-900 text-white text-[8px] font-bold py-0.5 px-2 uppercase tracking-wide select-none">
                    Soon
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium CSS Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative w-68 h-[500px] rounded-[3rem] bg-slate-950 p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-visible flex flex-col justify-between border-[10px] border-slate-900"
              >
                <div className="absolute -left-3.5 top-24 w-1 h-10 bg-slate-800 rounded-l-md" />
                <div className="absolute -left-3.5 top-38 w-1 h-10 bg-slate-800 rounded-l-md" />
                <div className="absolute -right-3.5 top-30 w-1 h-14 bg-slate-800 rounded-r-md" />

                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5.5 rounded-full bg-slate-950 z-30 flex items-center justify-between px-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-900/80" />
                  <span className="h-1 w-8 rounded-full bg-slate-900" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                <div className="w-full h-full rounded-[2.3rem] bg-slate-50 border border-slate-900/5 p-3.5 pt-7.5 flex flex-col justify-between select-none relative z-10 overflow-hidden">
                  <div className="flex items-center justify-between px-2.5 text-[8px] font-black text-slate-800 z-20">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Signal className="h-2.5 w-2.5 text-slate-700" />
                      <Wifi className="h-2.5 w-2.5 text-slate-700" />
                      <Battery className="h-2.5 w-4 text-slate-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mt-1">
                    <div className="text-left">
                      <span className="text-[8px] font-black tracking-wide text-blue-600 block leading-none">APNADOODH</span>
                      <span className="text-[7px] font-bold text-slate-400 block leading-none mt-0.5">Sector 46, Gurugram</span>
                    </div>
                    <span className="h-5.5 w-5.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">
                      AD
                    </span>
                  </div>

                  <div className="mt-2 rounded-lg bg-white border border-slate-100 p-1.5 flex items-center gap-1.5 shadow-xs">
                    <Search className="h-2.5 w-2.5 text-blue-600" />
                    <span className="text-[7px] text-slate-400 font-semibold">Search milk, paneer, ghee...</span>
                  </div>

                  <div className="flex-grow py-2 space-y-2 overflow-hidden">
                    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-2 text-white text-left relative overflow-hidden shadow-sm">
                      <div className="relative z-10">
                        <p className="text-[5px] font-bold uppercase tracking-widest text-blue-100 leading-none">Direct Hub</p>
                        <p className="text-[8px] font-extrabold mt-0.5 leading-tight">Get 10% off A2 Milk subscriptions</p>
                      </div>
                      <div className="absolute -right-3 -bottom-3 w-10 h-10 rounded-full bg-white/10 blur-md" />
                    </div>

                    <div className="text-left">
                      <p className="text-[8px] font-extrabold uppercase tracking-wide text-slate-400">Farmers Nearby</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {[
                          { name: "Vedic Farms", score: "4.9", price: "₹72/L", badge: "A2 Milk" },
                          { name: "Sita Cow Farm", score: "4.8", price: "₹75/L", badge: "Buffalo" },
                        ].map((fm, i) => (
                          <div key={i} className="rounded-xl border border-slate-100 bg-white p-2 text-left flex flex-col justify-between shadow-xs hover:border-blue-100 transition">
                            <div>
                              <span className="inline-block text-[5px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1 py-0.2 rounded-sm mb-1">
                                {fm.badge}
                              </span>
                              <p className="text-[7px] font-extrabold text-slate-800 truncate">{fm.name}</p>
                              <p className="text-[6px] text-slate-500 font-semibold mt-0.5">⭐ {fm.score} • {fm.price}</p>
                            </div>
                            <span className="mt-1.5 rounded-md bg-blue-600 text-white text-[5px] font-bold py-1 text-center block uppercase tracking-wide shadow-xs shadow-blue-500/10">
                              Order
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2 flex items-center justify-between text-left shadow-xs">
                      <div>
                        <p className="text-[5px] font-bold uppercase tracking-widest text-emerald-600 leading-none">Active Dispatch</p>
                        <p className="text-[8px] font-extrabold text-slate-800 mt-0.5 leading-none">Out for delivery</p>
                        <p className="text-[5px] text-slate-400 mt-0.5">ETA: 6:45 AM • Insulated Cold Storage</p>
                      </div>
                      <span className="h-4.5 w-4.5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[8px] animate-bounce">
                        🚚
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-around">
                    {[
                      { icon: Home, active: true },
                      { icon: ShoppingBag, active: false },
                      { icon: ClipboardList, active: false },
                      { icon: User, active: false }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <span
                          key={idx}
                          className={`p-1 transition-all ${item.active ? "text-blue-600 scale-110" : "text-slate-400"}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      );
                    })}
                  </div>
                </div>

              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10 to-transparent skew-x-12 z-20 pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
