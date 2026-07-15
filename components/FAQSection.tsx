"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does the ApnaDoodh marketplace work?",
    answer: "ApnaDoodh is a direct-to-source dairy marketplace. Local pasture-based farmers list their daily milk, curd, and paneer yields. Customers compare farm stories, testing records, and ratings, and purchase directly from their chosen farmer. We coordinate morning cold-chain logistics to deliver to your doorstep.",
  },
  {
    question: "Does ApnaDoodh sell its own dairy products?",
    answer: "No, ApnaDoodh does not own cattle or sell products. We act as a technology and cold-chain logistics platform that connects local verified dairy farmers and vendors directly with consumers, ensuring fair trade payouts for farmers and fresh dairy for customers.",
  },
  {
    question: "How do you verify the quality of listed vendors?",
    answer: "We mandate strict quality controls. Each partner farm's morning dispatch undergoes 40+ levels of testing (checking fat, solids-not-fat, somatic cell count, water dilution, and antibiotics). Testing values are logged transparently on each farm's store page.",
  },
  {
    question: "Can I order from multiple farmers in a single cart?",
    answer: "Yes! You can select cow milk from one farm and paneer from another. Our system aggregates the items and coordinates collection so that your entire order is delivered to your doorstep in a single morning drop.",
  },
  {
    question: "What are the delivery charges and slots?",
    answer: "Delivery is made before 7:00 AM every morning using insulated cold storage vans to lock in freshness. Shipping fee policies are determined by vendors, though most local sectors feature free delivery policies for direct orders.",
  },
  {
    question: "How does the glass bottle return policy work?",
    answer: "To reduce waste, our farmers package milk in medical-grade glass bottles. Simply wash the empty bottle and place it on your doorstep before the next morning drop. Our runners will collect and return it to the vendor for sterilized heat wash and reuse.",
  },
];

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles client-side to prevent hydration issues
    const generated = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 3, // 3px to 9px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
    }));
    setParticles(generated);
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="faq"
      style={{ clipPath: "inset(0)" }}
      className="relative left-1/2 w-screen -ml-[50vw] min-h-screen overflow-hidden border-t border-slate-100/50 py-24 sm:py-28 lg:py-32 flex flex-col justify-center"
    >
      {/* 1. Animated Scenic Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-30">
        <motion.div
          animate={{
            scale: [1.02, 1.06, 1.02],
            x: [-4, 4, -4],
            y: [2, -2, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "easeInOut",
          }}
          className="fixed inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/bg-faq-custom.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.96) saturate(1.02)",
          }}
        />
      </div>

      {/* 2. Frosted Glass Overlay (Frosted Blue & White layer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-blue-50/80 to-white/75 backdrop-blur-[6px] pointer-events-none -z-20" />

      {/* 3. Base subtle ambient background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/15 to-white/30 pointer-events-none -z-20" />
      
      {/* 2. Flowing glassmorphism blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.12, 0.93, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-300/12 to-sky-200/8 blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-200/12 to-blue-300/8 blur-[130px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 30, -30, 0],
          scale: [0.95, 1.05, 0.95, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-200/8 to-indigo-100/4 blur-[100px] pointer-events-none -z-10"
      />

      {/* 3. Subtle Light Rays radiating from top center */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-1/2 -translate-x-1/2 w-full min-w-[1440px] h-full opacity-40">
          <g opacity="0.8">
            <motion.path 
              d="M720 -50 L100 950 H250 L720 -50 Z" 
              fill="url(#rayGrad)" 
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path 
              d="M720 -50 L450 950 H600 L720 -50 Z" 
              fill="url(#rayGrad)" 
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.path 
              d="M720 -50 L800 950 H950 L720 -50 Z" 
              fill="url(#rayGrad)" 
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.path 
              d="M720 -50 L1150 950 H1300 L720 -50 Z" 
              fill="url(#rayGrad)" 
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </g>
          <defs>
            <linearGradient id="rayGrad" x1="720" y1="-50" x2="720" y2="950" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="0.3" stopColor="#dbeafe" stopOpacity="0.15" />
              <stop offset="0.7" stopColor="#bfdbfe" stopOpacity="0.04" />
              <stop offset="1" stopColor="#eff6ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Elegant Curved Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1000" preserveAspectRatio="none">
        <motion.path
          d="M -100,250 C 350,450 750,150 1600,350"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M -100,250 C 350,450 750,150 1600,350",
              "M -100,300 C 450,400 650,250 1600,300",
              "M -100,250 C 350,450 750,150 1600,350"
            ]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M -100,600 C 450,300 850,800 1600,550"
          fill="none"
          stroke="url(#lineGrad2)"
          strokeWidth="1"
          animate={{
            d: [
              "M -100,600 C 450,300 850,800 1600,550",
              "M -100,550 C 350,400 950,700 1600,600",
              "M -100,600 C 450,300 850,800 1600,550"
            ]
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <defs>
          <linearGradient id="lineGrad1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#356be9" stopOpacity="0" />
            <stop offset="30%" stopColor="#356be9" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="40%" stopColor="#356be9" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5. Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20 pointer-events-none -z-10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ["0px", "-150px", "0px"],
            x: ["0px", "60px", "0px"],
            opacity: [0.15, 0.65, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Got Questions?</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Learn more about how our dairy marketplace platform connects you directly with trusted local farmers.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  suppressHydrationWarning
                  className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="text-base font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/40 p-6 pt-0 text-sm leading-7 text-slate-700 bg-blue-50/20 backdrop-blur-sm">
                        <p className="mt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Ask a Question Form */}
        <div className="mt-20 bg-white/55 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(53,107,233,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="max-w-xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Still have questions?</h3>
              <p className="text-xs text-slate-500 mt-2">Can't find the answer you are looking for? Submit your question below, and our team will get back to you directly on your email!</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-900">Question Submitted Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-5">
                  Thank you, <strong>{name}</strong>. We have logged your question. Once our team reviews it, we will email you at <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setQuestion("");
                  }}
                  className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-500 transition hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Ask another question
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aman Gupta"
                      className="w-full rounded-xl border border-white/60 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-white/60 focus:bg-white/95 transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
                      suppressHydrationWarning
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aman@gmail.com"
                      className="w-full rounded-xl border border-white/60 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-white/60 focus:bg-white/95 transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Your Question</label>
                  <textarea
                    required
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full rounded-xl border border-white/60 py-3 px-4 text-xs outline-none focus:border-blue-500 bg-white/60 focus:bg-white/95 transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
                    suppressHydrationWarning
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    suppressHydrationWarning
                  >
                    {submitting ? "Submitting Question..." : "Submit Question"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
