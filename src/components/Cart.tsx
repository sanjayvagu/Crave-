import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Receipt,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  TicketPercent,
  XCircle,
  Tag,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CartItem, MenuItem } from "../types";

interface CartProps {
  cart: CartItem[];
  onBack: () => void;
  onCheckoutComplete: () => void;
  onUpdateCart: (item: MenuItem, delta: number) => void;
}

const NumberTicker = ({ value }: { value: number }) => {
  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ width: "ch", minWidth: "4ch" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {value.toFixed(2)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Cart: React.FC<CartProps> = ({
  cart,
  onBack,
  onCheckoutComplete,
  onUpdateCart,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState(false);

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    // Simulate order processing time
    setTimeout(() => {
      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fc8019", "#60b246", "#ffffff"],
      });

      // Sound
      try {
        const audioCtx = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();

        const playBeep = (
          freq: number,
          startTime: number,
          duration: number,
        ) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            freq,
            audioCtx.currentTime + startTime,
          );

          gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
          gainNode.gain.linearRampToValueAtTime(
            0.5,
            audioCtx.currentTime + startTime + 0.05,
          );
          gainNode.gain.linearRampToValueAtTime(
            0,
            audioCtx.currentTime + startTime + duration,
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start(audioCtx.currentTime + startTime);
          oscillator.stop(audioCtx.currentTime + startTime + duration);
        };

        playBeep(880, 0, 0.15); // A5
        playBeep(1046.5, 0.15, 0.3); // C6
      } catch (e) {
        console.warn("Audio playback failed", e);
      }

      // Trigger complete
      setTimeout(() => {
        setIsProcessing(false);
        setIsConfirming(false);
        onCheckoutComplete();
      }, 600);
    }, 2000);
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "CRAVE20" || code === "SAVE10") {
      setAppliedCoupon(code);
      setCouponError(false);
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2000); // clear error after delay
    }
  };

  const itemTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon === "CRAVE20") {
    discountAmount = itemTotal * 0.2;
  } else if (appliedCoupon === "SAVE10") {
    discountAmount = itemTotal * 0.1;
  }

  const deliveryFee = itemTotal > 0 ? 3.99 : 0;
  const subTotalAfterDiscount = Math.max(0, itemTotal - discountAmount);
  const taxes = subTotalAfterDiscount * 0.08;
  const tipAmount = subTotalAfterDiscount * (tipPercentage / 100);
  const total = subTotalAfterDiscount + deliveryFee + taxes + tipAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%", zIndex: 20 }}
      animate={{ opacity: 1, y: 0, zIndex: 20 }}
      exit={{ opacity: 0, y: "100%", zIndex: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950"
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Truffles & Co. &bull; {cart.length} items
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Deliver To Card (Glassmorphic) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-[#fc8019]">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Deliver to Home
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                123 Design Avenue, Tech Park Building A
              </p>
              <p className="text-sm font-medium mt-1 text-slate-700 dark:text-slate-200">
                35-40 mins delivery time
              </p>
            </div>
            <button className="text-[#fc8019] text-sm font-bold uppercase tracking-wider">
              Change
            </button>
          </div>
        </div>

        {/* Apply Coupon */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
            <TicketPercent className="w-5 h-5 text-[#fc8019]" />
            Offers & Benefits
          </h3>

          <AnimatePresence mode="wait">
            {!appliedCoupon ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. CRAVE20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm font-medium uppercase outline-none transition-colors ${
                        couponError
                          ? "border-red-300 text-red-600 focus:border-red-500"
                          : "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:border-[#fc8019]"
                      }`}
                    />
                    {couponError && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold"
                      >
                        Invalid coupon code
                      </motion.span>
                    )}
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim()}
                    className="bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-50 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="applied"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-sm tracking-tight">
                      '{appliedCoupon}' applied
                    </p>
                    <p className="text-green-600 text-xs font-medium mt-0.5">
                      You saved ${discountAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponInput("");
                  }}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Tip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">
            Add a tip for the delivery partner
          </h3>
          <div className="flex gap-3">
            {[0, 10, 15, 20].map((percentage) => (
              <button
                key={percentage}
                onClick={() => setTipPercentage(percentage)}
                className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                  tipPercentage === percentage
                    ? "border-[#fc8019] bg-orange-50 text-[#fc8019]"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                {percentage === 0 ? "No Tip" : `${percentage}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            Order Summary
          </h3>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                    <div>
                      <h4 className="text-slate-800 dark:text-slate-100 text-sm font-medium">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => onUpdateCart(item, -1)}
                          className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateCart(item, 1)}
                          className="w-6 h-6 rounded-full border border-[#fc8019] flex items-center justify-center text-[#fc8019] hover:bg-orange-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                    $<NumberTicker value={item.price * item.quantity} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4 border-dashed border-t-2 border-slate-200 dark:border-slate-700"></div>

          {/* Bill Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Item Total</span>
              <span className="flex items-center">
                $<NumberTicker value={itemTotal} />
              </span>
            </div>
            <AnimatePresence>
              {discountAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-green-600 font-medium"
                >
                  <span className="flex items-center gap-1">
                    Item Discount <Tag className="w-3 h-3" />
                  </span>
                  <span className="flex items-center">
                    -$
                    <NumberTicker value={discountAmount} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                Delivery fee <Clock className="w-3 h-3" />
              </span>
              <span className="flex items-center">
                $<NumberTicker value={deliveryFee} />
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Taxes & charges</span>
              <span className="flex items-center">
                $<NumberTicker value={taxes} />
              </span>
            </div>
            <AnimatePresence>
              {tipPercentage > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-[#fc8019] font-medium"
                >
                  <span>Delivery Tip ({tipPercentage}%)</span>
                  <span className="flex items-center">
                    $<NumberTicker value={tipAmount} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-4"></div>

          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100 text-lg">
            <span>To Pay</span>
            <span className="flex items-center">
              $<NumberTicker value={total} />
            </span>
          </div>
        </div>
      </div>

      {/* Slide to Pay Area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-5 pt-6 pb-32 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.05)]">
        <motion.button
          onClick={() => setIsConfirming(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0px 10px 20px rgba(96, 178, 70, 0.3)",
              "0px 0px 30px rgba(96, 178, 70, 0.7)",
              "0px 10px 20px rgba(96, 178, 70, 0.3)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="w-full bg-[#60b246] hover:bg-[#529d3a] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-between px-6 transition-colors"
        >
          <span className="flex items-center">
            Pay $<NumberTicker value={total} />
          </span>
          <div className="flex items-center gap-2">
            <span>Proceed</span>
            <div className="bg-white/20 p-1.5 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-t-3xl shadow-2xl flex flex-col items-center pb-32"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 rounded-full border-4 border-[#fc8019] border-t-transparent mb-6"
                  />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Processing your order...
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
                    Please wait while we confirm with the restaurant.
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Confirm Your Order
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
                    Are you ready to place your order? You will be charged $
                    {total.toFixed(2)}.
                  </p>

                  <div className="flex flex-col w-full gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirmOrder}
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
                      className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-xl"
                    >
                      Confirm Order
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsConfirming(false)}
                      className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-xl"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
