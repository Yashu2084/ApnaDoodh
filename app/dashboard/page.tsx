"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoleAndRedirect() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.user) {
          const role = data.user.role;
          if (role === "SUPER_ADMIN") {
            router.replace("/dashboard/admin");
          } else if (role === "FARMER") {
            router.replace("/dashboard/farmer");
          } else {
            router.replace("/dashboard/customer");
          }
        } else {
          router.replace("/login");
        }
      } catch (e) {
        console.error(e);
        router.replace("/login");
      }
    }
    checkRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Logo width={180} height={142} />
      </motion.div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Your Portal...</p>
    </div>
  );
}
