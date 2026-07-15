"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { Trash2, ShoppingBag, X, Plus, Minus, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Cart Items, 2: Shipping & Payment Form, 3: Success Screen
  
  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingData.name && shippingData.phone && shippingData.address) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
      }, 1500);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset step after anim closes
    setTimeout(() => {
      if (step === 3) {
        clearCart();
        setStep(1);
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="h-5.5 w-5.5 text-blue-600" />
                  {step === 3 ? "Order Confirmed" : "Your Shopping Cart"}
                </h2>
                <button
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto py-4">
                <AnimatePresence mode="wait">
                  
                  {/* Step 1: Cart Items List */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 h-full"
                    >
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                          <ShoppingBag className="h-16 w-16 text-slate-200" />
                          <h3 className="text-base font-bold text-slate-700 mt-4">Your cart is empty</h3>
                          <p className="text-xs text-slate-400 mt-1">Browse products from local dairy farmers to add them here.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Seller: {item.sellerName}</p>
                                  <p className="text-xs font-extrabold text-blue-600 mt-1">₹{item.price}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {/* Qty Control */}
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-1 hover:bg-slate-50 transition cursor-pointer text-slate-500"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 hover:bg-slate-50 transition cursor-pointer text-slate-500"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                {/* Trash button */}
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Shipping Form */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Checkout Details</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Enter delivery details to complete your order from local sellers.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Recipient Name</label>
                          <input
                            type="text"
                            required
                            suppressHydrationWarning
                            value={shippingData.name}
                            onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                            placeholder="John Doe"
                            className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                          <input
                            type="tel"
                            required
                            suppressHydrationWarning
                            value={shippingData.phone}
                            onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Delivery Address</label>
                          <textarea
                            required
                            rows={3}
                            suppressHydrationWarning
                            value={shippingData.address}
                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                            placeholder="Flat / House number, Society name, Area, Gurugram"
                            className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Payment Option</label>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            {["Cash on Delivery", "UPI Payment"].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setShippingData({ ...shippingData, paymentMethod: method })}
                                className={`py-2 rounded-xl text-center border text-xs font-semibold transition cursor-pointer ${
                                  shippingData.paymentMethod === method
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Step 3: Success Screen */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                        <CheckCircle className="h-9 w-9 animate-bounce" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 font-inter">Order Placed Successfully!</h3>
                      <p className="text-xs text-slate-500 leading-5 max-w-xs mx-auto">
                        Thank you, <strong>{shippingData.name}</strong>. Your marketplace order has been forwarded to the respective dairy vendors for processing.
                      </p>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left text-[11px] text-slate-600 space-y-1 max-w-xs mx-auto leading-4">
                        <p><strong>Deliver Address:</strong> {shippingData.address}</p>
                        <p><strong>Payment:</strong> {shippingData.paymentMethod}</p>
                        <p><strong>Est. Morning Drop:</strong> Tomorrow before 7:00 AM</p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={cartItems.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="rounded-full border border-slate-200 px-5 py-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !shippingData.name || !shippingData.phone || !shippingData.address}
                      className="flex-grow inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      {isSubmitting ? "Processing..." : `Place Order (Total: ₹${cartTotal})`}
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <button
                    onClick={handleClose}
                    className="w-full rounded-full bg-slate-950 py-3.5 text-xs font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer"
                  >
                    Close & Keep Shopping
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
