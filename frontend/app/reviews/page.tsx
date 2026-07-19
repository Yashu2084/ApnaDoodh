"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, MessageSquare, Plus, Award } from "lucide-react";

interface Review {
  id: string;
  author: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function ReviewSystemPage() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: "REV-001", author: "Rohan Maan", product: "Cow Milk", rating: 5, date: "June 20, 2026", comment: "Extremely high quality A2 milk. The delivery is always on time before 6 AM, and the packaging in chilled glass bottles keeps it fresh.", verified: true },
    { id: "REV-002", author: "Kriti Sen", product: "Paneer", rating: 5, date: "June 19, 2026", comment: "This is the softest paneer I have ever purchased in Gurugram. It has a rich milk taste and melts easily when cooked.", verified: true },
    { id: "REV-003", author: "Animesh Roy", product: "Buffalo Milk", rating: 5, date: "June 18, 2026", comment: "Super thick Murrah buffalo milk. Sourced directly and perfect for making rich yogurt and tea at home.", verified: true },
    { id: "REV-004", author: "Sheetal Garg", product: "Curd", rating: 4, date: "June 15, 2026", comment: "Thick probiotic yogurt, not sour at all. Packaging could be slightly better, but dairy quality is unmatched.", verified: true },
  ]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    product: "Cow Milk",
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.author && newReview.comment) {
      const review: Review = {
        id: `REV-00${reviews.length + 1}`,
        author: newReview.author,
        product: newReview.product,
        rating: newReview.rating,
        date: "June 21, 2026",
        comment: newReview.comment,
        verified: true,
      };

      setIsSuccess(true);
      setTimeout(() => {
        setReviews([review, ...reviews]);
        setNewReview({ author: "", product: "Cow Milk", rating: 5, comment: "" });
        setIsSuccess(false);
        setIsFormOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="relative w-full min-h-[85vh] pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/reviews-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft overlay to ensure high contrast and readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MessageSquare className="h-5 w-5" />
              </span>
              Community Reviews
            </h1>
            <p className="text-sm text-slate-500 mt-1">Read feedback from fellow subscribers or share your experience with our farm products.</p>
          </div>
          <div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Write a Review
            </button>
          </div>
        </div>

        {/* Rating Breakdown Banner */}
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] mb-10">
          
          {/* Main Scorecard */}
          <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[2rem] text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
            <p className="text-5xl font-black text-slate-900 mt-2">4.9</p>
            
            <div className="flex items-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-2">Based on 1,420 verified doorstep reviews</p>
          </div>

          {/* Star Percentages Bar */}
          <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[2rem] flex flex-col justify-center space-y-3.5">
            {[
              { stars: 5, pct: 92 },
              { stars: 4, pct: 6 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-4 text-xs">
                <span className="w-12 font-semibold text-slate-500">{bar.stars} Stars</span>
                <div className="h-2 flex-grow bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${bar.pct}%` }} />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">{bar.pct}%</span>
              </div>
            ))}
          </div>

        </div>

        {/* Reviews List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-50 pb-2">
            Verified Purchases Feed ({reviews.length} reviews)
          </h3>

          <div className="grid gap-4">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition duration-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{rev.author}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reviewed on {rev.date} • {rev.product}</p>
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-blue-700 border border-blue-100 shadow-sm">
                      <Award className="h-3 w-3" /> Verified Buyer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`} />
                  ))}
                </div>

                <p className="text-xs leading-6 text-slate-600 text-justify">{rev.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Submission Modal overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative z-10 w-full max-w-md space-y-4"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">Post a Dairy Review</h3>
                <p className="text-xs text-slate-400 mt-1">Share your quality review about ApnaDoodh drops with the community.</p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="e.g. Kriti Sen"
                    className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Choose Product</label>
                    <select
                      value={newReview.product}
                      onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Cow Milk">Cow Milk</option>
                      <option value="Buffalo Milk">Buffalo Milk</option>
                      <option value="Paneer">Paneer</option>
                      <option value="Curd">Curd</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Your Rating</label>
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starIndex = i + 1;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: starIndex })}
                            onMouseEnter={() => setHoverRating(starIndex)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="cursor-pointer transition transform active:scale-90 bg-transparent border-none p-0"
                          >
                            <Star className={`h-5 w-5 ${
                              starIndex <= (hoverRating || newReview.rating)
                                ? "text-amber-500 fill-amber-500"
                                : "text-slate-200"
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Review Comments</label>
                  <textarea
                    required
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell us what you liked (or disliked) about our dairy drop..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSuccess}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                >
                  {isSuccess ? "Publishing Review..." : "Publish Verified Review"}
                </button>
              </form>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center text-emerald-800 text-xs font-semibold flex flex-col items-center gap-1.5"
                  >
                    <CheckCircle className="h-8 w-8 text-emerald-600 animate-bounce" />
                    <span>Review Published! Adding to live feed...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
