"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";

interface BrandProps {
  width?: number;
  height?: number;
  className?: string;
  logoClassName?: string;
  compact?: boolean;
  priority?: boolean;
}

export default function Brand({
  width = 130,
  height = 103,
  className = "",
  logoClassName = "",
  compact = false,
  priority = false,
}: BrandProps) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center select-none transition-transform duration-200 active:scale-[0.98] cursor-pointer ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center justify-center"
      >
        <Logo 
          width={width} 
          height={height} 
          className={logoClassName} 
          compact={compact} 
          priority={priority} 
        />
      </motion.div>
    </Link>
  );
}
