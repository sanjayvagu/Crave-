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
              created_at: new Date(o.date).toISOString(),
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
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50";
      case "preparing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50";
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "picked_up":
      case "delivered":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {screen === "splash" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-600 dark:bg-indigo-900 z-[100]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-white dark:bg-indigo-100 rounded-3xl shadow-2xl flex items-center justify-center mb-6 relative overflow-hidden"
          >
            <Store className="w-12 h-12 text-indigo-600 dark:text-indigo-700 z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-indigo-50 dark:bg-indigo-200" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-white tracking-tight"
          >
            Vendor<span className="text-indigo-300">Hub</span>
          </motion.h1>
        </motion.div>
      )}

      {screen === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col z-[90]"
        >
          <div className="flex-1 flex flex-col pt-12 items-center p-8 text-center relative overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-100 dark:from-indigo-900/20 to-transparent -z-10" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl border border-indigo-50 dark:border-slate-800"
            >
              <Utensils className="w-14 h-14 text-indigo-600 dark:text-indigo-400" />
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight leading-tight"
            >
              Manage Your <br /> Restaurant
            </motion.h2>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mb-12"
            >
              Streamline your daily operations. Accept live orders, update your menu in real-time, and monitor store analytics.
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0 border-t border-slate-100 dark:border-slate-800 pb-[max(env(safe-area-inset-bottom),2rem)]"
          >
            <button
              onClick={() => setScreen("dashboard")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Start Managing
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="w-full mt-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold py-3 transition-colors text-sm"
            >
              Return to User App
            </button>
          </motion.div>
        </motion.div>
      )}

      {screen === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col bg-slate-50 dark:bg-slate-950 font-sans z-[80]"
        >
          {/* Main Scroller */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "orders" && (
              <div className="p-5 pt-[max(2rem,env(safe-area-inset-top))] pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Live Orders</h1>
                    <p className="text-sm text-slate-500 font-medium">
                      {orders.filter(o => o.status === "pending" || o.status === "preparing").length} active orders
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900/30 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                    <p className="font-bold text-slate-500 text-sm">Syncing orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ListOrdered className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">No active orders</p>
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
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => toggleOrderExpand(order.id)}
                        >
                          <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                ID: {order.id?.substring(0, 8) || "UNKNOWN"}
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                              </p>
                              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-none">
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

                          <div className="flex items-center justify-between mb-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-slate-400" />
                              <span>{order.items || (order.order_items ? order.order_items.length : 2)} Items</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 pb-4 mb-4">
                                <div className="space-y-3 mb-4 text-sm">
                                  {order.order_items?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-start">
                                      <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                          {item.quantity}x {item.products?.name || item.product_name || "Unknown Item"}
                                        </p>
                                        {item.special_instructions && (
                                          <p className="text-xs text-slate-500 italic mt-0.5 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                                            "{item.special_instructions}"
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-bold text-slate-600 dark:text-slate-400 shrink-0 ml-4">
                                        ${item.price_at_time?.toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    Delivery Info
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 mb-1">{deliveryAddress}</p>
                                  <p className="text-slate-500 font-medium">{customerPhone}</p>
                                </div>

                                <div className="mt-5 space-y-3">
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Update Order Status</p>
                                  {order.status === "pending" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "cancelled"); }}
                                        className="flex-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold py-3.5 text-sm rounded-2xl hover:bg-red-100 transition active:scale-[0.98]"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "preparing"); }}
                                        className="flex-[2] bg-indigo-600 text-white font-bold py-3.5 text-sm rounded-2xl shadow-indigo-600/20 shadow-lg hover:bg-indigo-700 transition active:scale-[0.98]"
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
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold py-3.5 text-sm rounded-2xl flex items-center justify-center gap-2"
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
                          <div className="flex justify-between items-center text-slate-400 dark:text-slate-500 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                            <span>Completed Order</span>
                            <span className="text-slate-600 dark:text-slate-300">${order.total_amount?.toFixed(2)}</span>
                          </div>
                        )}
                      </motion.div>
                    )})}
                  </div>
                )}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="p-5 pt-[max(2rem,env(safe-area-inset-top))] pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Menu Items</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage daily availability</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center justify-between transition-colors shadow-sm ${
                        product.is_available
                          ? "border-slate-200 dark:border-slate-800"
                          : "border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold text-base ${product.is_available ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400 line-through"}`}>
                          {product.name}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleProductAvailability(product.id, product.is_available)}
                        className={`flex items-center gap-2 font-bold text-xs px-3 py-2 rounded-xl transition-all ${
                          product.is_available 
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100" 
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
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
              <div className="p-5 pt-[max(2rem,env(safe-area-inset-top))] pb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">Performance insights</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Weekly Revenue Area Chart */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Weekly Revenue</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
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
                          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Peak Hours Bar Chart */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Peak Order Hours</h3>
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
              <div className="p-5 pt-[max(2rem,env(safe-area-inset-top))] pb-20">
                 <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Store Profile</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage settings & performance</p>
                  </div>
                </div>

                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Store className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">My Restaurant</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                       <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Sales</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">$428.50</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                       <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Orders Completed</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">24</p>
                  </div>
                </div>

                {/* Settings Actions */}
                <div className="space-y-3">
                  {[
                    { label: "Operating Hours", icon: Clock },
                    { label: "Payout Accounts", icon: LogOut },
                    { label: "Help & Support", icon: Settings },
                  ].map((item, idx) => (
                    <button key={idx} className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                          <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}

                  <button 
                    onClick={onLogout}
                    className="w-full bg-red-50 dark:bg-red-900/10 mt-6 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition group"
                  >
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-red-600 dark:text-red-400">Exit Vendor App</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 px-6 shrink-0 z-50">
            <div className="flex justify-between items-center max-w-sm mx-auto">
              {[
                { id: "orders", icon: ListOrdered, label: "Orders" },
                { id: "menu", icon: Package, label: "Menu" },
                { id: "analytics", icon: BarChart3, label: "Analytics" },
                { id: "profile", icon: Store, label: "Store" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className="relative flex flex-col items-center justify-center w-16"
                  >
                    <div
                      className={`mb-1 p-1.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      <tab.icon
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isActive ? "scale-110" : ""
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold transition-colors ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {newOrderToast && (
              <motion.div
                initial={{ opacity: 0, y: -50, x: "-50%" }}
                animate={{ opacity: 1, y: 30, x: "-50%" }}
                exit={{ opacity: 0, y: -50, x: "-50%" }}
                className="fixed top-0 left-1/2 z-[100] bg-indigo-600 text-white px-5 py-4 rounded-3xl shadow-xl shadow-indigo-600/30 flex items-center gap-4 w-11/12 max-w-md border border-indigo-500"
              >
                <div className="bg-white/20 p-2.5 rounded-2xl flex-shrink-0 animate-pulse">
                  <BellRing className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base leading-tight">{newOrderToast.title}</h4>
                  <p className="text-indigo-100 text-sm font-medium mt-0.5">{newOrderToast.message}</p>
                </div>
                <button 
                  onClick={() => setNewOrderToast(null)} 
                  className="bg-indigo-700/50 hover:bg-indigo-700 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-indigo-100" />
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
