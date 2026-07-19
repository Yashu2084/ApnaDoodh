"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

const PLACEHOLDERS = [
  "Search Milk...",
  "Search Paneer...",
  "Search Farmers...",
  "Search Curd...",
  "Search Ghee...",
];

const SUGGESTIONS = [
  { name: "A2 Cow Milk", type: "Product", href: "/dairy-ranges#cow-milk" },
  { name: "Creamy Buffalo Milk", type: "Product", href: "/dairy-ranges#buffalo-milk" },
  { name: "Organic Paneer", type: "Product", href: "/dairy-ranges#paneer" },
  { name: "Probiotic Curd (Dahi)", type: "Product", href: "/dairy-ranges#curd" },
  { name: "Shree Krishna Dairy", type: "Farmer", href: "/#farmers" },
  { name: "Vedic Farms", type: "Farmer", href: "/#farmers" },
];

export default function SearchSection() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(SUGGESTIONS);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (!query) {
      setFilteredSuggestions(SUGGESTIONS);
      return;
    }
    const filtered = SUGGESTIONS.filter((item) => {
      const matchQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                         item.type.toLowerCase().includes(query.toLowerCase());
      const matchFilter = selectedFilter === "all" || item.type.toLowerCase() === selectedFilter;
      return matchQuery && matchFilter;
    });
    setFilteredSuggestions(filtered);
  }, [query, selectedFilter]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="group relative w-full min-h-[50vh] flex flex-col justify-center items-center py-12 sm:py-16 overflow-hidden z-20 scroll-mt-24">
      
      {/* Animated Scenic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.01, 1.05, 1.01],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/search-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft overlay to match brand aesthetics while maintaining full image quality */}
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
      </div>

      <div ref={containerRef} className="max-w-3xl w-full mx-auto px-6 relative z-10">
        {/* Glassmorphic Container for High Readability and Premium Feel */}
        <div className="w-full relative flex flex-col items-center rounded-[2rem] border border-white/60 bg-white/45 backdrop-blur-xl p-5 sm:p-7 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-500 hover:bg-white/55 hover:border-white/80 hover:shadow-[0_15px_45px_0_rgba(31,38,135,0.22)]">
          
          {/* Header Block with Visible Text */}
          <div className="text-center mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-700 bg-blue-100/50 px-2.5 py-0.5 rounded-full border border-blue-200/30">
              Verified Dairy Marketplace
            </span>
            <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              What are you looking for today?
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-700">
              Search fresh milk, ghee, paneer, and certified local farms.
            </p>
          </div>

          {/* Main Search Container */}
          <div className="w-full flex items-center gap-3 relative">
            <div className="relative flex-grow">
              
              {/* Search Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
                <Search className="h-4.5 w-4.5 text-blue-600" />
              </span>

              {/* Input field with Glassmorphism */}
              <input
                type="text"
                value={query}
                suppressHydrationWarning
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-full border border-white/60 bg-white/55 backdrop-blur-md py-3 pl-11 pr-5 text-xs font-semibold text-slate-900 outline-none transition-all duration-300 focus:border-blue-500/80 focus:bg-white/80 focus:shadow-[0_0_0_4px_rgba(53,107,233,0.15)] placeholder:text-transparent shadow-md"
                aria-label="Search ApnaDoodh"
              />

              {/* Rotating Placeholder overlay */}
              <span className="absolute left-11 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none select-none z-0">
                <AnimatePresence mode="wait">
                  {!query && (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 0.8, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="block"
                    >
                      {PLACEHOLDERS[index]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>

            {/* Filter Toggle Button - Glassmorphic and Animated */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer shadow-md ${
                showFilters || selectedFilter !== "all"
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/50 border-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900"
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </motion.button>

            {/* Real-time search autocomplete suggestions - positioned relative to Input Container */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute top-full left-0 right-0 z-50 overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl mt-2 max-w-full"
                >
                  <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {query ? "Matching Results" : "Suggested Searches"}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-500" /> delivering nearby
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/45 transition border border-transparent hover:border-white/30 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                              item.type === "Product" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {item.name[0]}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                                {item.name}
                              </p>
                              <p className="text-[9px] text-slate-500 font-semibold tracking-wide uppercase">
                                {item.type}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 transition opacity-0 group-hover:opacity-100" />
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-500 font-semibold">
                        No matching products or farmers found for "{query}". <br />
                        Try searching <span className="font-bold text-slate-700">milk</span>, <span className="font-bold text-slate-700">paneer</span>, or <span className="font-bold text-slate-700">farms</span>.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden mt-3 rounded-2xl bg-white/30 border border-white/40 p-3 flex gap-2 flex-wrap items-center justify-center backdrop-blur-md"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 mr-2">Filter By:</span>
                {[
                  { id: "all", label: "All Items" },
                  { id: "product", label: "Products Only" },
                  { id: "farmer", label: "Farmers Only" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition cursor-pointer active:scale-95 ${
                      selectedFilter === f.id
                        ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                        : "bg-white/45 border-white/50 text-slate-700 hover:bg-white/60"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
