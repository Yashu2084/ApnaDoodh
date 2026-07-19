"use client";

import Link from "next/link";
import FarmerSection from "@/components/FarmerSection";
import { Tractor, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FarmersDirectoryPage() {
  return (
    <div className="pt-28 pb-12 sm:pt-36 sm:pb-16">
      <div className="text-center max-w-2xl mx-auto mb-6 px-4">
        <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Our Heritage Farms</h1>
        <p className="mt-3 text-slate-500">
          Learn about our certified pasture partners, local cow breeds, Murrah buffalo herds, and strict quality testing.
        </p>

        {/* Call to action for new farmers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 inline-flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3 text-left max-w-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Tractor className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold text-blue-800">Are you a dairy farmer?</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Partner with us for daily morning cold-chain logistics.</p>
            <Link
              href="/farmer/register"
              className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline mt-1.5 cursor-pointer bg-transparent border-none p-0"
            >
              Register your farm now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      <FarmerSection />
    </div>
  );
}
