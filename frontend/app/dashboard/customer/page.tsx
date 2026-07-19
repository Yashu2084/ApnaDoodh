"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Calendar, CreditCard, Clock, MapPin, Play, Pause, ChevronRight, ChevronLeft,
  Settings, Sliders, ShieldCheck, CheckCircle, Plus, Star, Heart, 
  Map, Compass, MessageSquare, ClipboardList, Trash2, ShoppingCart
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import Logo from "@/components/Logo";
import { apiFetch } from "@/lib/api-client";

interface DeliveryItem {
  id: string;
  date: string;
  product: string;
  quantity: string;
  price: number;
  status: "Delivered" | "Scheduled" | "Paused" | "Skipped";
}

interface FarmerInfo {
  id: string;
  name: string;
  location: string;
  rating: number;
  cows: number;
  buffaloes: number;
  highlight: string;
}

export default function CustomerDashboard() {
  const { addToCart } = useCart();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "tracking" | "wishlist" | "reviews" | "farmers" | "profile">("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // State variables
  const [isPaused, setIsPaused] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1430.0);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isTopUpSuccess, setIsTopUpSuccess] = useState(false);

  // Review Form state
  const [reviewFarmer, setReviewFarmer] = useState("Govardhan A2 Dairy");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState([
    { id: "ghee", name: "A2 Desi Cow Ghee", price: 649, unit: "500ml", image: "/apnadoodh_ghee.webp", sellerName: "Govardhan A2 Dairy" },
    { id: "butter", name: "Fresh White Butter", price: 229, unit: "250g", image: "/apnadoodh_butter.webp", sellerName: "Aravali Foothills Dairy" },
  ]);

  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);

  const nearbyFarmers: FarmerInfo[] = [
    { id: "govardhan-pastures", name: "Govardhan A2 Dairy", location: "Sector 62, Gurugram (3.2 km)", rating: 4.9, cows: 35, buffaloes: 0, highlight: "Grass-fed Gir cows, glass bottling" },
    { id: "aravali-pastures", name: "Aravali Foothills Dairy", location: "Sector 71, Gurugram (4.8 km)", rating: 4.9, cows: 20, buffaloes: 10, highlight: "Handmade paneer and white table butter" },
    { id: "murrah-pastures", name: "Murrah Heights Farm", location: "Sohna Road, Gurugram (5.5 km)", rating: 4.7, cows: 0, buffaloes: 25, highlight: "High fat Murrah buffalo milk, daily testing" },
  ];

  // Load dashboard data from APIs
  const loadDashboardData = async () => {
    try {
      // Wallet
      const walletRes = await apiFetch("/api/wallet");
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWalletBalance(walletData.balance);
      }

      // Deliveries
      const deliveriesRes = await apiFetch("/api/deliveries");
      if (deliveriesRes.ok) {
        const delivData = await deliveriesRes.json();
        setDeliveries(delivData.deliveries);
        // If any future delivery is paused, set isPaused to true
        const hasPaused = delivData.deliveries.some((d: any) => d.status === "Paused");
        setIsPaused(hasPaused);
      }

      // Reviews
      const reviewsRes = await apiFetch("/api/reviews");
      if (reviewsRes.ok) {
        const revData = await reviewsRes.json();
        setReviewsList(
          revData.reviews.map((r: any) => ({
            id: r.id,
            farmer: r.farmerName,
            rating: r.rating,
            text: r.text,
            date: r.date,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading customer dashboard data", err);
    }
  };

  // Fetch current authenticated user and load dashboard
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
    loadDashboardData();
  }, []);

  const toggleSubscription = async () => {
    try {
      const targetState = !isPaused;
      const res = await apiFetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaused: targetState }),
      });
      if (res.ok) {
        setIsPaused(targetState);
        // Refresh deliveries
        const deliveriesRes = await apiFetch("/api/deliveries");
        if (deliveriesRes.ok) {
          const delivData = await deliveriesRes.json();
          setDeliveries(delivData.deliveries);
        }
      }
    } catch (err) {
      console.error("Failed to toggle subscription pause status", err);
    }
  };

  const handleSkipDelivery = async (id: string) => {
    try {
      const res = await apiFetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Skipped" }),
      });
      if (res.ok) {
        setDeliveries((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: "Skipped" } : d))
        );
      }
    } catch (err) {
      console.error("Failed to skip delivery drop", err);
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      setIsTopUpSuccess(true);
      try {
        const res = await apiFetch("/api/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amt }),
        });
        if (res.ok) {
          const data = await res.json();
          setTimeout(() => {
            setWalletBalance(data.balance);
            setTopUpAmount("");
            setIsTopUpSuccess(false);
            setIsTopUpOpen(false);
          }, 1500);
        } else {
          setIsTopUpSuccess(false);
        }
      } catch (err) {
        setIsTopUpSuccess(false);
        console.error("Top-up failed", err);
      }
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim()) {
      setIsTopUpSuccess(true); // temporary spinner flag logic or similar
      try {
        const res = await apiFetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerName: reviewFarmer,
            rating: reviewRating,
            text: reviewText,
            product: "A2 Cow Milk"
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setReviewSuccess(true);
          setTimeout(() => {
            setReviewsList([
              {
                id: data.review.id,
                farmer: data.review.farmerName,
                rating: data.review.rating,
                text: data.review.text,
                date: data.review.date,
              },
              ...reviewsList,
            ]);
            setReviewText("");
            setReviewSuccess(false);
          }, 1500);
        }
      } catch (err) {
        console.error("Submit review failed", err);
      }
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="pt-28 pb-12 sm:pt-36 sm:pb-16 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Welcome back, {user ? user.name : "Customer"}!</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your subscriptions, track deliveries, compare local farmers, and post ratings.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSubscription}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer ${
                isPaused
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20"
                  : "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-500/20"
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" /> Resume Morning Drops
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" /> Pause All Drops
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standing Order</p>
            <p className="text-base font-black text-slate-900 mt-2">A2 Cow Milk (1L)</p>
            <p className="text-xs text-blue-600 font-bold mt-1">Govardhan A2 Dairy</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop Status</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isPaused
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-blue-500 animate-pulse"}`} />
                {isPaused ? "Paused" : "Active Drops"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Drops before 7:00 AM</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
              <p className="text-lg font-black text-slate-900 mt-1">₹{walletBalance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="mt-1 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
            >
              <Plus className="h-3 w-3" /> Top up wallet
            </button>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Deliveries</p>
            <p className="text-lg font-black text-slate-900 mt-1">42 Drops Completed</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">42 Litres delivered</p>
          </div>
        </div>

        {/* Dashboard Frame */}
        <div className={`grid gap-8 transition-all duration-300 ${isSidebarCollapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[1.1fr_3fr]"} items-start`}>
          
          {/* Sidebar Menu */}
          <div className={`bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-1 transition-all duration-300 ${
            isSidebarCollapsed ? "md:p-2.5 p-4" : "p-4"
          }`}>
            {/* Sidebar Logo Header */}
            <div className={`flex items-center border-b border-slate-100 pb-4 mb-4 ${
              isSidebarCollapsed ? "justify-center" : "justify-between px-2"
            }`}>
              {!isSidebarCollapsed ? (
                <>
                  <Logo width={100} height={79} />
                  <button 
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="hidden md:flex h-7 w-7 items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="relative group flex justify-center w-full">
                  <Logo compact={true} />
                  <button 
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 hidden md:flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-slate-900 transition hover:scale-105"
                    title="Expand Sidebar"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {[
              { id: "overview", label: "Dashboard", icon: Sliders },
              { id: "orders", label: "My Orders", icon: ClipboardList },
              { id: "tracking", label: "Order Tracking", icon: Clock },
              { id: "wishlist", label: "Wishlist", icon: Heart },
              { id: "reviews", label: "Reviews Console", icon: MessageSquare },
              { id: "farmers", label: "Nearby Farmers", icon: Compass },
              { id: "profile", label: "Profile Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition cursor-pointer ${
                    isSidebarCollapsed ? "md:justify-center md:px-0 md:h-12 w-full" : "w-full"
                  } ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  title={isSidebarCollapsed ? tab.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isSidebarCollapsed && <span>{tab.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Active View Container */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[480px]">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Subscription Overview</h2>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Drops accepting changes until 10:00 PM</span>
                  </div>

                  {isPaused && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-xs">
                      <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Drops are temporarily suspended</p>
                        <p className="mt-0.5 leading-4">Your daily drops are currently paused. Resume drops to start receiving dairy fresh morning dispatches.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Scheduled Drops</h3>
                    <div className="divide-y divide-slate-100">
                      {deliveries.filter(d => d.status === "Scheduled" || d.status === "Paused").map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-xs font-bold">
                              ⏰
                            </span>
                            <div>
                              <p className="text-xs font-black text-slate-800">{item.product}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{item.date} • {item.quantity}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === "Scheduled" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: My Orders */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">My Orders</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Current Active Subscriptions</h3>
                      <div className="border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="space-y-1.5">
                          <span className="bg-blue-100 text-blue-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase"> standing order</span>
                          <p className="text-sm font-black text-slate-800">A2 Cow Milk (1 Litre / Daily)</p>
                          <p className="text-xs text-slate-500">Delivered by: <strong>Govardhan A2 Dairy</strong></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-blue-600">₹99 / Litre</p>
                          <p className="text-[10px] text-slate-400 mt-1">Billed daily from wallet balance</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Previous Purchases</h3>
                      <div className="divide-y divide-slate-100">
                        {deliveries.filter(d => d.status === "Delivered" || d.status === "Skipped").map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                            <div>
                              <p className="text-xs font-black text-slate-800">{item.product}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{item.date} • {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === "Delivered" ? "bg-slate-100 text-slate-600" : "bg-rose-50 text-rose-700"
                              }`}>
                                {item.status}
                              </span>
                              <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Order Tracking */}
              {activeTab === "tracking" && (
                <motion.div
                  key="tracking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Live Delivery Tracking</h2>
                  </div>

                  <div className="border border-slate-200 rounded-3xl p-6 bg-gradient-to-br from-blue-50/20 to-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Drop Time</p>
                        <p className="text-2xl font-black text-blue-600 mt-1">6:15 AM (Morning)</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                        In-Transit
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between text-xs">
                          <span className="font-bold text-slate-500">Collection Complete</span>
                          <span className="font-bold text-slate-500">Out for Delivery</span>
                          <span className="font-bold text-slate-400">Delivered</span>
                        </div>
                        <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100">
                          <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mt-4 text-xs text-slate-500 bg-white border border-slate-100 p-4 rounded-2xl">
                        <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-slate-800">Latest update: Near Sector 56 Hub</p>
                          <p className="mt-1 leading-4">Your cold courier fleet driver is scanning crates at the sector logistics hub. Expected at your doorstep within 30 minutes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Wishlist */}
              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">My Wishlist</h2>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-slate-200 mx-auto" />
                      <p className="text-sm font-bold text-slate-800 mt-4">Your wishlist is empty</p>
                      <p className="text-xs text-slate-400 mt-1">Browse products and save items you plan to buy later.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-slate-200 rounded-3xl p-4 flex gap-4 bg-slate-50/30 hover:shadow-md transition-all duration-300">
                          <div className="relative w-20 h-20 bg-white border border-slate-100 rounded-2xl shrink-0 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-xs font-black text-slate-800 leading-tight">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">Seller: {item.sellerName}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                              <span className="text-xs font-black text-blue-600">₹{item.price} <span className="text-[9px] text-slate-400 font-medium">/ {item.unit}</span></span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    addToCart({
                                      id: item.id,
                                      name: item.name,
                                      price: item.price,
                                      sellerName: item.sellerName,
                                      image: item.image
                                    });
                                  }}
                                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-1.5 transition active:scale-95 cursor-pointer"
                                  aria-label="Add to cart"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Farmer Reviews</h2>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Add Review Form */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Write a Farmer Review</h3>
                      
                      <form onSubmit={handleAddReview} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Select Dairy Farmer</label>
                          <select
                            value={reviewFarmer}
                            onChange={(e) => setReviewFarmer(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                          >
                            <option value="Govardhan A2 Dairy">Govardhan A2 Dairy</option>
                            <option value="Aravali Foothills Dairy">Aravali Foothills Dairy</option>
                            <option value="Murrah Heights Farm">Murrah Heights Farm</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Rating (Stars)</label>
                          <div className="flex gap-1.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star className={`h-6 w-6 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Review Feedback</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience about the milk SNF purity, bottle hygiene, delivery timings..."
                            className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none focus:border-blue-500 bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition cursor-pointer"
                        >
                          Submit Feedback
                        </button>
                      </form>

                      {reviewSuccess && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-xl text-center">
                          Feedback submitted successfully for moderation!
                        </div>
                      )}
                    </div>

                    {/* Submitted Reviews List */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Submitted Reviews</h3>
                      <div className="space-y-3 divide-y divide-slate-100">
                        {reviewsList.map((rev) => (
                          <div key={rev.id} className="pt-3 first:pt-0">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-black text-slate-800">{rev.farmer}</p>
                              <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 my-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                            <p className="text-xs leading-5 text-slate-500 text-justify">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 6: Nearby Farmers */}
              {activeTab === "farmers" && (
                <motion.div
                  key="farmers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Nearby Dairy Vendors</h2>
                  </div>

                  <div className="grid gap-4">
                    {nearbyFarmers.map((farm) => (
                      <div key={farm.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all duration-300">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-800">{farm.name}</p>
                            <div className="flex items-center gap-0.5 bg-white border px-1.5 py-0.5 rounded-full text-[9px] font-bold text-slate-700">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              {farm.rating}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {farm.location}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed pt-1">{farm.highlight} • Herd size: {farm.cows || farm.buffaloes} heads.</p>
                        </div>
                        <a
                          href={`/farmer/store?farmId=${farm.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition active:scale-95 cursor-pointer shrink-0"
                        >
                          View Store
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 7: Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Profile Settings</h2>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Details</h3>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{user ? user.name : "Rahul Verma"}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{user ? user.email : "customer@apnadoodh.com"}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                        <p className="text-xs font-black text-slate-800 mt-0.5">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Delivery Address</h3>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
                        <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-700">Home Address</p>
                          <p className="text-xs text-slate-500 leading-4">Flat 402, Block C, Maple Heights, Sector 56, Gurugram, Haryana - 122011</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Payment Methods</h3>
                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50/30 max-w-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💳</span>
                        <div>
                          <p className="text-xs font-black text-slate-800">HDFC Card **** 8743</p>
                          <p className="text-[9px] text-slate-400">Expires 09/2029</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Primary</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Wallet Top Up Modal */}
      <AnimatePresence>
        {isTopUpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTopUpOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-sm space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">Top-up Wallet</h3>
                <p className="text-xs text-slate-400 mt-1">Add funds instantly to your ApnaDoodh delivery account.</p>
              </div>

              <form onSubmit={handleTopUpSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Enter Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  {[500, 1000, 2000].map((quickAmt) => (
                    <button
                      key={quickAmt}
                      type="button"
                      onClick={() => setTopUpAmount(quickAmt.toString())}
                      className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-500 transition cursor-pointer"
                    >
                      +₹{quickAmt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isTopUpSuccess}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isTopUpSuccess ? "Processing..." : "Pay via UPI / Card"}
                </button>
              </form>

              <AnimatePresence>
                {isTopUpSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center text-emerald-800 text-xs font-semibold flex flex-col items-center gap-1.5"
                  >
                    <CheckCircle className="h-7 w-7 text-emerald-600 animate-bounce" />
                    <span>Transaction Successful! Wallet updated.</span>
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
