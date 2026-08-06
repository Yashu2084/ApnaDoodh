"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, MapPin, ChevronDown } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useLocation } from "@/components/LocationProvider";
import Brand from "@/components/Brand";
import { apiFetch } from "@/lib/api-client";
import { PREMIUM_EASE } from "@/lib/animations";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Live Order Tracking", href: "/order-tracking" },
  { label: "Reviews", href: "/reviews" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { currentLocation, openLocationModal } = useLocation();

  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll handler for navbar shrink and glass transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch current user session details
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await apiFetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: PREMIUM_EASE }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]"
          : "bg-white/40 backdrop-blur-md border-b border-white/20 shadow-[0_4px_20px_0_rgba(31,38,135,0.02)]"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between px-6 transition-all duration-300 sm:px-12 lg:px-16 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        {/* Brand Logo & Location Selector */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Brand width={60} height={48} priority={true} />
          
          {/* Location Selector */}
          <motion.button
            onClick={openLocationModal}
            suppressHydrationWarning
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-1.5 rounded-xl border border-white/50 bg-white/45 py-1 px-2 sm:py-1.5 sm:px-3 shadow-xs backdrop-blur-md transition-all hover:border-blue-300 hover:bg-white/60 hover:shadow-[0_4px_16px_rgba(53,107,233,0.08)] cursor-pointer text-left"
          >
            <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
            <div className="hidden sm:block">
              <p className="text-[9px] font-medium leading-none text-slate-500 uppercase tracking-wider">Deliver to</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800 flex items-center gap-0.5">
                {currentLocation}
                <ChevronDown className="h-3 w-3 text-blue-600" />
              </p>
            </div>
            <div className="sm:hidden">
              <p className="text-[10px] font-bold text-slate-800 flex items-center gap-0.5">
                {currentLocation.split(",")[0]}
                <ChevronDown className="h-3 w-3 text-blue-600" />
              </p>
            </div>
          </motion.button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 rounded-xl ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-blue-50/60 border border-blue-100/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}

          {/* Desktop Auth Controls */}
          {!checkingAuth && (
            <div className="flex items-center gap-4 border-l border-slate-200/50 pl-4 ml-2">
              {user ? (
                <>
                  <Link
                    href={
                      user.role === "SUPER_ADMIN"
                        ? "/dashboard/admin"
                        : user.role === "FARMER"
                        ? "/dashboard/farmer"
                        : "/dashboard/customer"
                    }
                    className="inline-flex items-center justify-center border border-blue-200/80 bg-blue-50/10 text-blue-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors duration-250 py-2 px-3 rounded-lg hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    <Link
                      href="/signup"
                      className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer block"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Shopping Cart & Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setIsCartOpen(true)}
            suppressHydrationWarning
            whileHover={{ scale: 1.05, y: -0.5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/45 text-slate-600 shadow-xs backdrop-blur-md transition-all hover:border-blue-450 hover:bg-white/60 hover:text-blue-600 hover:shadow-[0_4px_16px_rgba(53,107,233,0.08)] cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow shadow-rose-600/35"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Auth Button */}
          <div className="md:hidden flex items-center">
            {!checkingAuth && (
              <>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-150 bg-rose-50 text-rose-600 hover:bg-rose-100 transition active:scale-95 cursor-pointer text-xs font-bold"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex h-10 px-4 items-center justify-center rounded-xl border border-slate-150 bg-blue-50 text-blue-600 hover:bg-blue-100 transition active:scale-95 cursor-pointer text-xs font-bold"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/45 text-slate-600 shadow-xs hover:border-blue-300 hover:text-blue-600 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-white/30 bg-white/65 backdrop-blur-xl px-6 py-4 space-y-2 shadow-lg"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-cream-200/50 text-blue-600 shadow-xs border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-cream-100 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!checkingAuth && (
              <div className="pt-4 border-t border-slate-100/50 space-y-2.5">
                {user ? (
                  <>
                    <Link
                      href={
                        user.role === "SUPER_ADMIN"
                          ? "/dashboard/admin"
                          : user.role === "FARMER"
                          ? "/dashboard/farmer"
                          : "/dashboard/customer"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-rose-50 text-rose-600 text-xs font-bold active:scale-95 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 text-xs font-bold active:scale-95 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
