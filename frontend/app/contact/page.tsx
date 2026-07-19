"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 flex items-center justify-center min-h-[calc(100vh-80px)] scroll-mt-24">
      {/* Animated Scenic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.02, 1.06, 1.02],
            x: [-3, 3, -3],
            y: [2, -2, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 28,
            ease: "easeInOut",
          }}
          className="absolute -inset-4"
          style={{
            backgroundImage: "url('/bg-pasture-1.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft color-graded premium overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/45" />
        <div className="absolute inset-0 bg-sky-900/5 backdrop-brightness-[0.97]" />
        
        {/* Subtle glow layers */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-300/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight sm:text-5xl drop-shadow-sm">
            Contact ApnaDoodh
          </h1>
          <p className="mt-3.5 text-slate-700 max-w-xl mx-auto font-semibold drop-shadow-sm">
            Have questions about our milk delivery, testing reports, or billing? Reach out and we&rsquo;ll get back to you promptly.
          </p>
        </div>

        {/* Premium layered glassmorphism container */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/60 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
            {/* Contact Details */}
            <div className="space-y-6 bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Get in Touch</h2>
              <p className="text-sm text-slate-500 leading-6">
                Our subscriber support desk is available daily from 6:00 AM to 8:00 PM for pausing orders or scheduling updates.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/40">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Call / WhatsApp</p>
                    <p className="text-sm font-semibold text-slate-800">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/40">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-slate-800">support@apnadoodh.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/40">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Main Farm Office</p>
                    <p className="text-sm font-semibold text-slate-800">Sohna Road, Gurugram, Haryana, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you'd like to ask..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
                  >
                    <CheckCircle className="h-16 w-16 text-blue-600 animate-bounce" />
                    <h3 className="text-2xl font-bold text-slate-900 mt-4">Message Sent!</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">
                      Thank you. We have received your query, and a support representative will reach out shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
