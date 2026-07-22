"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}

export default function Logo({
  width = 120,
  height = 95,
  className = "",
  priority = false,
  compact = false,
}: LogoProps) {
  if (compact) {
    return (
      <div 
        className={`relative overflow-hidden rounded-full border border-slate-200/60 bg-white flex items-center justify-center shadow-sm shrink-0 ${className}`} 
        style={{ width: 44, height: 44 }}
      >
        <div className="relative" style={{ width: 38, height: 30 }}>
          <Image
            src="/assets/logo/logo.webp"
            alt="ApnaDoodh Logo"
            fill
            priority={priority}
            sizes="38px"
            className="object-contain select-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative shrink-0 select-none flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <Image
        src="/assets/logo/logo.webp"
        alt="ApnaDoodh Logo"
        fill
        priority={priority}
        sizes={`${width}px`}
        className="object-contain"
      />
    </div>
  );
}
