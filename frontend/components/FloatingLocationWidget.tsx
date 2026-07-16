"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useLocation } from "@/components/LocationProvider";

export default function FloatingLocationWidget() {
  const { currentLocation, openLocationModal } = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
      className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md max-w-[280px] transition hover:bg-white/95 hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)] hover:border-blue-200"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50">
        <MapPin className="h-5 w-5" />
      </div>
      
      <div className="flex-grow min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Delivering To</p>
        <p className="mt-0.5 text-xs font-bold text-slate-800 truncate" title={currentLocation}>
          {currentLocation}
        </p>
        <button
          onClick={openLocationModal}
          className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-500 transition cursor-pointer"
        >
          Change Location
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
