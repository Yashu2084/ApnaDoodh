"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen py-8 space-y-12 bg-white">
      {/* Hero Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          {/* Tagline */}
          <div className="h-6 w-32 rounded-full animate-shimmer" />
          {/* Main Title */}
          <div className="space-y-3">
            <div className="h-12 w-full sm:w-[90%] rounded-2xl animate-shimmer" />
            <div className="h-12 w-[80%] rounded-2xl animate-shimmer" />
          </div>
          {/* Subtitle */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-[95%] rounded animate-shimmer" />
            <div className="h-4 w-[85%] rounded animate-shimmer" />
          </div>
          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 rounded-full animate-shimmer" />
            <div className="h-12 w-36 rounded-full animate-shimmer" />
          </div>
        </div>
        {/* Right side Image Placeholder */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full aspect-[4/3] max-w-lg rounded-[2.5rem] animate-shimmer shadow-xs" />
        </div>
      </div>

      {/* Grid skeleton for featured products */}
      <div className="max-w-7xl mx-auto px-4 space-y-8 pt-12">
        {/* Section title skeleton */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="h-5 w-24 rounded-full animate-shimmer" />
          <div className="h-8 w-64 rounded-xl animate-shimmer" />
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200/60 rounded-[2rem] p-6 space-y-4 shadow-xs bg-white">
              {/* Product Image */}
              <div className="w-full aspect-[4/3] rounded-2xl animate-shimmer" />
              {/* Category & Rating */}
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded animate-shimmer" />
                <div className="h-4 w-12 rounded animate-shimmer" />
              </div>
              {/* Product Title */}
              <div className="h-6 w-3/4 rounded animate-shimmer" />
              {/* Product Description */}
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded animate-shimmer" />
                <div className="h-3.5 w-[90%] rounded animate-shimmer" />
              </div>
              {/* Price and Add button */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 rounded animate-shimmer" />
                <div className="h-10 w-28 rounded-full animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
