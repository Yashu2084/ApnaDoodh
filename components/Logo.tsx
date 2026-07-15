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
  width = 130,
  height = 103,
  className = "",
  priority = false,
  compact = false,
}: LogoProps) {
  if (compact) {
    // Compact version showing the centered circular emblem from the logo
    return (
      <div 
        className={`relative overflow-hidden rounded-full border border-slate-200/60 bg-white flex items-center justify-center shadow-sm shrink-0 ${className}`} 
        style={{ width: 44, height: 44 }}
      >
        <Image
          src="/assets/logo/logo.webp"
          alt="DailyDoodh"
          width={38}
          height={38}
          priority={priority}
          className="object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 select-none flex items-center justify-center ${className}`}>
      <Image
        src="/assets/logo/logo.webp"
        alt="DailyDoodh Logo"
        width={width}
        height={height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
