"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Brand from "@/components/Brand";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    products: [
      { name: "A2 Cow Milk", href: "/dairy-ranges#cow-milk" },
      { name: "Creamy Buffalo Milk", href: "/dairy-ranges#buffalo-milk" },
      { name: "Organic Paneer", href: "/dairy-ranges#paneer" },
      { name: "Probiotic Curd", href: "/dairy-ranges#curd" },
    ],
    company: [
      { name: "About Our Farm Initiatives", href: "/about" },
      { name: "Safety & Quality Verification", href: "/about" },
      { name: "Organic Practices", href: "/about" },
      { name: "Our Vetted Farmers", href: "/farmers" },
    ],
    support: [
      { name: "FAQs & Help Center", href: "/#faq" },
      { name: "Become a Seller", href: "/farmer/register" },
      { name: "Live Order Tracking", href: "/order-tracking" },
      { name: "Contact Platform Support", href: "/contact" },
    ],
  };

  return (
    <footer 
      id="contact" 
      className="relative overflow-hidden border-t border-white/10 pt-20 pb-12 w-full"
      style={{
        backgroundImage: "url('/assets/footer-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Premium Luxury Blue Dairy Glow Overlays */}
      <div className="absolute inset-0 bg-slate-950/30 mix-blend-multiply pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-900/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -left-12 bottom-12 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute right-12 top-12 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Highlights */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/20 shadow-inner">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </span>
            <div>
              <p className="font-semibold text-white">Cold Chain Courier</p>
              <p className="text-xs text-blue-100/80">Milking to doorstep drops under 12 hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/20 shadow-inner">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </span>
            <div>
              <p className="font-semibold text-white">40+ Lab Audits Daily</p>
              <p className="text-xs text-blue-100/80">Purity tested fat/solids verified</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/20 shadow-inner">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <div>
              <p className="font-semibold text-white">Direct From Source</p>
              <p className="text-xs text-blue-100/80">Vetted local family-owned farms</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.8fr] lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Brand width={120} height={95} />
            <p className="text-sm leading-7 text-white/80">
              ApnaDoodh is Gurugram's largest direct dairy marketplace. Browse verified local farmers near you, compare raw testing logs, and purchase dairy directly from the source.
            </p>
          </div>

          {/* Column 1: Products */}
          <div>
            <p className="text-sm font-bold tracking-wider uppercase text-white">Dairy Ranges</p>
            <ul className="mt-6 space-y-4">
              {footerLinks.products.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <p className="text-sm font-bold tracking-wider uppercase text-white">Platform</p>
            <ul className="mt-6 space-y-4">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <p className="text-sm font-bold tracking-wider uppercase text-white">Support</p>
            <ul className="mt-6 space-y-4">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-white/70 transition hover:translate-x-1 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold tracking-wider uppercase text-white">Marketplace Updates</p>
              <p className="mt-3 text-xs leading-5 text-white/80">
                Join our newsletter to receive farm updates, lab purity audit warnings, and seasonal dairy discounts.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    placeholder="hello@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/95 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                >
                  Join
                </button>
              </div>
              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-300"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Email registered successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-sm text-white/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <p>© 2026 ApnaDoodh Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span>
                +91-9650762113</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <span>support@apnadoodh.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-6">
            <p className="hidden md:block text-white/70">Dairy Marketplace connecting you directly to vetted local farmers.</p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition hover:bg-white/20 hover:border-white/40 backdrop-blur-md cursor-pointer"
              aria-label="Back to top"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
}
