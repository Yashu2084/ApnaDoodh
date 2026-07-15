"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Compass } from "lucide-react";
import { useLocation } from "@/components/LocationProvider";

const POPULAR_LOCATIONS = [
  { name: "Sector 46", city: "Gurugram" },
  { name: "Sector 14", city: "Gurugram" },
  { name: "Sector 56", city: "Gurugram" },
  { name: "Sector 45", city: "Gurugram" },
  { name: "Sector 21", city: "Gurugram" },
  { name: "DLF Phase 3", city: "Gurugram" },
  { name: "Sohna Road", city: "Gurugram" },
  { name: "Connaught Place", city: "Delhi" },
  { name: "Vasant Kunj", city: "Delhi" },
  { name: "Sector 62", city: "Noida" },
  { name: "Indirapuram", city: "Ghaziabad" },
  { name: "Sector 15", city: "Faridabad" },
];

export default function LocationModal() {
  const { isLocationModalOpen, closeLocationModal, currentLocation, setLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(POPULAR_LOCATIONS);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLocations(POPULAR_LOCATIONS);
    } else {
      const filtered = POPULAR_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  const handleSelectLocation = (name: string, city: string) => {
    setLocation(`${name}, ${city}`);
    closeLocationModal();
    setSearchQuery("");
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If user typed a custom location not in our list
      setLocation(searchQuery);
      closeLocationModal();
      setSearchQuery("");
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLocationModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLocationModal]);

  return (
    <AnimatePresence>
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLocationModal}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Select Delivery Location</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Currently delivering across NCR sectors</p>
                </div>
              </div>
              <button
                onClick={closeLocationModal}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition active:scale-90 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Current Location Display */}
            <div className="mt-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-600 animate-pulse" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Selection</p>
                  <p className="text-xs font-semibold text-slate-800">{currentLocation}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                Active
              </span>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleCustomLocationSubmit} className="mt-5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                suppressHydrationWarning
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sector, city or enter area..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white shadow-xs"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 px-3.5 py-1.5 text-[10px] font-bold text-white hover:bg-blue-500 transition cursor-pointer"
                >
                  Set Custom
                </button>
              )}
            </form>

            {/* Locations List */}
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                {searchQuery ? "Search Results" : "Popular Locations"}
              </p>
              
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, idx) => {
                    const isSelected = currentLocation === `${loc.name}, ${loc.city}`;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectLocation(loc.name, loc.city)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/80 text-blue-700 font-bold border border-blue-100"
                            : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className={`h-3.5 w-3.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                          <span>
                            {loc.name}, <span className="opacity-70">{loc.city}</span>
                          </span>
                        </span>
                        {isSelected && (
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">
                    No matching service locations found. <br />
                    <button
                      type="button"
                      onClick={() => {
                        setLocation(searchQuery);
                        closeLocationModal();
                        setSearchQuery("");
                      }}
                      className="mt-2 text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Deliver to "{searchQuery}" anyway?
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <p className="text-[10px] leading-relaxed text-slate-400">
                ApnaDoodh maintains a cold chain network. We only drop early morning deliveries to sectors within verified service bounds.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
