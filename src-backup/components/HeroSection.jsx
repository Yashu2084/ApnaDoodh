import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function HeroSection() {
  return (
    <section id="home" className="pt-14 pb-20 sm:pt-20 sm:pb-24">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-200/80">
            Fresh farm delivery in 30+ neighborhoods
          </div>

          <div className="space-y-6">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Fresh Milk Delivered Every Morning
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              DailyDoodh brings premium, cold-chain dairy straight from our pasture to your kitchen. Choose flexible plans for pure cow milk, buffalo milk, paneer, and curd.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500"
            >
              Subscribe Now
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              View Products
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xl shadow-slate-100/80 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-100/70">
              <p className="text-sm font-semibold text-slate-500">Start your plan</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Daily drops at your door</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-100/70">
              <p className="text-sm font-semibold text-slate-500">Farm-fresh quality</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Certified organic and chilled</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-[0_30px_80px_rgba(16,24,40,0.08)] sm:p-8">
            <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-emerald-100/70 blur-3xl" />
            <div className="absolute -bottom-10 right-8 h-28 w-28 rounded-full bg-slate-200/70 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80"
              alt="Fresh milk bottles with dairy products"
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl shadow-slate-200/60"
            />
          </div>
          <div className="mt-6 rounded-3xl bg-white/90 p-6 shadow-xl shadow-slate-100/80">
            <div className="flex items-center justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Fresh pick</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">Premium Dairy Bundle</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                From ₹249 / delivery
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
