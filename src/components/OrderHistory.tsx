import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Clock,
  History,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Receipt,
  X,
  Navigation,
  PieChart as PieChartIcon
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts";
import { MOCK_ORDERS } from "../data";
import { Order } from "../types";

interface OrderHistoryProps {
  onBack: () => void;
  onTrackOrder?: () => void;
  onReorder?: (order: Order) => void;
}

const SPENDING_DATA = [
  { name: 'Burgers & American', value: 120, color: '#f43f5e' },
  { name: 'Pizza & Italian', value: 85, color: '#eab308' },
  { name: 'Sushi & Asian', value: 145, color: '#10b981' },
  { name: 'Indian', value: 65, color: '#8b5cf6' },
];

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  onBack,
  onTrackOrder,
  onReorder,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "analytics">("list");

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const calculateBreakdown = (total: number) => {
    const deliveryFee = 3.99;
    let itemTotal = total / 1.25; // Approximate backwards calculation
    const taxes = itemTotal * 0.08;
    let tipAmount = total - itemTotal - deliveryFee - taxes;

    // Adjust if tip goes negative (for cancelled/small orders)
    if (tipAmount < 0) {
      tipAmount = 0;
      itemTotal = total - deliveryFee - taxes;
    }

    return { itemTotal, deliveryFee, taxes, tipAmount };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%", zIndex: 10 }}
      animate={{ opacity: 1, x: 0, zIndex: 10 }}
      exit={{ opacity: 0, x: "100%", zIndex: 10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50  overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] bg-white  shadow-sm z-10 shrink-0 border-b border-slate-100 ">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center text-slate-700 "
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="font-bold text-lg text-slate-800  tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400 " />
              Order History
            </h1>
            <p className="text-xs text-slate-500  font-medium">
              Your past orders
            </p>
          </div>
        </div>
        
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100  p-1 rounded-xl w-full max-w-sm self-center">
          <button
            onClick={() => setView("list")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              view === "list" 
                ? "bg-white  text-slate-800  shadow-sm" 
                : "text-slate-500 "
            }`}
          >
            <History className="w-4 h-4" />
            Orders
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              view === "analytics" 
                ? "bg-white  text-slate-800  shadow-sm" 
                : "text-slate-500 "
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {view === "list" && (
          isLoading
            ? [1, 2, 3].map((key) => (
                <div
                  key={key}
                  className="bg-white  rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 "
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-2 w-1/2">
                      <div className="h-6 bg-slate-200  rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-slate-200  rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-6 bg-slate-200  rounded animate-pulse w-16"></div>
                      <div className="h-5 bg-slate-200  rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                  <div className="py-3 border-t border-b border-dashed border-slate-200  my-3">
                    <div className="h-4 bg-slate-200  rounded animate-pulse w-full mb-2"></div>
                    <div className="h-4 bg-slate-200  rounded animate-pulse w-2/3"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-slate-200  rounded-xl animate-pulse flex-1"></div>
                    <div className="h-10 bg-slate-200  rounded-xl animate-pulse flex-1"></div>
                  </div>
                </div>
              ))
            : MOCK_ORDERS.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-white  rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 "
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800  text-lg">
                        {order.restaurantName}
                      </h3>
                      <p className="text-sm text-slate-500  mt-0.5">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 ">
                        ₹{order.total.toFixed(2)}
                      </p>
                      <div
                        className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 mt-2 px-2 py-1 rounded-md w-fit ml-auto ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status === "Delivered" && (
                          <CheckCircle2 className="w-[10px] h-[10px]" />
                        )}
                        {order.status === "Cancelled" && (
                          <XCircle className="w-[10px] h-[10px]" />
                        )}
                        {(order.status === "Processing" ||
                          (order.status !== "Delivered" &&
                            order.status !== "Cancelled")) && (
                          <Clock className="w-[10px] h-[10px]" />
                        )}
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="py-3 border-t border-b border-dashed border-slate-200  my-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 mb-1 last:mb-0"
                      >
                        <span className="text-xs font-semibold text-slate-500  border border-slate-200  px-1.5 py-0.5 rounded bg-slate-50 ">
                          {item.quantity}
                        </span>
                        <span className="text-sm text-slate-700 ">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedReceipt(order)}
                      className="flex-1 border border-slate-200  text-slate-700  font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50  transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                      View Receipt
                    </motion.button>
                    {["Preparing", "Out for Delivery", "Processing"].includes(
                      order.status,
                    ) ? (
                      <motion.button
                        onClick={() => onTrackOrder && onTrackOrder()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-[#fc8019] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
                      >
                        <Navigation className="w-4 h-4" />
                        Track Order
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => onReorder && onReorder(order)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-[#fc8019] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reorder
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
        )}

        {view === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pb-20"
          >
            <div className="bg-white  rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 ">
              <h2 className="text-xl font-black text-slate-800  tracking-tight text-center mb-6">
                Monthly Spending
              </h2>
              
              <div className="h-64 w-full relative">
                {/* Total amount centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pt-4">
                  <span className="text-sm font-medium text-slate-500 ">Total</span>
                  <span className="text-2xl font-black text-slate-800 ">
                    ₹{SPENDING_DATA.reduce((acc, curr) => acc + curr.value, 0)}
                  </span>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value}`, 'Spent']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    />
                    <Pie
                      data={SPENDING_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {SPENDING_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 space-y-4">
                {SPENDING_DATA.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700  text-sm">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 ">
                      ₹{item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white  rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 pb-4 border-b border-slate-100  flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-slate-800  flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#fc8019]" />
                  Receipt
                </h2>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 text-slate-400  hover:text-slate-600  bg-slate-100  rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto no-scrollbar">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800 ">
                    {selectedReceipt.restaurantName}
                  </h3>
                  <p className="text-sm text-slate-500 ">
                    {selectedReceipt.date}
                  </p>
                  <br />
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100  text-xs font-bold text-slate-600  tracking-wider">
                    ORDER ID: {selectedReceipt.id}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-600 ">
                        <span className="font-semibold text-slate-400  mr-2">
                          {item.quantity}x
                        </span>{" "}
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-px border-t border-dashed border-slate-300 mb-6"></div>

                {(() => {
                  const bd = calculateBreakdown(selectedReceipt.total);
                  return (
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm text-slate-600 ">
                        <span>Item Total</span>
                        <span>₹{bd.itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 ">
                        <span>Delivery Fee</span>
                        <span>₹{bd.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 ">
                        <span>Taxes & Charges</span>
                        <span>₹{bd.taxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#fc8019] font-medium">
                        <span>Delivery Tip</span>
                        <span>₹{bd.tipAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="w-full h-px bg-slate-200  mb-6"></div>

                <div className="flex justify-between font-bold text-lg text-slate-800 ">
                  <span>Total Paid</span>
                  <span>₹{selectedReceipt.total.toFixed(2)}</span>
                </div>

                {["Preparing", "Out for Delivery", "Processing"].includes(
                  selectedReceipt.status,
                ) ? (
                  <motion.button
                    onClick={() => onTrackOrder && onTrackOrder()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 bg-[#fc8019] text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                  >
                    <Navigation className="w-5 h-5" />
                    Track Order
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => {
                      if (onReorder) onReorder(selectedReceipt);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 bg-[#fc8019] text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reorder Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
