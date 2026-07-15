"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Compass, Star, CheckCircle, SlidersHorizontal, ArrowRight } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  farmer: string;
  sector: string;
  distance: number;
  rating: number;
  type: "cow" | "buffalo";
  breed: string;
  dispatchTime: string;
  image: string;
}

const mockFarms: Farm[] = [
  { id: "govardhan-pastures", name: "Govardhan A2 Dairy", farmer: "Ram Singh Yadav", sector: "Sector 56", distance: 1.2, rating: 4.9, type: "cow", breed: "A2 Gir Herd", dispatchTime: "4:30 AM", image: "/apnadoodh_cow_milk.webp" },
  { id: "murrah-heights", name: "Murrah Heights Farm", farmer: "Sandeep Chaudhary", sector: "Sohna Road", distance: 3.4, rating: 4.8, type: "buffalo", breed: "Murrah Buffalo", dispatchTime: "4:15 AM", image: "/apnadoodh_buffalo_milk.webp" },
  { id: "aravali-pastures", name: "Aravali Foothills Dairy", farmer: "Vikram & Sunita Pal", sector: "Sector 72", distance: 1.8, rating: 4.9, type: "cow", breed: "Sahiwal Breed", dispatchTime: "4:40 AM", image: "/apnadoodh_cow_milk.webp" },
  { id: "krishna-dairy", name: "Krishna Organic Farms", farmer: "Ramesh Sharma", sector: "Sector 56", distance: 2.1, rating: 4.7, type: "cow", breed: "Haryana Breed", dispatchTime: "4:45 AM", image: "/apnadoodh_cow_milk.webp" },
  { id: "yadav-buffalo-farm", name: "Yadav Buffalo Haven", farmer: "Vijay Yadav", sector: "Sohna Road", distance: 2.8, rating: 4.6, type: "buffalo", breed: "Murrah Buffalo", dispatchTime: "4:10 AM", image: "/apnadoodh_buffalo_milk.webp" },
  { id: "green-pastures", name: "Green Valley Farm", farmer: "Harpreet Singh", sector: "Sector 45", distance: 4.5, rating: 4.9, type: "cow", breed: "A2 Gir Herd", dispatchTime: "4:50 AM", image: "/apnadoodh_cow_milk.webp" },
];

const sectors = ["All Sectors", "Sector 56", "Sector 72", "Sohna Road", "Sector 45"];

export default function NearbyFarmersPage() {
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedType, setSelectedType] = useState<"all" | "cow" | "buffalo">("all");
  const [userLocation, setUserLocation] = useState("Sector 56, Gurugram");

  const filteredFarms = mockFarms.filter((farm) => {
    const matchesSector = selectedSector === "All Sectors" || farm.sector === selectedSector;
    const matchesType = selectedType === "all" || farm.type === selectedType;
    return matchesSector && matchesType;
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Nearby Heritage Farmers</h1>
          <p className="mt-3 text-slate-500">
            Find the closest organic pasture partners supplying milk to your sector. Fresher transit means higher nutritional value.
          </p>
        </div>

        {/* Interactive Location Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Current Sector</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{userLocation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-2">Quick switch sector:</span>
            {sectors.filter(s => s !== "All Sectors").map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSelectedSector(sec);
                  setUserLocation(`${sec}, Gurugram`);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer active:scale-95 ${
                  userLocation.startsWith(sec)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Filters & Map Mockup + List */}
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          
          {/* Filters & Map Visual */}
          <div className="space-y-6">
            
            {/* Filter Pane */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" /> Filters
              </h2>
              
              {/* Sector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Filter by Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {sectors.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Milk Type Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Cattle Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "cow", label: "Gir Cow" },
                    { id: "buffalo", label: "Buffalo" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setSelectedType(btn.id as any)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer active:scale-95 ${
                        selectedType === btn.id
                          ? "bg-slate-950 text-white border-slate-950"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Mockup */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-sm text-white overflow-hidden relative aspect-[4/3] flex flex-col justify-between">
              {/* Fake Map Grid Lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              
              {/* Map Pins */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* User Pin */}
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute z-10 flex flex-col items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50">
                    <Navigation className="h-3 w-3 fill-white text-white" />
                  </span>
                  <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded-full mt-1 border border-slate-800 font-bold whitespace-nowrap shadow-md">You (Sector 56)</span>
                </motion.div>

                {/* Farm Pins */}
                {filteredFarms.map((farm, idx) => {
                  // Fake offsets based on distance
                  const angle = (idx * 60) * (Math.PI / 180);
                  const radius = farm.distance * 25;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <div
                      key={farm.id}
                      className="absolute transition-all duration-500"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <div className="flex flex-col items-center group">
                        <MapPin className={`h-6 w-6 filter drop-shadow ${farm.type === "cow" ? "text-amber-500" : "text-indigo-400"}`} />
                        <span className="text-[8px] bg-slate-950/90 text-slate-200 border border-slate-800 px-1 py-0.5 rounded mt-0.5 font-bold whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity">
                          {farm.name.split(" ")[0]} ({farm.distance}km)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Live Radar</span>
                </div>
                <span className="text-slate-200 font-medium text-[10px]">{filteredFarms.length} Farms in Range</span>
              </div>
            </div>

          </div>

          {/* Farm Directory List */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              {filteredFarms.length} Farms delivering to you
            </h3>

            <AnimatePresence mode="popLayout">
              {filteredFarms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-100 rounded-3xl p-8 text-center"
                >
                  <Compass className="h-12 w-12 text-slate-300 mx-auto animate-spin" />
                  <p className="text-sm font-bold text-slate-800 mt-4">No Farms Found</p>
                  <p className="text-xs text-slate-400 mt-1">Try changing your filters or choosing another sector.</p>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {filteredFarms.map((farm, idx) => (
                    <motion.div
                      key={farm.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                          <Image
                            src={farm.image}
                            alt={farm.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900">{farm.name}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              farm.type === "cow"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            }`}>
                              {farm.breed}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Managed by {farm.farmer} • {farm.sector}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              {farm.rating}
                            </span>
                            <span className="text-[11px] text-slate-400">|</span>
                            <span className="text-[11px] text-slate-500 font-medium">Dispatches by: <strong className="text-slate-700">{farm.dispatchTime}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-blue-600">{farm.distance} km</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">transit distance</p>
                        </div>
                        <Link
                          href={`/farmer/store?farmId=${farm.id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer w-full sm:w-auto"
                        >
                          Shop Store
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
