"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, ClipboardList, ShoppingBag, MessageSquare, IndianRupee, Settings,
  Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, Users, MapPin, 
  TrendingUp, Calendar, Clock, Image as ImageIcon, ShieldAlert, ArrowUpRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Logo from "@/components/Logo";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  stock: number;
  category: string;
}

interface Order {
  id: string;
  customerName: string;
  address: string;
  product: string;
  quantity: string;
  total: number;
  date: string;
  status: "Pending" | "Completed" | "Cancelled";
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  product: string;
}

export default function FarmerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "reviews" | "earnings" | "settings">("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);

  // Store Settings State
  const [storeName, setStoreName] = useState("Govardhan A2 Dairy");
  const [storeDesc, setStoreDesc] = useState("Premium grass-fed Gir cow milk, pure Vedic-churned ghee, and traditional dairy products delivered directly from farm to table.");
  const [storePhone, setStorePhone] = useState("+91 98765 00000");
  const [storeAddress, setStoreAddress] = useState("Farm No. 4, Aravali Foothills Rural Zone, near Sector 62, Gurugram, Haryana");
  const [deliveryRadius, setDeliveryRadius] = useState("8 km");
  const [dispatchTime, setDispatchTime] = useState("5:00 AM");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  // CRUD Product Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [prodFormName, setProdFormName] = useState("");
  const [prodFormPrice, setProdFormPrice] = useState("");
  const [prodFormUnit, setProdFormUnit] = useState("");
  const [prodFormDesc, setProdFormDesc] = useState("");
  const [prodFormStock, setProdFormStock] = useState("");
  const [prodFormImg, setProdFormImg] = useState("/apnadoodh_cow_milk.webp");
  const [prodFormCategory, setProdFormCategory] = useState("Milk");

  // Pre-seeded images list for visual convenience
  const availableImages = [
    { label: "Cow Milk", path: "/apnadoodh_cow_milk.webp" },
    { label: "Buffalo Milk", path: "/apnadoodh_buffalo_milk.webp" },
    { label: "Desi Ghee", path: "/apnadoodh_ghee.webp" },
    { label: "White Butter", path: "/apnadoodh_butter.webp" },
    { label: "Soft Paneer", path: "/apnadoodh_paneer.webp" },
    { label: "Fresh Curd", path: "/apnadoodh_curd.webp" },
  ];

  const loadDashboardData = async (farmerId: string) => {
    try {
      // Fetch Products
      const prodRes = await fetch(`/api/products?farmerId=${farmerId}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products);
      }

      // Fetch Deliveries/Orders
      const delivRes = await fetch("/api/deliveries");
      if (delivRes.ok) {
        const delivData = await delivRes.json();
        const mappedOrders = delivData.deliveries.map((d: any) => ({
          id: d.id,
          customerName: d.customerName,
          address: d.address,
          product: d.product,
          quantity: d.quantity,
          total: d.price,
          date: d.date,
          status: d.status === "Delivered" ? "Completed" : d.status === "Skipped" ? "Cancelled" : "Pending"
        }));
        setOrders(mappedOrders);
      }

      // Fetch Reviews
      const revRes = await fetch(`/api/reviews?farmerId=${farmerId}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.reviews.map((r: any) => ({
          id: r.id,
          customerName: r.customerName,
          rating: r.rating,
          text: r.text,
          date: r.date,
          product: r.product
        })));
      }
    } catch (e) {
      console.error("Failed to load farmer dashboard details", e);
    }
  };

  // Fetch Session User
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setStoreName(data.user.storeName || "");
          setStoreDesc(data.user.storeDesc || "");
          setStorePhone(data.user.storePhone || "");
          setStoreAddress(data.user.storeAddress || "");
          setDeliveryRadius(data.user.deliveryRadius || "");
          setDispatchTime(data.user.dispatchTime || "");
          setDeliveryFee(data.user.deliveryFee || 0);

          loadDashboardData(data.user.id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, []);

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: "Completed" | "Cancelled") => {
    try {
      const res = await fetch(`/api/deliveries/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      }
    } catch (e) {
      console.error("Failed to update order status", e);
    }
  };

  // Handlers for Product CRUD
  const openAddProductModal = () => {
    setModalMode("add");
    setEditingProductId(null);
    setProdFormName("");
    setProdFormPrice("");
    setProdFormUnit("1 Litre");
    setProdFormDesc("");
    setProdFormStock("100");
    setProdFormImg("/apnadoodh_cow_milk.webp");
    setProdFormCategory("Milk");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setModalMode("edit");
    setEditingProductId(prod.id);
    setProdFormName(prod.name);
    setProdFormPrice(prod.price.toString());
    setProdFormUnit(prod.unit);
    setProdFormDesc(prod.description);
    setProdFormStock(prod.stock.toString());
    setProdFormImg(prod.image);
    setProdFormCategory(prod.category);
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(prodFormPrice);
    const stockVal = parseInt(prodFormStock);
    if (isNaN(priceVal) || priceVal <= 0 || isNaN(stockVal) || stockVal < 0) return;

    try {
      if (modalMode === "add") {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: prodFormName,
            price: priceVal,
            unit: prodFormUnit,
            description: prodFormDesc,
            image: prodFormImg,
            stock: stockVal,
            category: prodFormCategory
          })
        });
        if (res.ok) {
          const data = await res.json();
          setProducts([...products, data.product]);
        }
      } else {
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: prodFormName,
            price: priceVal,
            unit: prodFormUnit,
            description: prodFormDesc,
            image: prodFormImg,
            stock: stockVal,
            category: prodFormCategory
          })
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(prev => prev.map(p => p.id === editingProductId ? data.product : p));
        }
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error("Product catalog CRUD operation failed", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeDesc,
          storePhone,
          storeAddress,
          deliveryRadius,
          dispatchTime,
          deliveryFee
        })
      });
      if (res.ok) {
        setIsSettingsSaved(true);
        setTimeout(() => {
          setIsSettingsSaved(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  // Computed overview metrics
  const activeOrdersCount = orders.filter(o => o.status === "Pending").length;
  const completedOrdersCount = orders.filter(o => o.status === "Completed").length;
  const totalRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + o.total, 0);

  // SVG earnings graph data
  const weeklyEarnings = [
    { day: "Wed", sales: 4200 },
    { day: "Thu", sales: 5100 },
    { day: "Fri", sales: 4900 },
    { day: "Sat", sales: 6800 },
    { day: "Sun", sales: 8500 },
    { day: "Mon", sales: 5900 },
    { day: "Tue", sales: 7200 },
  ];
  
  const maxWeekly = Math.max(...weeklyEarnings.map(w => w.sales));

  return (
    <div className="pt-24 pb-8 sm:pt-28 sm:pb-12 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Welcome back, {user ? user.name : "Farmer Partner"}!</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage dairy products catalog, fulfill daily delivery drops, and check local farm metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-xs font-bold shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Store Online
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">From {completedOrdersCount} completed orders</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Drops</p>
              <ClipboardList className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xl font-black text-slate-900 mt-2">{activeOrdersCount} Pending</p>
            <p className="text-[10px] text-slate-400 mt-1">Dispatches scheduled before 7:00 AM</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Catalog</p>
              <ShoppingBag className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-xl font-black text-slate-900 mt-2">{products.length} Products</p>
            <p className="text-[10px] text-indigo-600 font-bold mt-1">Listed on market board</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Farmer Rating</p>
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xl font-black text-slate-900 mt-2">4.9 / 5.0</p>
            <p className="text-[10px] text-amber-600 font-bold mt-1">Based on verified reviews</p>
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
              { id: "products", label: "Products Catalog", icon: ShoppingBag },
              { id: "orders", label: "Delivery Orders", icon: ClipboardList },
              { id: "reviews", label: "Reviews & Feedback", icon: MessageSquare },
              { id: "earnings", label: "Earnings Analytics", icon: IndianRupee },
              { id: "settings", label: "Store Settings", icon: Settings },
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
                      ? "bg-slate-900 text-white shadow-md shadow-slate-950/20"
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
                    <h2 className="text-lg font-black text-slate-900">Partner Dashboard</h2>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Updates every 5 minutes</span>
                  </div>

                  {activeOrdersCount > 0 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-xs">
                      <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold">Pending Morning Dispatches</p>
                        <p className="mt-0.5 leading-4">You have {activeOrdersCount} pending deliveries that need to be packaged and loaded. Make sure to complete them before the morning courier pickup.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Catalog Quick view */}
                    <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Alert Level</h3>
                        <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Low Stock Limits</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {products.map(p => (
                          <div key={p.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 text-xs">
                            <span className="font-bold text-slate-800">{p.name} ({p.unit})</span>
                            <span className={`font-black ${p.stock < 25 ? "text-rose-600" : "text-slate-600"}`}>
                              {p.stock} units left
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick review feed */}
                    <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Reviews</h3>
                      <div className="space-y-3">
                        {reviews.slice(0, 2).map(r => (
                          <div key={r.id} className="text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800">{r.customerName}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className={`h-2.5 w-2.5 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-500 italic">"{r.text.substring(0, 60)}..."</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Products Catalog (CRUD) */}
              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Manage Products</h2>
                    <button
                      onClick={openAddProductModal}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Product
                    </button>
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
                              <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                {prod.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                            <span className="text-xs font-black text-slate-950">
                              ₹{prod.price} <span className="text-[9px] text-slate-400 font-medium">/ {prod.unit}</span>
                            </span>
                            <span className="text-[9px] font-bold text-slate-500">
                              Stock: <strong className={prod.stock < 30 ? "text-rose-600" : "text-slate-800"}>{prod.stock}</strong>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="p-1 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Delivery Orders */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Delivery Drops</h2>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-950">{order.id}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs font-black text-slate-800">{order.product} <span className="text-slate-400 font-medium">({order.quantity})</span></p>
                          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {order.customerName} • {order.address}
                          </p>
                          <p className="text-[9px] text-slate-400">Dispatch date: {order.date}</p>
                        </div>

                        <div className="flex sm:flex-col items-end gap-3 sm:gap-2 w-full sm:w-auto justify-between border-t sm:border-none pt-3 sm:pt-0">
                          <div className="text-right">
                            <p className="text-xs font-black text-slate-950">₹{order.total}</p>
                          </div>
                          {order.status === "Pending" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "Completed")}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-[10px] font-bold transition cursor-pointer"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Fulfill
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                                className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 px-3 py-1.5 text-[10px] font-bold transition cursor-pointer"
                              >
                                <XCircle className="h-3 w-3" /> Skip
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Reviews & Feedback */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Customer Feedback</h2>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 text-center flex flex-col justify-center items-center space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
                      <p className="text-5xl font-black text-slate-950 tracking-tight">4.9</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">Based on verified platform purchases</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Reviews</h3>
                      <div className="space-y-3 divide-y divide-slate-100">
                        {reviews.map((rev) => (
                          <div key={rev.id} className="pt-3 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs font-black text-slate-800">{rev.customerName}</p>
                                <p className="text-[9px] text-blue-600 font-bold mt-0.5">{rev.product}</p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                            </div>
                            <div className="flex gap-0.5 my-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                            <p className="text-xs leading-5 text-slate-500">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 5: Earnings Analytics */}
              {activeTab === "earnings" && (
                <motion.div
                  key="earnings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Earning Performance</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Sales</p>
                      <p className="text-lg font-black text-slate-950 mt-1">₹7,200</p>
                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                        <TrendingUp className="h-3 w-3" /> +22% vs yesterday
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Month</p>
                      <p className="text-lg font-black text-slate-950 mt-1">₹1,42,850</p>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 block">Payout cleared on 1st of month</span>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commission Paid</p>
                      <p className="text-lg font-black text-slate-950 mt-1">₹0.00</p>
                      <span className="text-[9px] font-bold text-indigo-600 mt-1 block">0% Intro Farmer Commission</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="border border-slate-200 rounded-3xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Sales (₹)</h3>
                      <span className="text-[10px] text-slate-400 font-bold">June 17 - June 23</span>
                    </div>

                    <div className="h-48 w-full flex items-end justify-between pt-6 px-4">
                      {weeklyEarnings.map((item, idx) => {
                        const barHeight = (item.sales / maxWeekly) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <span className="text-[9px] font-bold text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">₹{item.sales}</span>
                            <div 
                              style={{ height: `${barHeight - 20}%` }} 
                              className="w-8 sm:w-12 bg-slate-900 hover:bg-blue-600 rounded-t-lg transition-all duration-300 shadow-sm cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-slate-400 mt-1">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 6: Store Settings */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Store Front Settings</h2>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Dairy Store Name</label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={storePhone}
                          onChange={(e) => setStorePhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Store Description</label>
                      <textarea
                        rows={3}
                        required
                        value={storeDesc}
                        onChange={(e) => setStoreDesc(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 leading-normal"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Store Farm Address</label>
                      <input
                        type="text"
                        required
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Delivery Dispatch Time</label>
                        <input
                          type="text"
                          required
                          value={dispatchTime}
                          onChange={(e) => setDispatchTime(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Delivery Radius limit</label>
                        <input
                          type="text"
                          required
                          value={deliveryRadius}
                          onChange={(e) => setDeliveryRadius(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Delivery Dispatch Fee (₹)</label>
                        <input
                          type="number"
                          required
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-blue-500 font-bold"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 hover:bg-slate-800 py-3 px-8 text-xs font-bold text-white shadow-md transition cursor-pointer"
                      >
                        Save Configurations
                      </button>
                    </div>

                    <AnimatePresence>
                      {isSettingsSaved && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-xl text-center"
                        >
                          Storefront details successfully saved!
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

      {/* CRUD Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">{modalMode === "add" ? "Add New Product" : "Edit Product Catalog Item"}</h3>
                <p className="text-xs text-slate-400 mt-1">Provide product description details, custom pricing, stock availability, and select a product image.</p>
              </div>

              <form onSubmit={handleProductFormSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pure Buffalo Milk"
                      value={prodFormName}
                      onChange={(e) => setProdFormName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Product Category</label>
                    <select
                      value={prodFormCategory}
                      onChange={(e) => setProdFormCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Milk">Milk</option>
                      <option value="Ghee">Ghee</option>
                      <option value="Butter">Butter</option>
                      <option value="Paneer">Paneer</option>
                      <option value="Curd">Curd</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 85"
                      value={prodFormPrice}
                      onChange={(e) => setProdFormPrice(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Selling Unit</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 Litre"
                      value={prodFormUnit}
                      onChange={(e) => setProdFormUnit(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Initial Stock</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 100"
                      value={prodFormStock}
                      onChange={(e) => setProdFormStock(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Short description highlighting purity details..."
                    value={prodFormDesc}
                    onChange={(e) => setProdFormDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none focus:border-blue-500 leading-normal"
                  />
                </div>

                {/* Pre-seeded image selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">Select Product Image</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableImages.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProdFormImg(img.path)}
                        className={`flex flex-col items-center gap-1 p-2 border rounded-xl transition cursor-pointer text-center bg-slate-50 hover:bg-slate-100 ${
                          prodFormImg === img.path ? "border-slate-900 bg-slate-100 ring-2 ring-slate-900/10" : "border-slate-200"
                        }`}
                      >
                        <img src={img.path} alt={img.label} className="w-8 h-8 object-contain" />
                        <span className="text-[9px] font-bold text-slate-600 truncate w-full">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition active:scale-95 cursor-pointer"
                  >
                    {modalMode === "add" ? "Create Product" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
