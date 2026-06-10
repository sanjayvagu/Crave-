import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import {
  Store,
  ListOrdered,
  Settings,
  Package,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  LogOut,
  MapPin,
  TrendingUp,
  Star,
  ChevronRight,
  Utensils,
  BellRing,
  X,
  BarChart3
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { MOCK_ORDERS } from "../data";

interface VendorDashboardProps {
  onLogout: () => void;
}

type InternalScreen = "splash" | "welcome" | "dashboard";
type Tab = "orders" | "menu" | "analytics" | "profile";

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onLogout }) => {
  const [screen, setScreen] = useState<InternalScreen>("splash");
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderToast, setNewOrderToast] = useState<{id: string, title: string, message: string} | null>(null);
  const initialOrdersLoad = useRef(true);

  // Simulated vendor user logic
  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => setScreen("welcome"), 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    let unsubscribeOrders: (() => void) | undefined;
    let unsubscribeProducts: (() => void) | undefined;

    if (screen === "dashboard") {
      setLoading(true);

      const qOrders = query(collection(db, "orders"), orderBy("created_at", "desc"));
      unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
        if (!initialOrdersLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              if (data.status === "pending") {
                setNewOrderToast({
                  id: change.doc.id,
                  title: "New Order Alert!",
                  message: `Received ${data.items || 1} items from ${data.customer_name || 'Guest'}`
                });
                setTimeout(() => setNewOrderToast(null), 6000);
              }
            }
          });
        }
        
        const fetchedOrders: any[] = [];
        snapshot.forEach((docSnap) => {
          fetchedOrders.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        // If Firestore is empty, fallback to mock data initially
        if (fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
        } else {
           setOrders(
            MOCK_ORDERS.map((o) => ({
              id: o.id,
              status: o.status === "Delivered" ? "delivered" : "preparing",
              total_amount: o.total,
              created_at: new Date().toISOString(),
              customer_name: "John Doe",
              items: o.items.length,
              order_items: o.items.map(i => ({ 
                products: { name: i.name }, 
                quantity: i.quantity, 
                price_at_time: o.total / o.items.length, 
                special_instructions: "Please make it extra spicy and add more napkins." 
              })),
              profiles: { phone_number: "+1 (555) 123-4567" },
              delivery_address: "123 Main St, Apt 4B, Cityville",
            }))
          );
        }
        setLoading(false);
        initialOrdersLoad.current = false;
      }, (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, "orders");
      });

      const qProducts = query(collection(db, "products"), orderBy("name", "asc"));
      unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
        const fetchedProducts: any[] = [];
        snapshot.forEach((docSnap) => {
          fetchedProducts.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        // If Firestore empty, fallback
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          setProducts([
            { id: "1", name: "Spicy Chicken Burger", price: 14.99, is_available: true },
            { id: "2", name: "Margherita Pizza", price: 18.5, is_available: false },
            { id: "3", name: "Truffle Fries", price: 8.99, is_available: true },
            { id: "4", name: "Caesar Salad", price: 12.0, is_available: true },
          ]);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "products");
      });
    }

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, [screen]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Optimistic update locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      // Ensure we are modifying a real firestore document ID, fallback mocks won't work
      if (orderId && !orderId.startsWith("ORD-")) {
          await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_available: !currentStatus } : p
        )
      );
      if (productId && !["1", "2", "3", "4"].includes(productId)) {
        await updateDoc(doc(db, "products", productId), { is_available: !currentStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800   border-yellow-200 ";
      case "preparing":
        return "bg-orange-100 text-orange-800   border-orange-200 ";
      case "ready":
        return "bg-green-100 text-green-800   border-green-200 ";
      case "picked_up":
      case "delivered":
        return "bg-slate-100 text-slate-800   border-slate-200 ";
      default:
        return "bg-slate-100 text-slate-800   border-slate-200 ";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {screen === "splash" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#fc8019] flex items-center justify-center z-[100] flex-col"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="flex items-center justify-center flex-col"
          >
            <h1
              className="text-6xl font-black text-white tracking-widest lowercase flex flex-col items-center"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <span>crave</span>
              <span className="text-xl tracking-normal opacity-90 mt-1">vendor</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="h-1 bg-white  mt-4 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}

      {screen === "welcome" && (
        <VendorOnboarding onComplete={() => setScreen("dashboard")} onLogout={onLogout} />
      )}

      {screen === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col bg-slate-50  font-sans z-[80]"
        >
          {/* Main Scroller */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <div className="relative z-10 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 px-5 transition-colors duration-500 bg-gradient-to-b from-[#fc8019] to-[#f27405]  ">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight leading-tight">Vendor Dashboard</h1>
                    <p className="text-xs font-medium text-white/80">Manage your business</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-8 pt-6 bg-slate-50  rounded-t-[32px] -mt-6 relative z-20 shadow-[0_-10px_20px_rgb(0,0,0,0.05)]">
            {activeTab === "orders" && (
              <div className="pt-2 pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800  tracking-tight">Live Orders</h2>
                    <p className="text-sm text-slate-500 font-medium">
                      {orders.filter(o => o.status === "pending" || o.status === "preparing").length} active orders
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#fc8019] mb-4" />
                    <p className="font-bold text-slate-500 text-sm">Syncing orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-white  rounded-3xl border border-slate-200  border-dashed">
                    <div className="w-16 h-16 bg-slate-100  rounded-full flex items-center justify-center mx-auto mb-4">
                      <ListOrdered className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-800  text-lg">No active orders</p>
                    <p className="text-slate-500 text-sm mt-1">New orders will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;

                      const customerName = order.customer_name || order.profiles?.full_name || "Guest Customer";
                      const customerPhone = order.profiles?.phone_number || "No Contact info";
                      const deliveryAddress = order.delivery_address || "Pickup / No Address Provided";

                      return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={order.id}
                        className="bg-white  border border-slate-200  rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => toggleOrderExpand(order.id)}
                        >
                          <div className="flex items-start justify-between mb-4 border-b border-slate-100  pb-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                ID: {order.id?.substring(0, 8) || "UNKNOWN"}
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              </p>
                              <h3 className="font-bold text-slate-900  text-lg leading-none">
                                {customerName}
                              </h3>
                            </div>
                            <span
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-5 text-sm font-medium text-slate-600 ">
                            <div className="flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-slate-400" />
                              <span>{order.items || (order.order_items ? order.order_items.length : 2)} Items</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50  px-2.5 py-1 rounded-md">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>{
                                (() => {
                                  try {
                                    if (!order.created_at) return "N/A";
                                    const d = new Date(order.created_at);
                                    if (isNaN(d.getTime())) return String(order.created_at).split(',')[1] || "N/A"; 
                                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  } catch(e) {
                                    return "N/A";
                                  }
                                })()
                              }</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Order Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-slate-100  pt-4 pb-4 mb-4">
                                <div className="space-y-3 mb-4 text-sm">
                                  {order.order_items?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-start">
                                      <div>
                                        <p className="font-bold text-slate-800 ">
                                          {item.quantity}x {item.products?.name || item.product_name || "Unknown Item"}
                                        </p>
                                        {item.special_instructions && (
                                          <p className="text-xs text-slate-500 italic mt-0.5 bg-yellow-50  p-2 rounded-md border border-yellow-100 ">
                                            "{item.special_instructions}"
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-bold text-slate-600  shrink-0 ml-4">
                                        ${item.price_at_time?.toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                <div className="bg-slate-50  p-4 rounded-2xl text-sm border border-slate-100 ">
                                  <div className="flex items-center gap-2 font-bold text-slate-800  mb-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    Delivery Info
                                  </div>
                                  <p className="text-slate-600  mb-1">{deliveryAddress}</p>
                                  <p className="text-slate-500 font-medium">{customerPhone}</p>
                                </div>

                                <div className="mt-5 space-y-3">
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Update Order Status</p>
                                  {order.status === "pending" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "cancelled"); }}
                                        className="flex-1 bg-red-50 text-red-600   font-bold py-3.5 text-sm rounded-2xl hover:bg-red-100 transition active:scale-[0.98]"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "preparing"); }}
                                        className="flex-[2] bg-[#fc8019] text-white font-bold py-3.5 text-sm rounded-2xl shadow-orange-500/20 shadow-lg hover:bg-orange-600 transition active:scale-[0.98]"
                                      >
                                        Accept & Prep
                                      </button>
                                    </div>
                                  )}
                                  
                                  {order.status === "preparing" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "ready"); }}
                                        className="flex-1 bg-emerald-500 text-white font-bold py-3.5 text-sm rounded-2xl shadow-emerald-500/20 shadow-lg hover:bg-emerald-600 transition active:scale-[0.98] flex items-center justify-center gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark Ready
                                      </button>
                                    </div>
                                  )}

                                  {(order.status === "ready" || order.status === "assigned") && (
                                    <div className="flex gap-2">
                                      <button
                                        disabled
                                        className="flex-1 bg-slate-100  text-slate-400  font-bold py-3.5 text-sm rounded-2xl flex items-center justify-center gap-2"
                                      >
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Waiting for Rider
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        
                        {order.status === "delivered" && (
                          <div className="flex justify-between items-center text-slate-400  text-sm font-bold bg-slate-50  p-3 rounded-xl">
                            <span>Completed Order</span>
                            <span className="text-slate-600 ">${order.total_amount?.toFixed(2)}</span>
                          </div>
                        )}
                      </motion.div>
                    )})}
                  </div>
                )}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="pt-2 pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800  tracking-tight">Menu Items</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage daily availability</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white  border rounded-2xl p-4 flex items-center justify-between transition-colors shadow-sm ${
                        product.is_available
                          ? "border-slate-200 "
                          : "border-red-100  bg-red-50/50 "
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold text-base ${product.is_available ? "text-slate-800 " : "text-slate-500  line-through"}`}>
                          {product.name}
                        </h3>
                        <p className="text-[#fc8019] font-bold text-sm mt-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleProductAvailability(product.id, product.is_available)}
                        className={`flex items-center gap-2 font-bold text-xs px-3 py-2 rounded-xl transition-all ${
                          product.is_available 
                          ? "bg-green-50 text-green-700   hover:bg-green-100" 
                          : "bg-slate-100 text-slate-500   hover:bg-slate-200"
                        }`}
                      >
                        {product.is_available ? "In Stock" : "Sold Out"}
                        {product.is_available ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="pt-2 pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800  tracking-tight">Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">Performance insights</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Weekly Revenue Area Chart */}
                  <div className="bg-white  p-5 rounded-3xl border border-slate-200  shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-lg font-bold text-slate-800  mb-4">Weekly Revenue</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fc8019" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#fc8019" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(val) => `$${val}`} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                            labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                            formatter={(value: number) => [`$${value}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#fc8019" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Peak Hours Bar Chart */}
                  <div className="bg-white  p-5 rounded-3xl border border-slate-200  shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-lg font-bold text-slate-800  mb-4">Peak Order Hours</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={HOURLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                          <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                            formatter={(value: number) => [`${value} orders`, 'Volume']}
                          />
                          <Bar dataKey="volume" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="pt-2 pb-20">
                 <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800  tracking-tight">Store Profile</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage settings & performance</p>
                  </div>
                </div>

                {/* Profile Header */}
                <div className="bg-white  rounded-3xl p-6 border border-slate-200  mb-6 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-50  rounded-2xl flex items-center justify-center shrink-0 border border-orange-100/50 ">
                    <Store className="w-8 h-8 text-[#fc8019]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 ">My Restaurant</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 ">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        4.8
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Downtown
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-white  p-4 rounded-3xl border border-slate-200  shadow-sm">
                    <div className="w-8 h-8 bg-green-100  rounded-full flex items-center justify-center mb-2">
                       <TrendingUp className="w-4 h-4 text-green-600 " />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Sales</p>
                    <p className="text-xl font-black text-slate-800 ">$428.50</p>
                  </div>
                  <div className="bg-white  p-4 rounded-3xl border border-slate-200  shadow-sm">
                    <div className="w-8 h-8 bg-blue-100  rounded-full flex items-center justify-center mb-2">
                       <CheckCircle className="w-4 h-4 text-blue-600 " />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Orders Completed</p>
                    <p className="text-xl font-black text-slate-800 ">24</p>
                  </div>
                </div>

                {/* Settings Actions */}
                <div className="space-y-3">
                  {[
                    { label: "Operating Hours", icon: Clock },
                    { label: "Payout Accounts", icon: LogOut },
                    { label: "Help & Support", icon: Settings },
                  ].map((item, idx) => (
                    <button key={idx} className="w-full bg-white  p-4 rounded-2xl border border-slate-200  flex items-center justify-between hover:bg-slate-50 :bg-slate-800/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100  p-2 rounded-xl">
                          <item.icon className="w-5 h-5 text-slate-600 " />
                        </div>
                        <span className="font-bold text-slate-800 ">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}

                  <button 
                    onClick={onLogout}
                    className="w-full bg-red-50  mt-6 p-4 rounded-2xl border border-red-100  flex items-center justify-center gap-2 hover:bg-red-100 :bg-red-900/20 transition group"
                  >
                    <LogOut className="w-5 h-5 text-red-600  group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-red-600 ">Exit Vendor App</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center px-5 z-[90]"
            style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <motion.div
              className="flex-1 flex bg-white/80  backdrop-blur-2xl border border-white/60  shadow-[0_8px_32px_rgb(0,0,0,0.08)] rounded-full p-1 items-center relative"
            >
              {[
                { id: "orders", icon: ListOrdered, label: "Orders" },
                { id: "menu", icon: Package, label: "Menu" },
                { id: "analytics", icon: BarChart3, label: "Analytics" },
                { id: "profile", icon: Store, label: "Store" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className="relative flex-1 flex flex-col items-center justify-center h-[56px] rounded-full z-10"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="vendorNavIndicator"
                        className="absolute inset-0 bg-slate-200/80  rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                        }}
                        className={`mb-0.5 transition-colors duration-300 ${isActive ? "text-[#fc8019]" : "text-slate-500 "}`}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            fill: isActive ? "currentColor" : "none",
                            strokeWidth: isActive ? 2 : 2.5,
                          }}
                        />
                      </motion.div>
                      <span
                        className={`text-[11px] font-bold tracking-tight transition-colors duration-300 ${isActive ? "text-[#fc8019]" : "text-slate-500 "}`}
                      >
                        {tab.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>

          <AnimatePresence>
            {newOrderToast && (
              <motion.div
                initial={{ opacity: 0, y: -50, x: "-50%" }}
                animate={{ opacity: 1, y: 30, x: "-50%" }}
                exit={{ opacity: 0, y: -50, x: "-50%" }}
                className="fixed top-0 left-1/2 z-[100] bg-[#fc8019] text-white px-5 py-4 rounded-3xl shadow-xl shadow-orange-600/30 flex items-center gap-4 w-11/12 max-w-md border border-orange-500"
              >
                <div className="bg-white/20 p-2.5 rounded-2xl flex-shrink-0 animate-pulse">
                  <BellRing className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base leading-tight">{newOrderToast.title}</h4>
                  <p className="text-orange-100 text-sm font-medium mt-0.5">{newOrderToast.message}</p>
                </div>
                <button 
                  onClick={() => setNewOrderToast(null)} 
                  className="bg-orange-700/50 hover:bg-orange-700 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-orange-100" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const WEEKLY_DATA = [
  { day: 'Mon', orders: 45, revenue: 850 },
  { day: 'Tue', orders: 52, revenue: 1020 },
  { day: 'Wed', orders: 38, revenue: 760 },
  { day: 'Thu', orders: 65, revenue: 1350 },
  { day: 'Fri', orders: 85, revenue: 1850 },
  { day: 'Sat', orders: 95, revenue: 2100 },
  { day: 'Sun', orders: 75, revenue: 1650 },
];

const HOURLY_DATA = [
  { hour: '10 AM', volume: 15 },
  { hour: '12 PM', volume: 45 },
  { hour: '2 PM', volume: 25 },
  { hour: '4 PM', volume: 10 },
  { hour: '6 PM', volume: 65 },
  { hour: '8 PM', volume: 85 },
  { hour: '10 PM', volume: 30 },
];

const VENDOR_ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Manage your restaurant effortlessly",
    description: "Streamline order management, update menu availability, and track your daily sales—all from one convenient spot.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Real-time Order Tracking",
    description: "Get instant notifications for new orders and update their status with a single tap to keep your customers informed.",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f928f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Insightful Analytics",
    description: "Understand your peak hours and top-selling items to grow your business smarter, not harder.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  }
];

const VendorOnboarding: React.FC<{onComplete: () => void, onLogout: () => void}> = ({ onComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < VENDOR_ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = VENDOR_ONBOARDING_STEPS[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-white  flex flex-col z-[90] overflow-hidden"
    >
      <div className="flex-1 relative bg-orange-50/50 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={step.id}
            initial={{ opacity: 0, scale: 1.1, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            src={step.image}
            alt={step.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent  " />
      </div>

      <div
        className="px-8 pt-6 shrink-0 z-10 bg-white  min-h-[300px] flex flex-col justify-end"
        style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-center gap-2 mb-8">
          {VENDOR_ONBOARDING_STEPS.map((s, idx) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-[#fc8019]" : "w-2 bg-slate-200 "}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-black text-slate-800  mb-4 tracking-tight leading-tight">
              {step.title}
            </h1>
            <p className="text-slate-500  text-base mb-8 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0px 4px 15px rgba(252, 128, 25, 0.3)",
              "0px 0px 30px rgba(252, 128, 25, 0.7)",
              "0px 4px 15px rgba(252, 128, 25, 0.3)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group mt-auto"
        >
          {currentStep === VENDOR_ONBOARDING_STEPS.length - 1 ? "Start Managing" : "Next"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <button
          onClick={onLogout}
          className="mt-6 text-center text-slate-500  font-bold text-sm hover:text-slate-800  transition-colors"
        >
          Return to User App
        </button>
      </div>
    </motion.div>
  );
};
