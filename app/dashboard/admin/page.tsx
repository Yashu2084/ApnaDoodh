"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, Users, ShieldAlert, CheckCircle, XCircle, TrendingUp,
  Settings, IndianRupee, ShoppingBag, MessageSquare, ShieldCheck, 
  MapPin, Star, AlertTriangle, RefreshCw, Save,
  ChevronLeft, ChevronRight, Clock
} from "lucide-react";
import Logo from "@/components/Logo";

interface FarmerInfo {
  id: string;
  name: string;
  email: string;
  herdSize: string;
  kycStatus: "Pending" | "Verified" | "Suspended";
  joinedDate: string;
  location: string;
}

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  status: "Active" | "Blocked";
  joinedDate: string;
}

interface ModeratedProduct {
  id: string;
  name: string;
  sellerName: string;
  price: number;
  image: string;
  status: "Active" | "Flagged";
}

interface ModeratedReview {
  id: string;
  customerName: string;
  farmerName: string;
  rating: number;
  text: string;
  status: "Approved" | "Flagged" | "Removed";
  date: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "farmers" | "customers" | "products" | "reviews" | "settings">("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch Session User
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, []);

  // State: Farmer Management
  const [farmers, setFarmers] = useState<FarmerInfo[]>([]);

  // State: Customer Management
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);

  // State: Product Moderation
  const [products, setProducts] = useState<ModeratedProduct[]>([]);

  // State: Reviews Moderation
  const [reviews, setReviews] = useState<ModeratedReview[]>([]);

  // State: KYC Viewer Board Modal (Part 6.1)
  const [selectedFarmerForKyc, setSelectedFarmerForKyc] = useState<any>(null);
  const [isKycViewerOpen, setIsKycViewerOpen] = useState(false);

  // State: Unified User Directory Filters (Part 6.2)
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"ALL" | "CUSTOMER" | "FARMER">("ALL");

  // Platform Configurations
  const [commissionRate, setCommissionRate] = useState(10); // 10%
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(15); // ₹15
  const [payoutCycle, setPayoutCycle] = useState("Weekly");
  const [kycRequired, setKycRequired] = useState(true);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  // Load Admin dashboard data from APIs
  const loadAdminData = async () => {
    try {
      // Platform settings
      const settingsRes = await fetch("/api/admin/settings");
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setCommissionRate(sData.settings.commissionRate);
        setBaseDeliveryFee(sData.settings.baseDeliveryFee);
        setPayoutCycle(sData.settings.payoutCycle);
        setKycRequired(sData.settings.kycRequired);
      }

      // 1. Fetch Farmers directly via designed endpoint (Part 5.4.1)
      const farmersRes = await fetch("/api/admin/farmers");
      if (farmersRes.ok) {
        const fData = await farmersRes.json();
        setFarmers(fData.farmers.map((f: any) => ({
          id: f.id,
          name: f.name,
          email: f.email,
          herdSize: f.herdSize || "35 Cows",
          kycStatus: f.kycStatus,
          kycGovIdUrl: f.kycGovIdUrl,
          kycFssaiUrl: f.kycFssaiUrl,
          joinedDate: f.joinedDate || "June 2026",
          location: f.storeAddress || f.location || "Sohna Road, Gurugram"
        })));
      }

      // 2. Fetch Customers, Products, Reviews from actions endpoint
      const actionsRes = await fetch("/api/admin/actions");
      if (actionsRes.ok) {
        const aData = await actionsRes.json();

        setCustomers(aData.customers.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          ordersCount: c.ordersCount || 42,
          status: c.status || "Active",
          joinedDate: c.joinedDate || "June 2026"
        })));

        setProducts(aData.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          sellerName: p.sellerName || "Govardhan A2 Dairy",
          price: p.price,
          image: p.image,
          status: p.status
        })));

        setReviews(aData.reviews.map((r: any) => ({
          id: r.id,
          customerName: r.customerName,
          farmerName: r.farmerName,
          rating: r.rating,
          text: r.text,
          status: r.status,
          date: r.date
        })));
      }
    } catch (err) {
      console.error("Failed to load admin audit dashboard lists", err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handlers for Farmers Approval / Suspension (Part 5.4.2)
  const handleApproveKYC = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/farmers/${id}/kyc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycStatus: "Verified" }),
      });
      if (res.ok) {
        setFarmers(prev => prev.map(f => f.id === id ? { ...f, kycStatus: "Verified" } : f));
      }
    } catch (e) {
      console.error("KYC verification update failed", e);
    }
  };

  const handleToggleSuspendFarmer = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Suspended" ? "Verified" : "Suspended";
    try {
      const res = await fetch(`/api/admin/farmers/${id}/kyc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycStatus: nextStatus }),
      });
      if (res.ok) {
        setFarmers(prev => prev.map(f => f.id === id ? { ...f, kycStatus: nextStatus } : f));
      }
    } catch (e) {
      console.error("KYC suspension update failed", e);
    }
  };

  // Handlers for Customers Blocking
  const handleToggleBlockCustomer = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CUSTOMER_STATUS", targetId: id, status: nextStatus }),
      });
      if (res.ok) {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
      }
    } catch (e) {
      console.error("Customer status update failed", e);
    }
  };

  // Handlers for Product Moderation (Part 5.4.3)
  const handleToggleProductFlag = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Flagged" ? "Active" : "Flagged";
    try {
      const res = await fetch(`/api/admin/products/${id}/flag`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
      }
    } catch (e) {
      console.error("Product flag state update failed", e);
    }
  };

  // Handlers for Review Moderation (Part 5.4.4)
  const handleReviewAction = async (id: string, action: "Approved" | "Removed") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
      }
    } catch (e) {
      console.error("Review moderation action update failed", e);
    }
  };

  // Handler for Platform Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionRate,
          baseDeliveryFee,
          payoutCycle,
          kycRequired
        }),
      });
      if (res.ok) {
        setIsSettingsSaved(true);
        setTimeout(() => {
          setIsSettingsSaved(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Settings update failed", err);
    }
  };

  // Computed Overview Variables
  const pendingApprovalsCount = farmers.filter(f => f.kycStatus === "Pending").length;
  const flaggedProductsCount = products.filter(p => p.status === "Flagged").length;
  const flaggedReviewsCount = reviews.filter(r => r.status === "Flagged").length;
  const activeCustomersCount = customers.filter(c => c.status === "Active").length;

  const totalSalesVolume = 1248500; // Mock total sales
  const platformEarnings = (totalSalesVolume * (commissionRate / 100));

  // Analytics graph mock calculations
  const platformRevenueTrend = [
    { month: "Jan", sales: 84000 },
    { month: "Feb", sales: 98000 },
    { month: "Mar", sales: 112000 },
    { month: "Apr", sales: 125000 },
    { month: "May", sales: 138000 },
    { month: "Jun", sales: 145000 },
  ];
  const maxSales = Math.max(...platformRevenueTrend.map(p => p.sales));

  return (
    <div className="pt-24 pb-8 sm:pt-28 sm:pb-12 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Executive Platform Console</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit KYC vendor registrations, moderate community catalog feeds, oversee transactions, and update system fees.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-bold shadow-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              Super Admin Level
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Earnings</p>
            <p className="text-xl font-black text-slate-900 mt-2">₹{platformEarnings.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">Based on {commissionRate}% commission cut</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Farmer Audits</p>
            <p className="text-xl font-black text-slate-900 mt-2">{pendingApprovalsCount} Pending</p>
            <p className="text-[10px] text-amber-600 font-bold mt-1">Requires immediate document review</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Members</p>
            <p className="text-xl font-black text-slate-900 mt-2">{activeCustomersCount} Active</p>
            <p className="text-[10px] text-indigo-600 font-bold mt-1">{farmers.length} dairy farmer accounts</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Alerts</p>
            <p className="text-xl font-black text-slate-900 mt-2">{flaggedProductsCount + flaggedReviewsCount} Flags</p>
            <p className="text-[10px] text-rose-600 font-bold mt-1">Flagged listings & reviews</p>
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
              { id: "overview", label: "Overview Console", icon: Sliders },
              { id: "analytics", label: "Revenue Analytics", icon: TrendingUp },
              { id: "farmers", label: "Farmer Verification", icon: ShieldAlert },
              { id: "customers", label: "User Directory", icon: Users },
              { id: "products", label: "Product Moderation", icon: ShoppingBag },
              { id: "reviews", label: "Review Moderation", icon: MessageSquare },
              { id: "settings", label: "Platform Settings", icon: Settings },
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
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
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
              
              {/* Tab 1: Overview Console */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Platform Performance Summary</h2>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Realtime System Sync</span>
                  </div>

                  {pendingApprovalsCount > 0 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-xs">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold">Pending KYC Approvals</p>
                        <p className="mt-0.5 leading-4">There are {pendingApprovalsCount} new dairy farmer profiles waiting for documents check. Approve their profiles in the Farmer tab to allow their store listings to go live.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Action Logs */}
                    <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Logs</h3>
                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="py-2.5 first:pt-0">
                          <p className="font-bold text-slate-800">Govardhan A2 Dairy updated inventory</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Today • 15:45</p>
                        </div>
                        <div className="py-2.5">
                          <p className="font-bold text-slate-800">Customer signup: deepak@gmail.com</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Today • 12:12</p>
                        </div>
                        <div className="py-2.5 last:pb-0">
                          <p className="font-bold text-slate-800">Payout batch #9041 released</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Yesterday • 18:00</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Purity Stats */}
                    <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Purity Scans</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Average milk fat purity</span>
                            <span>98.4%</span>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-100">
                            <div style={{ width: "98%" }} className="bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Target delivery schedule index</span>
                            <span>96.8%</span>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-100">
                            <div style={{ width: "96%" }} className="bg-blue-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Analytics */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Platform Financial Analytics</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value (GMV)</p>
                      <p className="text-2xl font-black text-slate-950 mt-1">₹12,48,500</p>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 block">Total platform sales volume</span>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Commission Earnings</p>
                      <p className="text-2xl font-black text-emerald-600 mt-1">₹{platformEarnings.toLocaleString()}</p>
                      <span className="text-[9px] font-bold text-emerald-600 mt-1 block">Net revenue retained</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Platform Volume (₹)</h3>
                      <span className="text-[10px] text-slate-400 font-bold">Jan - Jun 2026</span>
                    </div>

                    <div className="h-48 w-full flex items-end justify-between pt-6 px-4">
                      {platformRevenueTrend.map((item, idx) => {
                        const barHeight = (item.sales / maxSales) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <span className="text-[9px] font-bold text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">₹{item.sales.toLocaleString()}</span>
                            <div 
                              style={{ height: `${barHeight - 20}%` }} 
                              className="w-8 sm:w-12 bg-slate-950 hover:bg-emerald-600 rounded-t-lg transition-all duration-300 shadow-sm cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-slate-400 mt-1">{item.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Farmer Verification */}
              {activeTab === "farmers" && (
                <motion.div
                  key="farmers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Farmer Verification Panel</h2>
                  </div>

                  <div className="space-y-4">
                    {farmers.map((farmer) => (
                      <div key={farmer.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{farmer.name}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              farmer.kycStatus === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              farmer.kycStatus === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {farmer.kycStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{farmer.email} • {farmer.herdSize}</p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {farmer.location}
                          </p>
                          <p className="text-[9px] text-slate-400">Registered on: {farmer.joinedDate}</p>
                        </div>

                        <div className="flex items-center gap-2 border-t sm:border-none pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => {
                              setSelectedFarmerForKyc(farmer);
                              setIsKycViewerOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 px-4 py-2 text-xs font-bold transition cursor-pointer"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" /> Audit Docs
                          </button>

                          {farmer.kycStatus === "Pending" && (
                            <button
                              onClick={() => handleApproveKYC(farmer.id)}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition cursor-pointer"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Approve KYC
                            </button>
                          )}
                          {farmer.kycStatus !== "Pending" && (
                            <button
                              onClick={() => handleToggleSuspendFarmer(farmer.id, farmer.kycStatus)}
                              className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                                farmer.kycStatus === "Suspended"
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                  : "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100"
                              }`}
                            >
                              {farmer.kycStatus === "Suspended" ? (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5" /> Reinstate
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3.5 w-3.5" /> Suspend
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KYC Verification Board Modal (Part 6.1) */}
                  {isKycViewerOpen && selectedFarmerForKyc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl max-w-4xl w-full p-6 sm:p-8 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Farmer KYC Verification Board</h3>
                            <p className="text-xs text-slate-500">Reviewing documents for: <strong>{selectedFarmerForKyc.name}</strong></p>
                          </div>
                          <button
                            onClick={() => {
                              setIsKycViewerOpen(false);
                              setSelectedFarmerForKyc(null);
                            }}
                            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition font-bold"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3 rounded-2xl mb-4 flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                          <span><strong>Private S3 Security:</strong> Temporary access links expire in 5 minutes. Direct public bucket access is blocked.</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 overflow-y-auto flex-1 pr-1 py-1">
                          {/* FSSAI License Preview */}
                          <div className="border border-slate-200 rounded-3xl p-4 space-y-3 bg-slate-50/30">
                            <p className="text-xs font-bold text-slate-700 flex justify-between">
                              <span>FSSAI License Certificate</span>
                              <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Expires 5m</span>
                            </p>
                            {selectedFarmerForKyc.kycFssaiUrl ? (
                              <iframe
                                src={selectedFarmerForKyc.kycFssaiUrl}
                                className="w-full h-[320px] rounded-2xl border border-slate-200 bg-white"
                              />
                            ) : (
                              <div className="h-[320px] rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white text-xs">
                                No FSSAI Certificate Uploaded
                              </div>
                            )}
                          </div>

                          {/* Govt ID Preview */}
                          <div className="border border-slate-200 rounded-3xl p-4 space-y-3 bg-slate-50/30">
                            <p className="text-xs font-bold text-slate-700 flex justify-between">
                              <span>Government ID (Aadhaar / Pan)</span>
                              <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Expires 5m</span>
                            </p>
                            {selectedFarmerForKyc.kycGovIdUrl ? (
                              <iframe
                                src={selectedFarmerForKyc.kycGovIdUrl}
                                className="w-full h-[320px] rounded-2xl border border-slate-200 bg-white"
                              />
                            ) : (
                              <div className="h-[320px] rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white text-xs">
                                No Government ID Uploaded
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end border-t border-slate-100 pt-4 mt-4">
                          <button
                            onClick={() => {
                              handleApproveKYC(selectedFarmerForKyc.id);
                              setIsKycViewerOpen(false);
                            }}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            Approve Farmer KYC
                          </button>
                          <button
                            onClick={() => {
                              handleToggleSuspendFarmer(selectedFarmerForKyc.id, selectedFarmerForKyc.kycStatus);
                              setIsKycViewerOpen(false);
                            }}
                            className="rounded-full bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 px-6 py-2.5 text-xs font-bold transition cursor-pointer"
                          >
                            Reject & Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 4: Unified User Directory (Part 6.2) */}
              {activeTab === "customers" && (() => {
                const allUsers = [
                  ...customers.map(c => ({ ...c, role: "CUSTOMER" })),
                  ...farmers.map(f => ({ 
                    ...f, 
                    role: "FARMER", 
                    ordersCount: 0, 
                    status: f.kycStatus === "Suspended" ? "Blocked" as const : "Active" as const 
                  }))
                ];

                const filteredUsers = allUsers.filter(u => {
                  const matchesSearch = u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                                        u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
                  const matchesRole = userRoleFilter === "ALL" ? true : u.role === userRoleFilter;
                  return matchesSearch && matchesRole;
                });

                return (
                  <motion.div
                    key="customers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-black text-slate-900">Unified User Directory</h2>
                      <div className="flex flex-wrap gap-2">
                        {(["ALL", "CUSTOMER", "FARMER"] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => setUserRoleFilter(role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              userRoleFilter === role
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {role === "ALL" ? "All Roles" : role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <div key={u.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900">{u.name}</span>
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                                  {u.role}
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  u.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                  "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}>
                                  {u.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{u.email} • Joined {u.joinedDate}</p>
                              {u.role === "CUSTOMER" ? (
                                <p className="text-[10px] text-slate-400 font-bold">Total standing/past orders: {u.ordersCount}</p>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold">Herd Size: {(u as any).herdSize || "N/A"}</p>
                              )}
                            </div>

                            <div className="border-t sm:border-none pt-3 sm:pt-0 w-full sm:w-auto text-right">
                              <button
                                onClick={() => {
                                  if (u.role === "CUSTOMER") {
                                    handleToggleBlockCustomer(u.id, u.status);
                                  } else {
                                    handleToggleSuspendFarmer(u.id, u.status === "Blocked" ? "Suspended" : "Verified");
                                  }
                                }}
                                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                                  u.status === "Blocked"
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                    : "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100"
                                }`}
                              >
                                {u.status === "Blocked" ? (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5" /> Unblock User
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3.5 w-3.5" /> Block User
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-400 text-xs font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                          No users found matching filters
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}

              {/* Tab 5: Product Moderation */}
              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Product Moderation Queue</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {products.map((prod) => (
                      <div key={prod.id} className="border border-slate-200 rounded-3xl p-4 flex gap-4 bg-slate-50/30 relative">
                        <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl shrink-0 flex items-center justify-center relative overflow-hidden">
                          <img src={prod.image} alt={prod.name} className="w-16 h-16 object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-xs font-black text-slate-800 leading-tight">{prod.name}</p>
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                prod.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {prod.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-bold">Seller: {prod.sellerName}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                            <span className="text-xs font-black text-slate-950">₹{prod.price}</span>
                            
                            <button
                              onClick={() => handleToggleProductFlag(prod.id, prod.status)}
                              className={`inline-flex items-center gap-1 rounded px-3 py-1 text-[10px] font-bold transition cursor-pointer ${
                                prod.status === "Flagged"
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              {prod.status === "Flagged" ? "Approve Item" : "Flag Item"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 6: Review Moderation */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Reviews & Moderation Panel</h2>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/20 text-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-black text-slate-900">{rev.customerName}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Reviewed: <strong>{rev.farmerName}</strong></p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              rev.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                              rev.status === "Flagged" ? "bg-amber-50 text-amber-700 animate-pulse" :
                              "bg-rose-50 text-rose-700"
                            }`}>
                              {rev.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>

                        <p className="text-slate-600 leading-5 text-justify italic">"{rev.text}"</p>

                        <div className="flex items-center gap-2 justify-end border-t border-slate-100 pt-3">
                          {rev.status !== "Approved" && (
                            <button
                              onClick={() => handleReviewAction(rev.id, "Approved")}
                              className="inline-flex items-center gap-1 rounded bg-slate-950 hover:bg-slate-800 text-white px-3 py-1.5 font-bold transition cursor-pointer"
                            >
                              Approve Review
                            </button>
                          )}
                          {rev.status !== "Removed" && (
                            <button
                              onClick={() => handleReviewAction(rev.id, "Removed")}
                              className="inline-flex items-center gap-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 font-bold transition cursor-pointer"
                            >
                              Remove Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 7: Platform Settings */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Global Platform Configurations</h2>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Commission Rate (%)</label>
                        <input
                          type="number"
                          required
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Base Drop Delivery Fee (₹)</label>
                        <input
                          type="number"
                          required
                          value={baseDeliveryFee}
                          onChange={(e) => setBaseDeliveryFee(parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Vendor Payout Settlement Cycle</label>
                        <select
                          value={payoutCycle}
                          onChange={(e) => setPayoutCycle(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        >
                          <option value="Daily">Daily Payouts</option>
                          <option value="Weekly">Weekly Settlement</option>
                          <option value="Bi-Weekly">Bi-Weekly Settlement</option>
                          <option value="Monthly">Monthly Settlement</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Automatic KYC Checks Required</label>
                        <div className="mt-2.5 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={kycRequired}
                            onChange={(e) => setKycRequired(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-bold text-slate-600">Restrict unverified vendor catalogs</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 hover:bg-slate-800 py-3 px-8 text-xs font-bold text-white shadow-md transition cursor-pointer"
                      >
                        <Save className="h-4 w-4" /> Save Configuration
                      </button>
                    </div>

                    <AnimatePresence>
                      {isSettingsSaved && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-xl text-center flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>System global variables updated successfully!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
