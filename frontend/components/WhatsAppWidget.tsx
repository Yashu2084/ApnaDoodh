"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, HelpCircle, ShoppingCart } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Tooltip automatic pulse on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto hide tooltip after 8 seconds
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
      return () => clearTimeout(hideTimer);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const supportNumber = "+91-8279579636"; // ApnaDoodh Support Number

  const options = [
    {
      label: "Chat with Support",
      desc: "Instant resolution for delivery/orders",
      icon: MessageSquare,
      text: "Hi ApnaDoodh, I need help with my dairy delivery.",
    },
    {
      label: "Ask Questions",
      desc: "Inquire about milk quality or farmers",
      icon: HelpCircle,
      text: "Hi ApnaDoodh, I have a question regarding farmer verification.",
    },
    {
      label: "Order through WhatsApp",
      desc: "Place milk subscriptions directly",
      icon: ShoppingCart,
      text: "Hi ApnaDoodh, I want to place a milk order.",
    },
  ];

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 mr-1 bg-slate-900 text-white text-[10px] font-bold py-2 px-3.5 rounded-full shadow-lg relative pointer-events-none tracking-wide uppercase select-none"
          >
            Need Help? Chat on WhatsApp
            <div className="absolute top-full right-6 w-2 h-2 bg-slate-900 rotate-45 -translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Support Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="mb-4 w-72 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-5 text-white flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <img src="/assets/logo/whatsapp.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-450 border border-emerald-600 animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-extrabold tracking-wide">ApnaDoodh Support</h4>
                  <p className="text-[10px] text-emerald-100 font-medium">Active • Replies in seconds</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List options */}
            <div className="p-4 bg-slate-50/50 space-y-2">
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Choose a channel</p>
              {options.map((opt, idx) => {
                const Icon = opt.icon;
                const link = `https://wa.me/${supportNumber}?text=${encodeURIComponent(opt.text)}`;
                return (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs hover:border-emerald-200 hover:shadow-md transition duration-200 text-left cursor-pointer group"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="flex-grow min-w-0">
                      <h5 className="text-[11px] font-bold text-slate-800 transition group-hover:text-emerald-700">
                        {opt.label}
                      </h5>
                      <p className="text-[9px] text-slate-500 font-medium truncate">{opt.desc}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-slate-100/50 border-t border-slate-100 p-3 text-center">
              <p className="text-[9px] text-slate-400 font-medium">Powered by ApnaDoodh Cold Logistics</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Trigger */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          !isOpen
            ? { y: [0, -6, 0] }
            : { y: 0 }
        }
        transition={
          !isOpen
            ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
            : {}
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_36px_rgba(16,185,129,0.35)] hover:bg-emerald-600 cursor-pointer border border-emerald-400/20 active:scale-95"
        aria-label="WhatsApp Support"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img src="/assets/logo/whatsapp.png" alt="WhatsApp" className="h-7 w-7 object-contain" />
        )}
      </motion.button>
    </div>
  );
}
