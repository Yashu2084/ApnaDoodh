"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tractor, ArrowRight, ArrowLeft, CheckCircle, Upload, ClipboardCheck, Sparkles } from "lucide-react";

export default function FarmerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    farmName: "",
    cowsCount: "",
    buffaloesCount: "",
    pastureType: "Open Grassland",
    dailyCapacity: "",
    bankAccount: "",
    ifscCode: "",
    qualityAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && formData.qualityAgreed) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsCompleted(true);
      }, 2000);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-xl px-4">
        
        {/* Registration Header */}
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm shadow-blue-200/80 mb-4">
            <Tractor className="h-6 w-6" />
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Onboard Your Farm</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Partner with ApnaDoodh. Get paid daily based on milk fat and purity scores with free logistics.
          </p>
        </div>

        {/* Step Progress Bar */}
        {!isCompleted && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Step {step} of 3</span>
              <span>{step === 1 ? "Owner Details" : step === 2 ? "Farm Capacity" : "Quality Rules"}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: "33%" }}
                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Form Wrap */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                  <CheckCircle className="h-8 w-8 animate-bounce" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Application Submitted!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-6">
                  Thank you, <strong>{formData.name}</strong>. The ApnaDoodh Quality Audit Team will visit <strong>{formData.farmName}</strong> within 48 hours to complete soil and herd testing.
                </p>
                <div className="pt-6">
                  <Link
                    href="/farmer/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer"
                  >
                    Explore Farmer Portal
                    <Sparkles className="h-4 w-4 text-blue-400" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Owner Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Owner Information</h2>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ram Singh Yadav"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        suppressHydrationWarning
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Email (Optional)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ram@singhfarm.com"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Farm Location & Address</label>
                      <textarea
                        required
                        rows={2}
                        value={formData.farmName}
                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                        placeholder="e.g. Govardhan Pastures, Sohna Road, Gurugram"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                        suppressHydrationWarning
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Farm Profile */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Herd & Capacity Details</h2>
                    <div className="grid gap-4 grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Gir/Sahiwal Cows</label>
                        <input
                          type="number"
                          required
                          value={formData.cowsCount}
                          onChange={(e) => setFormData({ ...formData, cowsCount: e.target.value })}
                          placeholder="e.g. 45"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Murrah Buffaloes</label>
                        <input
                          type="number"
                          required
                          value={formData.buffaloesCount}
                          onChange={(e) => setFormData({ ...formData, buffaloesCount: e.target.value })}
                          placeholder="e.g. 15"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Grazing & Pasture System</label>
                      <select
                        value={formData.pastureType}
                        onChange={(e) => setFormData({ ...formData, pastureType: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                        suppressHydrationWarning
                      >
                        <option value="Open Grassland">Open Grassland Grazing (100% grass-diet)</option>
                        <option value="Mixed Feed">Mixed Feed (Silage + dry fodder)</option>
                        <option value="Organic Concentrate">Organic concentrate feed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Est. Daily Milk Supply (Litres)</label>
                      <input
                        type="number"
                        required
                        value={formData.dailyCapacity}
                        onChange={(e) => setFormData({ ...formData, dailyCapacity: e.target.value })}
                        placeholder="e.g. 300"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                        suppressHydrationWarning
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Quality Compliance */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Payouts & Auditing</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Bank Account Number</label>
                        <input
                          type="password"
                          required
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                          placeholder="e.g. 10042898910"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">IFSC Code</label>
                        <input
                          type="text"
                          required
                          value={formData.ifscCode}
                          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                          placeholder="e.g. SBIN0001234"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <ClipboardCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">ApnaDoodh Standards Agreement</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-4">
                            By checking the box below, you agree to allow ApnaDoodh Hub Managers to carry out daily fat testing, somatic cell audits, and cold storage temperature inspections.
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          required
                          checked={formData.qualityAgreed}
                          onChange={(e) => setFormData({ ...formData, qualityAgreed: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          suppressHydrationWarning
                        />
                        <span className="text-[11px] font-bold text-slate-700">I agree to the quality testing guidelines</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer bg-transparent border-none p-0"
                      suppressHydrationWarning
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer"
                      suppressHydrationWarning
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.qualityAgreed}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      suppressHydrationWarning
                    >
                      {isSubmitting ? "Submitting..." : "Submit Registration"} <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

              </form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
