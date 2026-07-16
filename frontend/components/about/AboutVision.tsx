"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AboutVision() {
  return (
    <section className="relative w-full overflow-hidden py-24 px-6 sm:px-12 lg:px-16 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 border-y border-blue-800">
      
      {/* Aurora Floating Light Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 20, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[20%] -right-[10%] w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"
        />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider"
        >
          <Sparkles className="h-3 w-3 text-blue-400" />
          The Horizon
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs uppercase tracking-[0.3em] font-extrabold text-blue-400 font-inter"
        >
          Our Vision
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto"
        >
          “To become India's most trusted farm-to-home dairy marketplace.”
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-500 mx-auto rounded-full mt-4"
        />
      </div>
    </section>
  );
}
