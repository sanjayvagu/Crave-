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
  CreditCard,
  Smartphone,
  Banknote,
  ShoppingCart,
  Home,
  Briefcase,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CartItem, MenuItem } from "../types";

interface CartProps {
  cart: CartItem[];
  onBack: () => void;
  onCheckoutComplete: () => void;
  onUpdateCart: (item: MenuItem, delta: number) => void;
  onUpdateInstructions: (itemId: string, instructions: string) => void;
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
  onUpdateInstructions,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [addressType, setAddressType] = useState("Home");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Design Avenue, Tech Park Building A",
  );
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

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
        onCheckoutComplete();
      }, 600);
    }, 2500);
  };

  const itemTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleApplyCoupon = (codeOrEvent?: string | React.MouseEvent) => {
    let codeToApply = couponInput;
    if (typeof codeOrEvent === "string") {
      codeToApply = codeOrEvent;
    }
    const code = codeToApply.trim().toUpperCase();
    if (!code) return;

    if (code === "FREEDEL") {
      setAppliedCoupon(code);
      setCouponError(null);
      setCouponInput(code);
    } else if (code === "FIRST100") {
      if (itemTotal >= 500) {
        setAppliedCoupon(code);
        setCouponError(null);
        setCouponInput(code);
      } else {
        setCouponError("Min purchase of ₹500 required");
        setTimeout(() => setCouponError(null), 3000);
      }
    } else if (code === "SAVE10") {
      if (itemTotal >= 399) {
        setAppliedCoupon(code);
        setCouponError(null);
        setCouponInput(code);
      } else {
        setCouponError("Min purchase of ₹399 required");
        setTimeout(() => setCouponError(null), 3000);
      }
    } else {
      setCouponError("Invalid coupon code");
      setTimeout(() => setCouponError(null), 3000);
    }
  };

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon === "FIRST100") {
    discountAmount = 100;
  } else if (appliedCoupon === "SAVE10") {
    discountAmount = itemTotal * 0.1;
  }

  const deliveryFee = itemTotal > 0 && appliedCoupon !== "FREEDEL" ? 3.99 : 0;
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
      <div className="flex items-center gap-4 px-5 pb-5 pt-safe bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
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

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 pb-32">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full max-w-[250px] bg-[#fc8019] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30"
          >
            Browse Restaurants
          </motion.button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Deliver To Card (Glassmorphic) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 dark:bg-slate-800 p-2 rounded-lg text-[#fc8019] dark:text-slate-200">
              {addressType === "Home" ? <Home className="w-5 h-5" /> : addressType === "Work" ? <Briefcase className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Deliver to {addressType}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {deliveryAddress}
              </p>
              <p className="text-sm font-medium mt-1 text-slate-700 dark:text-slate-200">
                35-40 mins delivery time
              </p>
            </div>
            <button
              onClick={() => setShowMap(true)}
              className="text-[#fc8019] text-sm font-bold uppercase tracking-wider"
            >
              Change
            </button>
          </div>
        </div>

        {/* Apply Coupon */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <TicketPercent className="w-5 h-5 text-[#fc8019]" />
              Offers & Benefits
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {!appliedCoupon ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Coupon Swipe List */}
                <div className="flex overflow-x-auto no-scrollbar gap-3 mb-4 -mx-5 px-5 pb-2">
                  {[
                    {
                      code: "FREEDEL",
                      title: "Free Delivery",
                      desc: "Get free delivery",
                      color: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400",
                    },
                    {
                      code: "FIRST100",
                      title: "₹100 OFF",
                      desc: "Min purchase ₹500",
                      color: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400",
                    },
                    {
                      code: "SAVE10",
                      title: "10% OFF",
                      desc: "Min purchase ₹399",
                      color: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400",
                    },
                  ].map((coupon) => (
                    <div
                      key={coupon.code}
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className={`flex-none w-[160px] border rounded-xl p-3 cursor-pointer shrink-0 transition-transform active:scale-95 ${coupon.color}`}
                    >
                      <div className="font-bold text-sm mb-1">{coupon.title}</div>
                      <div className="text-[10px] opacity-80 leading-tight mb-2">
                        {coupon.desc}
                      </div>
                      <div className="border border-current border-dashed rounded-md px-2 py-1 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">{coupon.code}</span>
                        <span className="text-[10px] font-bold">APPLY</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
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
                        className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold whitespace-nowrap"
                      >
                        {couponError}
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
                      {appliedCoupon === "FREEDEL" ? "Free Delivery unlocked!" : `You saved ₹${discountAmount.toFixed(2)}`}
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

        {/* Payment Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            Payment Method
          </h3>
          <div className="space-y-3 mt-3">
            {[
              { id: "Credit Card", icon: CreditCard },
              { id: "UPI", icon: Smartphone },
              { id: "Cash on Delivery", icon: Banknote },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? "border-[#fc8019] bg-orange-50/50 dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id
                        ? "bg-orange-100 text-[#fc8019]"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {method.id}
                  </span>
                </div>
                <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600">
                  {paymentMethod === method.id && (
                    <motion.div
                      layoutId="radioCheck"
                      className="w-2.5 h-2.5 rounded-full bg-[#fc8019]"
                    />
                  )}
                </div>
              </div>
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
                  className="flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
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
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onUpdateCart(item, -1)}
                            className="w-8 h-8 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-950"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onUpdateCart(item, 1)}
                            className="w-8 h-8 shrink-0 rounded-full border border-[#fc8019] flex items-center justify-center text-[#fc8019] hover:bg-orange-50"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                      ₹<NumberTicker value={item.price * item.quantity} />
                    </div>
                  </div>
                  <div className="ml-6 mr-10 relative">
                    <input
                      type="text"
                      placeholder="Add special instructions (e.g. extra cheese)"
                      value={item.instructions || ""}
                      onChange={(e) =>
                        onUpdateInstructions?.(item.id, e.target.value)
                      }
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:border-[#fc8019] outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4 border-dashed border-t-2 border-slate-200 dark:border-slate-700"></div>

          {/* Bill Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Subtotal</span>
              <span className="flex items-center">
                ₹<NumberTicker value={itemTotal} />
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
                    -₹
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
                ₹<NumberTicker value={deliveryFee} />
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Taxes & charges</span>
              <span className="flex items-center">
                ₹<NumberTicker value={taxes} />
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
                    ₹<NumberTicker value={tipAmount} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-4"></div>

          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100 text-lg">
            <span>To Pay</span>
            <span className="flex items-center">
              ₹<NumberTicker value={total} />
            </span>
          </div>
        </div>
      </div>

      {/* Slide to Pay Area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-5 pt-6 pb-32 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          {!isConfirming && !isProcessing ? (
            <motion.button
              key="proceed-btn"
              onClick={() => setIsConfirming(true)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#60b246] hover:bg-[#529d3a] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-between px-6 transition-colors shadow-[0_10px_20px_rgba(96,178,70,0.3)]"
            >
              <span className="flex items-center">
                Pay ₹<NumberTicker value={total} />
              </span>
              <div className="flex items-center gap-2">
                <span>Proceed</span>
                <div className="bg-white/20 p-1.5 rounded-full">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
          ) : isConfirming && !isProcessing ? (
            <motion.div
              key="confirm-options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmOrder}
                className="w-full bg-[#60b246] hover:bg-[#529d3a] text-white py-4 rounded-2xl font-bold text-lg text-center transition-colors shadow-lg shadow-green-500/30 shrink-0"
              >
                Confirm Order
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsConfirming(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-4 rounded-2xl font-bold text-lg text-center transition-colors shrink-0"
              >
                Cancel
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-[#fc8019] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(252,128,25,0.3)]"
            >
              <CheckCircle2 className="w-6 h-6" />
              Order Confirmed!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </>
      )}

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 pb-5 pt-safe bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMap(false)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                Select Location
              </h1>
            </div>
            <div className="flex-1 w-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex flex-col">
              {/* Simulated Map Background */}
              <div
                className="flex-1 w-full opacity-40 mix-blend-multiply dark:mix-blend-screen"
                style={{
                  backgroundImage:
                    "radial-gradient(#cbd5e1 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <MapPin
                  className="w-12 h-12 text-[#fc8019] -mt-12 drop-shadow-xl"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.1)] relative z-20 pb-10">
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-4">
                Choose Delivery Address
              </h3>
              
              <div className="space-y-3 mb-6">
                {[
                  { type: "Home", street: "123 Design Avenue, Tech Park Building A", icon: Home },
                  { type: "Work", street: "456 Innovation Drive, Suite 200", icon: Briefcase },
                  { type: "Other", street: "789 Startup Blvd, Apt 4B", icon: MapPin }
                ].map((addr) => (
                  <div
                    key={addr.type}
                    onClick={() => {
                      setAddressType(addr.type);
                      setDeliveryAddress(addr.street);
                    }}
                    className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                      addressType === addr.type
                        ? "border-[#fc8019] bg-orange-50/50 dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className={`p-2 rounded-full mt-0.5 ${addressType === addr.type ? "bg-orange-100 text-[#fc8019] dark:bg-slate-700" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                      <addr.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{addr.type}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{addr.street}</p>
                    </div>
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0 mt-1">
                      {addressType === addr.type && (
                        <motion.div
                          layoutId="addressRadioCheck"
                          className="w-2.5 h-2.5 rounded-full bg-[#fc8019]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMap(false)}
                className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30"
              >
                Confirm Location
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
