import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import {
  Bike,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  LogOut,
  TrendingUp,
  CheckCircle,
  X,
  Navigation,
  Wallet,
  Settings,
  Star,
  ChevronRight,
  BellRing,
  Package
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface RiderDashboardProps {
  isOnline?: boolean;
  onToggleOnline?: () => void;
  onLogout: () => void;
}

type InternalScreen = "splash" | "welcome" | "dashboard";
type Tab = "deliveries" | "history" | "earnings" | "profile";

const TABS = [
  { id: "deliveries", icon: Bike, label: "Deliver" },
  { id: "history", icon: Clock, label: "History" },
  { id: "earnings", icon: Wallet, label: "Earnings" },
  { id: "profile", icon: Settings, label: "Profile" },
];

export const RiderDashboard: React.FC<RiderDashboardProps> = ({ isOnline = true, onToggleOnline, onLogout }) => {
  const [screen, setScreen] = useState<InternalScreen>("splash");
  const [activeTab, setActiveTab] = useState<Tab>("deliveries");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [newOrderToast, setNewOrderToast] = useState<{id: string, title: string, message: string} | null>(null);
  const initialOrdersLoad = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(40); } catch (e) {}
    }
  };

  const handleGlide = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (clientY < rect.top - 40 || clientY > rect.bottom + 40) return;

    const x = clientX - rect.left;
    const width = rect.width;
    const index = Math.floor((x / width) * TABS.length);
    const clampedIndex = Math.max(0, Math.min(TABS.length - 1, index));
    const targetTab = TABS[clampedIndex].id as Tab;

    if (targetTab !== activeTab && TABS.some((t) => t.id === targetTab)) {
      triggerHaptic();
      setActiveTab(targetTab);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleGlide(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.buttons === 1) handleGlide(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => setScreen("welcome"), 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    let unsubscribeOrders: (() => void) | undefined;

    if (screen === "dashboard") {
      setLoading(true);

      const qOrders = query(collection(db, "orders"), orderBy("created_at", "desc"));
      unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
        if (!initialOrdersLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              if (data.status === "ready") {
                setNewOrderToast({
                  id: change.doc.id,
                  title: "New Delivery Available!",
                  message: `Pickup order for ${data.customer_name || 'Guest'}`
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
        
        // Fallback for demo
        if (fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
        } else {
           setOrders([
             {
               id: "ORD-1A",
               status: "ready",
               total_amount: 24.50,
               created_at: new Date().toISOString(),
               customer_name: "John Doe",
               items: 2,
               delivery_address: "123 Main St, Apt 4B, Cityville",
               restaurant_name: "Burger King",
               restaurant_address: "45 Burger Ave"
             },
             {
               id: "ORD-2B",
               status: "assigned",
               total_amount: 15.00,
               created_at: new Date().toISOString(),
               customer_name: "Alice Smith",
               items: 1,
               delivery_address: "789 Pine Rd, Tech Park",
               restaurant_name: "Pizza Hut",
               restaurant_address: "12 Pizza Blvd"
             }
           ]);
        }
        setLoading(false);
        initialOrdersLoad.current = false;
      }, (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, "orders");
      });
    }

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, [screen]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (orderId && !orderId.startsWith("ORD-")) {
          await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const availableDeliveries = orders.filter(o => o.status === "ready");
  const myActiveDeliveries = orders.filter(o => o.status === "assigned" || o.status === "picked_up");
  const pastDeliveries = orders.filter(o => o.status === "delivered");

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
              <span className="text-xl tracking-normal opacity-90 mt-1 flex items-center gap-2"><Bike className="w-5 h-5"/> rider</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="h-1 bg-white mt-4 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}

      {screen === "welcome" && (
        <RiderOnboarding onComplete={() => setScreen("dashboard")} onLogout={onLogout} />
      )}

      {screen === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col bg-slate-50 font-sans z-[80]"
        >
          {/* Main Scroller */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <div className="relative z-10 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 px-5 transition-colors duration-500 bg-gradient-to-b from-[#fc8019] to-[#f27405]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight leading-tight">Rider Dashboard</h1>
                    <p className="text-xs font-medium text-white/80">Deliver & Earn</p>
                  </div>
                </div>
                <button 
                  onClick={onToggleOnline}
                  className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm cursor-pointer hover:bg-black/30 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-slate-400"}`} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{isOnline ? "Online" : "Offline"}</span>
                </button>
              </div>
            </div>

            <div className="px-5 pb-8 pt-6 bg-slate-50 rounded-t-[32px] -mt-6 relative z-20 shadow-[0_-10px_20px_rgb(0,0,0,0.05)]">
            
            {activeTab === "deliveries" && (
              <div className="pt-2 pb-20">
                {!isOnline ? (
                   <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                     <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                       <Bike className="w-8 h-8 text-slate-400" />
                     </div>
                     <h2 className="text-xl font-bold text-slate-800 mb-2">You are currently offline</h2>
                     <p className="text-slate-500 mb-6 font-medium">Go online to start receiving delivery requests and earning.</p>
                     <button onClick={onToggleOnline} className="bg-[#fc8019] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                       Go Online Now
                     </button>
                   </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Active Deliveries</h2>
                    {myActiveDeliveries.length > 0 ? (
                      <div className="space-y-4 mb-8">
                        {myActiveDeliveries.map(order => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border-2 border-[#fc8019] rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 bg-[#fc8019] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                               {order.status === "assigned" ? "Pickup" : "Dropoff"}
                             </div>
                             <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-lg">{order.restaurant_name || "Restaurant"}</h3>
                                <p className="text-sm font-bold text-[#fc8019] flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {order.restaurant_address || "Pickup address"}</p>
                             </div>
                             
                             <div className="flex items-center gap-3 my-4">
                               <div className="h-full flex flex-col items-center">
                                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                 <div className="w-0.5 h-6 bg-slate-200 my-1"></div>
                                 <div className="w-2 h-2 rounded-full bg-[#fc8019]"></div>
                               </div>
                               <div>
                                 <div className="mb-4 text-sm text-slate-500 font-medium leading-none">Pickup</div>
                                 <div className="text-sm text-slate-800 font-bold leading-none">{order.delivery_address || "Customer address"}</div>
                               </div>
                             </div>

                             <div className="mt-6 flex gap-2">
                               {order.status === "assigned" ? (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, "picked_up")}
                                    className="flex-1 bg-[#fc8019] text-white font-bold py-3.5 text-sm rounded-2xl shadow-orange-500/20 shadow-lg hover:bg-orange-600 transition active:scale-[0.98]"
                                  >
                                    Confirm Pickup
                                  </button>
                               ) : (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, "delivered")}
                                    className="flex-1 bg-emerald-500 text-white font-bold py-3.5 text-sm rounded-2xl shadow-emerald-500/20 shadow-lg hover:bg-emerald-600 transition active:scale-[0.98] flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Delivered
                                  </button>
                               )}
                             </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-3xl border border-slate-200 mb-8 border-dashed">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 font-medium">No active deliveries</p>
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Available Orders</h2>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#fc8019] mb-3" />
                        <p className="font-bold text-slate-500 text-sm">Searching for orders...</p>
                      </div>
                    ) : availableDeliveries.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Navigation className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="font-bold text-slate-800 text-lg">Waiting for orders</p>
                        <p className="text-slate-500 text-sm mt-1">Stay online and in a busy area.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableDeliveries.map(order => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                          >
                             <div className="flex justify-between items-start mb-3">
                               <div>
                                 <h3 className="font-bold text-slate-900">{order.restaurant_name || "Restaurant"}</h3>
                                 <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> ~2.4 km away</p>
                               </div>
                               <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-xl font-bold text-sm">
                                 Est. $5.50
                               </div>
                             </div>
                             <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
                               <button
                                onClick={() => updateOrderStatus(order.id, "assigned")}
                                className="flex-1 bg-slate-900 text-white font-bold py-3 text-sm rounded-xl hover:bg-slate-800 transition active:scale-[0.98]"
                               >
                                 Accept Delivery
                               </button>
                             </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="pt-2 pb-20">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Delivery History</h2>
                {pastDeliveries.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-800 text-lg">No past deliveries</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastDeliveries.map(order => (
                       <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                         <div>
                           <p className="font-bold text-slate-800 text-sm">{order.restaurant_name || "Restaurant"}</p>
                           <p className="text-xs text-slate-400 mt-0.5">ID: {order.id.substring(0, 8)}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-green-600 font-bold text-sm">Completed</p>
                           <p className="text-xs text-slate-400 mt-0.5">Today, 2:30 PM</p>
                         </div>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "earnings" && (
              <div className="pt-2 pb-20">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Earnings Overview</h2>
                
                <div className="bg-[#fc8019] text-white p-6 rounded-3xl shadow-lg shadow-orange-500/20 mb-6">
                  <p className="text-orange-100 font-bold uppercase tracking-wider text-xs mb-1">Today's Earnings</p>
                  <h1 className="text-4xl font-black mb-4">$85.50</h1>
                  <div className="flex gap-4 border-t border-white/20 pt-4">
                    <div>
                      <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider">Deliveries</p>
                      <p className="font-bold">12</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider">Online Time</p>
                      <p className="font-bold">4h 30m</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Weekly Trend</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={EARNINGS_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={24}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} tickFormatter={(val) => `$${val}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                          formatter={(value: number) => [`$${value}`, 'Earnings']}
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="pt-2 pb-20">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Rider Profile</h2>
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200 mb-6 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Rider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Alex Rider</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        4.9
                      </span>
                      <span>1,204 Deliveries</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Account Details", icon: Settings },
                    { label: "Vehicle Information", icon: Bike },
                    { label: "Payout Methods", icon: Wallet },
                  ].map((item, idx) => (
                    <button key={idx} className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl">
                          <item.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="font-bold text-slate-800">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}

                  <button 
                    onClick={onLogout}
                    className="w-full bg-red-50 mt-6 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition group"
                  >
                    <LogOut className="w-5 h-5 text-red-600 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-red-600">Exit Rider App</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          <div
            className="absolute left-0 right-0 flex items-center justify-center px-5 z-[90]"
            style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <motion.div
              ref={containerRef}
              onTouchMove={handleTouchMove}
              onPointerMove={handlePointerMove}
              className="flex-1 flex bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.08)] rounded-full p-1 items-center relative touch-none"
            >
              {TABS.map((tab) => {
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
                        layoutId="riderNavIndicator"
                        className="absolute inset-0 bg-slate-200/80 rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 12 }}
                        className={`mb-0.5 transition-colors duration-300 ${isActive ? "text-[#fc8019]" : "text-slate-500"}`}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            fill: isActive ? "currentColor" : "none",
                            strokeWidth: isActive ? 2 : 2.5,
                          }}
                        />
                      </motion.div>
                      <span className={`text-[11px] font-bold tracking-tight transition-colors duration-300 ${isActive ? "text-[#fc8019]" : "text-slate-500"}`}>
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
                className="fixed top-0 left-1/2 z-[100] bg-slate-900 text-white px-5 py-4 rounded-3xl shadow-2xl flex items-center gap-4 w-11/12 max-w-md border border-slate-700"
              >
                <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0 animate-pulse text-[#fc8019]">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base leading-tight">{newOrderToast.title}</h4>
                  <p className="text-slate-300 text-sm font-medium mt-0.5">{newOrderToast.message}</p>
                </div>
                <button 
                  onClick={() => setNewOrderToast(null)} 
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-300" />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EARNINGS_DATA = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 62 },
  { day: 'Wed', amount: 38 },
  { day: 'Thu', amount: 75 },
  { day: 'Fri', amount: 110 },
  { day: 'Sat', amount: 140 },
  { day: 'Sun', amount: 125 },
];

const RIDER_ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Be your own boss",
    description: "Choose your hours, hit the road, and earn on your schedule with crave delivery.",
    image: "https://images.unsplash.com/photo-1554260570-e9689a3418b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Easy Navigation",
    description: "Accept orders with one tap and get clear turn-by-turn routing directly to the customer.",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Track your earnings",
    description: "See what you make instantly after every delivery and get detailed weekly summaries.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
  }
];

const RiderOnboarding: React.FC<{onComplete: () => void, onLogout: () => void}> = ({ onComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < RIDER_ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = RIDER_ONBOARDING_STEPS[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-slate-50 flex flex-col z-[90] overflow-hidden"
    >
      <div className="flex-1 relative bg-slate-200 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent" />
      </div>

      <div
        className="px-8 pt-6 shrink-0 z-10 bg-slate-50 min-h-[300px] flex flex-col justify-end"
        style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-center gap-2 mb-8">
          {RIDER_ONBOARDING_STEPS.map((s, idx) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-slate-800" : "w-2 bg-slate-300"}`}
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
            <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
              {step.title}
            </h1>
            <p className="text-slate-500 text-base mb-8 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group mt-auto shadow-xl shadow-slate-900/20"
        >
          {currentStep === RIDER_ONBOARDING_STEPS.length - 1 ? "Start Delivering" : "Next"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        <button
          onClick={onLogout}
          className="mt-6 text-center text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
        >
          Return to User App
        </button>
      </div>
    </motion.div>
  );
};
