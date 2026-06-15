import React, { useState, useEffect } from "react";
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
  FileText,
  Check,
  Upload,
  AlertCircle,
  Timer,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CartItem, MenuItem } from "../types";

interface CartProps {
  cart: CartItem[];
  serviceType?: "food" | "grocery" | "pharmacy";
  onBack: () => void;
  onCheckoutComplete: () => void;
  onUpdateCart: (item: MenuItem, delta: number) => void;
  onUpdateInstructions: (itemId: string, instructions: string) => void;
}

const RECOMMENDATIONS: Record<"food" | "grocery" | "pharmacy", MenuItem[]> = {
  food: [
    { id: "f-rec-1", restaurantId: "rec", name: "Coke Pet Bottle", description: "750ml", price: 40, isVeg: true, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200" },
    { id: "f-rec-2", restaurantId: "rec", name: "Fries (Large)", description: "Crispy golden fries", price: 90, isVeg: true, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=200" },
    { id: "f-rec-3", restaurantId: "rec", name: "Extra Cheese Dip", description: "Spicy cheese dip", price: 25, isVeg: true, image: "https://images.unsplash.com/photo-1594519983424-9dfa86ce917f?auto=format&fit=crop&q=80&w=200" },
  ],
  grocery: [
    { id: "g-rec-1", restaurantId: "rec", name: "Facial Tissues", description: "100 Pulls, 2 Ply", price: 65, isVeg: true, image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=200" },
    { id: "g-rec-2", restaurantId: "rec", name: "Reusable Bag", description: "Eco-friendly cloth bag", price: 20, isVeg: true, image: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&q=80&w=200" },
    { id: "g-rec-3", restaurantId: "rec", name: "Wet Wipes", description: "Aloe Vera, 30pcs", price: 45, isVeg: true, image: "https://images.unsplash.com/photo-1618141443463-b81b83141f10?auto=format&fit=crop&q=80&w=200" },
  ],
  pharmacy: [
    { id: "p-rec-1", restaurantId: "rec", name: "Hand Sanitizer", description: "50ml, 70% Alcohol", price: 50, isVeg: true, image: "https://images.unsplash.com/photo-1584483768567-bea2499c8942?auto=format&fit=crop&q=80&w=200" },
    { id: "p-rec-2", restaurantId: "rec", name: "Disposable Mask", description: "N95, Single Pack", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1584033284078-436ed5facbc4?auto=format&fit=crop&q=80&w=200" },
    { id: "p-rec-3", restaurantId: "rec", name: "Vitamin C Tablets", description: "Chewable, 15 tabs", price: 40, isVeg: true, image: "https://images.unsplash.com/photo-1550572017-edb702ec8c9b?auto=format&fit=crop&q=80&w=200" },
  ],
};

const getTheme = (type?: "food" | "grocery" | "pharmacy" | "multi" | null) => {
  switch (type) {
    case "grocery":
      return {
        colorHex: "#16a34a",
        bgLight: "bg-green-50",
        bgLightest: "bg-green-50/50",
        text: "text-[#16a34a]",
        border: "border-[#16a34a]",
        bg: "bg-[#16a34a]",
        bgHover: "hover:bg-[#15803d]",
        shadowBtn: "shadow-green-500/30",
        title: "Grocery Cart",
        subtitle: "Fresh Groceries",
        deliveryTime: "15-20",
        browseText: "Browse Groceries"
      };
    case "pharmacy":
      return {
        colorHex: "#20615b",
        bgLight: "bg-teal-50",
        bgLightest: "bg-teal-50/50",
        text: "text-[#20615b]",
        border: "border-[#20615b]",
        bg: "bg-[#20615b]",
        bgHover: "hover:bg-[#134e4a]",
        shadowBtn: "shadow-teal-500/30",
        title: "Pharmacy Cart",
        subtitle: "Medicines & Essentials",
        deliveryTime: "30-45",
        browseText: "Browse Medicines"
      };
    case "multi":
      return {
        colorHex: "#3b82f6",
        bgLight: "bg-blue-50",
        bgLightest: "bg-blue-50/50",
        text: "text-[#3b82f6]",
        border: "border-[#3b82f6]",
        bg: "bg-[#3b82f6]",
        bgHover: "hover:bg-[#2563eb]",
        shadowBtn: "shadow-blue-500/30",
        title: "Checkout",
        subtitle: "Multi-Service Order",
        deliveryTime: "30-45",
        browseText: "Browse More"
      };
    default:
      return {
        colorHex: "#fc8019",
        bgLight: "bg-orange-50",
        bgLightest: "bg-orange-50/50",
        text: "text-[#fc8019]",
        border: "border-[#fc8019]",
        bg: "bg-[#fc8019]",
        bgHover: "hover:bg-[#ea580c]",
        shadowBtn: "shadow-[rgba(252,128,25,0.3)]",
        title: "Food Delivery Cart",
        subtitle: "Truffles & Co.",
        deliveryTime: "35-40",
        browseText: "Browse Restaurants"
      };
  }
};

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
  serviceType,
  onBack,
  onCheckoutComplete,
  onUpdateCart,
  onUpdateInstructions,
}) => {
  const itemTypeCounts = {
    food: cart.filter((i) => !i.id.startsWith("g") && !i.id.startsWith("p")).length,
    grocery: cart.filter((i) => i.id.startsWith("g")).length,
    pharmacy: cart.filter((i) => i.id.startsWith("p")).length,
  };
  
  const dominantServiceType = cart.length > 0
    ? (Object.entries(itemTypeCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as "food" | "grocery" | "pharmacy")
    : serviceType;

  const activeCategoriesCount = Object.values(itemTypeCounts).filter((c) => c > 0).length;
  const isMultiService = activeCategoriesCount > 1;

  const theme = getTheme(isMultiService ? "multi" : dominantServiceType);

  const [activeFilter, setActiveFilter] = useState<"all" | "food" | "grocery" | "pharmacy">("all");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
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

  const [offerTimeLeft, setOfferTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (orderPlaced || cart.length === 0) return;
    const timer = setInterval(() => {
      setOfferTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [orderPlaced, cart.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    // Simulate order processing time
    setTimeout(() => {
      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.colorHex, "#60b246", "#ffffff"],
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
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 100]);
        }
        setOrderPlaced(true);
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

  const handleProceedToConfirm = () => {
    if (itemTypeCounts.grocery > 0 && !ageVerified) {
      alert("Please verify your age for grocery items to proceed.");
      return;
    }
    setIsConfirming(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%", zIndex: 20 }}
      animate={{ opacity: 1, y: 0, zIndex: 20 }}
      exit={{ opacity: 0, y: "100%", zIndex: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 "
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] bg-white  shadow-sm z-10 shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={orderPlaced ? onCheckoutComplete : onBack}
          className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center text-slate-700 "
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-slate-800  tracking-tight">
            {orderPlaced ? "Order Summary" : theme.title}
          </h1>
          <p className="text-xs text-slate-500  font-medium">
            {orderPlaced ? "Invoice generated successfully" : `${theme.subtitle} • ${cart.length} items`}
          </p>
        </div>
        {!orderPlaced && cart.length > 0 && offerTimeLeft > 0 && (
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Offer ends in</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${theme.bgLight} ${theme.text} border ${theme.border} bg-opacity-30`}>
              <Timer className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono tracking-tight">{formatTime(offerTimeLeft)}</span>
            </div>
          </div>
        )}
      </div>

      {orderPlaced ? (
        <>
          <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="text-center mb-6">
             <h2 className="text-2xl font-bold text-slate-800">Order Confirmed!</h2>
             <p className="text-slate-500 text-sm mt-1">Your items will be delivered in {theme.deliveryTime} mins.</p>
          </div>

          {(["food", "grocery", "pharmacy"] as const).map((groupType) => {
            const groupItems = cart.filter((item) => {
              if (groupType === "grocery") return item.id.startsWith("g");
              if (groupType === "pharmacy") return item.id.startsWith("p");
              return !item.id.startsWith("g") && !item.id.startsWith("p");
            });

            if (groupItems.length === 0) return null;

            const groupTheme = getTheme(groupType);
            const groupTotal = groupItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

            return (
              <div key={groupType} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`${groupTheme.bgLight} p-2 rounded-lg`}>
                      <Receipt className={`w-4 h-4 ${groupTheme.text}`} />
                    </div>
                    <span className={`font-bold ${groupTheme.text}`}>{groupTheme.title}</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">₹{groupTotal}</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  {groupItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex gap-2">
                        <span className="text-slate-500 font-medium">{item.quantity}x</span>
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-slate-800 font-medium w-16 text-right">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full flex justify-end">
                  <button className={`px-4 py-2 text-sm font-bold rounded-xl border flex items-center gap-2 transition-colors ${groupTheme.bgLight} ${groupTheme.text} ${groupTheme.border}`}>
                    <FileText className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            );
          })}

          </div>
          <div className="bg-white px-5 pt-5 pb-32 shrink-0 border-t border-slate-100 shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-10 w-full relative">
             <button
                onClick={onCheckoutComplete}
                className="w-full bg-[#60b246] hover:bg-[#529d3a] text-white py-4 rounded-2xl font-bold text-lg text-center transition-colors shadow-lg shadow-green-500/30"
              >
                Back to Home
              </button>
          </div>
        </>
      ) : cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50  pb-32">
          <div className="w-24 h-24 bg-slate-200  rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-400 " />
          </div>
          <h2 className="text-xl font-bold text-slate-800  mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500  text-center mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`w-full max-w-[250px] text-white font-bold py-4 rounded-xl shadow-lg ${theme.bg} ${theme.shadowBtn}`}
          >
            {theme.browseText}
          </motion.button>
        </div>
      ) : (
        <>
          {isMultiService && (
            <div className="flex gap-2 px-5 py-3 bg-white border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  activeFilter === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {itemTypeCounts.food > 0 && (
                <button
                  onClick={() => setActiveFilter("food")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    activeFilter === "food" ? "bg-[#fc8019] text-white" : "bg-orange-50 text-[#fc8019]"
                  }`}
                >
                  Food
                </button>
              )}
              {itemTypeCounts.grocery > 0 && (
                <button
                  onClick={() => setActiveFilter("grocery")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    activeFilter === "grocery" ? "bg-[#16a34a] text-white" : "bg-green-50 text-[#16a34a]"
                  }`}
                >
                  Grocery
                </button>
              )}
              {itemTypeCounts.pharmacy > 0 && (
                <button
                  onClick={() => setActiveFilter("pharmacy")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    activeFilter === "pharmacy" ? "bg-[#20615b] text-white" : "bg-teal-50 text-[#20615b]"
                  }`}
                >
                  Pharmacy
                </button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Deliver To Card (Glassmorphic) */}
        <div className="bg-white  rounded-2xl p-4 shadow-sm border border-slate-100 ">
          <div className="flex items-start gap-3">
            <div className={`${theme.bgLight} p-2 rounded-lg ${theme.text}`}>
              {addressType === "Home" ? <Home className="w-5 h-5" /> : addressType === "Work" ? <Briefcase className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 ">
                Deliver to {addressType}
              </h3>
              <p className="text-sm text-slate-500  mt-1 line-clamp-1">
                {deliveryAddress}
              </p>
              <p className="text-sm font-medium mt-1 text-slate-700 ">
                {theme.deliveryTime} mins delivery time
              </p>
            </div>
            <button
              onClick={() => setShowMap(true)}
              className={`${theme.text} text-sm font-bold uppercase tracking-wider`}
            >
              Change
            </button>
          </div>
        </div>

        {/* Apply Coupon */}
        <div className="bg-white  rounded-2xl p-5 shadow-sm border border-slate-100  relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800  text-sm flex items-center gap-2">
              <TicketPercent className={`w-5 h-5 ${theme.text}`} />
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
                      color: "bg-blue-50 text-blue-600 border-blue-200   ",
                    },
                    {
                      code: "FIRST100",
                      title: "₹100 OFF",
                      desc: "Min purchase ₹500",
                      color: "bg-purple-50 text-purple-600 border-purple-200   ",
                    },
                    {
                      code: "SAVE10",
                      title: "10% OFF",
                      desc: "Min purchase ₹399",
                      color: "bg-orange-50 text-orange-600 border-orange-200   ",
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
                      className={`w-full bg-slate-50  border rounded-xl px-4 py-3 text-sm font-medium uppercase outline-none transition-colors ${
                        couponError
                          ? "border-red-300 text-red-600 focus:border-red-500"
                          : `border-slate-200 text-slate-800 focus:${theme.border}`
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
                  className="text-slate-400  hover:text-slate-600  p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Tip */}
        <div className="bg-white  rounded-2xl p-5 shadow-sm border border-slate-100 ">
          <h3 className="font-bold text-slate-800  mb-3 text-sm">
            Add a tip for the delivery partner
          </h3>
          <div className="flex gap-3">
            {[0, 10, 15, 20].map((percentage) => (
              <button
                key={percentage}
                onClick={() => setTipPercentage(percentage)}
                className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                  tipPercentage === percentage
                    ? `${theme.border} ${theme.bgLight} ${theme.text}`
                    : "border-slate-200  text-slate-600  hover:border-slate-300"
                }`}
              >
                {percentage === 0 ? "No Tip" : `${percentage}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Selection */}
        <div className="bg-white  rounded-2xl p-5 shadow-sm border border-slate-100 ">
          <h3 className="font-bold text-slate-800  mb-4 flex items-center gap-2">
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
                    ? `${theme.border} ${theme.bgLightest} `
                    : "border-slate-200  hover:bg-slate-50 :bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id
                        ? `${theme.bgLight} ${theme.text}`
                        : "bg-slate-100  text-slate-500"
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 ">
                    {method.id}
                  </span>
                </div>
                <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300 ">
                  {paymentMethod === method.id && (
                    <motion.div
                      layoutId="radioCheck"
                      className={`w-2.5 h-2.5 rounded-full ${theme.bg}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white  rounded-2xl p-5 shadow-sm border border-slate-100 ">
          <h3 className="font-bold text-slate-800  mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400 " />
            Order Summary
          </h3>

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {(["food", "grocery", "pharmacy"] as const).map((groupType) => {
                if (activeFilter !== "all" && activeFilter !== groupType) return null;

                const groupItems = cart.filter((item) => {
                  if (groupType === "grocery") return item.id.startsWith("g");
                  if (groupType === "pharmacy") return item.id.startsWith("p");
                  return !item.id.startsWith("g") && !item.id.startsWith("p");
                });

                if (groupItems.length === 0) return null;

                const groupTheme = getTheme(groupType);

                return (
                  <motion.div
                    key={groupType}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`border border-slate-100 rounded-2xl overflow-hidden`}
                  >
                    <div className={`${groupTheme.bgLight} px-4 py-3 flex items-center justify-between border-b border-slate-100`}>
                      <span className={`font-bold text-sm ${groupTheme.text}`}>{groupTheme.title}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 bg-white rounded-md ${groupTheme.text} shadow-sm`}>
                        {groupItems.length} {groupItems.length === 1 ? 'ITEM' : 'ITEMS'}
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      {groupItems.map((item) => {
                        const itemType = groupType;
                        const itemTheme = groupTheme;
                        const placeholderText = itemType === "grocery"
                          ? "Add instructions (e.g. pick ripe fruits)"
                          : itemType === "pharmacy"
                          ? "Add instructions (e.g. check expiry date)"
                          : "Add special instructions (e.g. extra cheese)";

                        return (
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
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-slate-800  text-sm font-medium">
                                      {item.name}
                                    </h4>
                                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md ${itemTheme.bgLight} ${itemTheme.text}`}>
                                      {itemType}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => onUpdateCart(item, -1)}
                                      className="w-8 h-8 shrink-0 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </motion.button>
                                    <span className="text-sm font-medium w-6 text-center">
                                      {item.quantity}
                                    </span>
                                    <motion.button
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => onUpdateCart(item, 1)}
                                      className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center ${itemTheme.border} ${itemTheme.text} ${itemTheme.bgLightest}`}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                              <div className="font-medium text-slate-800  text-sm">
                                ₹<NumberTicker value={item.price * item.quantity} />
                              </div>
                            </div>
                            <div className="ml-6 mr-10 relative">
                              <input
                                type="text"
                                placeholder={placeholderText}
                                value={item.instructions || ""}
                                onChange={(e) => onUpdateInstructions?.(item.id, e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:${itemTheme.border} outline-none transition-colors`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pharmacy Prescription */}
          {itemTypeCounts.pharmacy > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 my-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#20615b]" />
                Prescription (Optional)
              </h3>
              <p className="text-xs text-slate-500 mb-3">Upload a valid prescription for the medicine in your cart, if applicable.</p>
              <button 
                onClick={() => setPrescriptionUploaded(!prescriptionUploaded)}
                className={`w-full py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  prescriptionUploaded
                    ? "bg-teal-50 border-[#20615b] text-[#20615b]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {prescriptionUploaded ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                {prescriptionUploaded ? "Prescription Verified" : "Upload Prescription"}
              </button>
            </div>
          )}

          {/* Grocery Age Verification */}
          {itemTypeCounts.grocery > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 my-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#16a34a]" />
                Age Verification
              </h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input type="checkbox" className="sr-only" checked={ageVerified} onChange={() => setAgeVerified(!ageVerified)} />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${ageVerified ? "bg-[#16a34a] border-[#16a34a]" : "bg-white border-slate-300"}`}>
                    {ageVerified && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm that I am aged 18 or over and am legally eligible to purchase age-restricted grocery items.
                </span>
              </label>
            </div>
          )}

          {/* Frequently Bought Together */}
          {!orderPlaced && cart.length > 0 && dominantServiceType && RECOMMENDATIONS[dominantServiceType as keyof typeof RECOMMENDATIONS] && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 my-4">
              <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" />
                Frequently Bought Together
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x hide-scrollbar">
                {RECOMMENDATIONS[dominantServiceType as keyof typeof RECOMMENDATIONS].map((item) => {
                  const cartItem = cart.find(c => c.id === item.id);
                  return (
                    <motion.div
                      key={item.id}
                      className="min-w-[140px] max-w-[140px] bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col snap-start shrink-0"
                    >
                      <div className="w-full h-24 bg-slate-200 rounded-xl mb-3 overflow-hidden relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        {item.isVeg !== undefined && (
                          <div className="absolute top-2 right-2 bg-white/90 p-0.5 rounded shadow-sm backdrop-blur-sm">
                            <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">₹{item.price}</span>
                          {cartItem ? (
                            <div className="flex items-center gap-2 bg-slate-200 rounded-lg p-1">
                              <button
                                onClick={() => onUpdateCart(item, -1)}
                                className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => onUpdateCart(item, 1)}
                                className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-[#60b246]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onUpdateCart(item, 1)}
                              className="bg-white border border-[#60b246] text-[#60b246] px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="w-full h-px bg-slate-100  my-4 border-dashed border-t-2 border-slate-200 "></div>

          {/* Bill Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 ">
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
            <div className="flex justify-between text-slate-600 ">
              <span className="flex items-center gap-1">
                Delivery fee <Clock className="w-3 h-3" />
              </span>
              <span className="flex items-center">
                ₹<NumberTicker value={deliveryFee} />
              </span>
            </div>
            <div className="flex justify-between text-slate-600 ">
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
                  className={`flex justify-between ${theme.text} font-medium`}
                >
                  <span>Delivery Tip ({tipPercentage}%)</span>
                  <span className="flex items-center">
                    ₹<NumberTicker value={tipAmount} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full h-px bg-slate-200  my-4"></div>

          <div className="flex justify-between font-bold text-slate-800  text-lg">
            <span>To Pay</span>
            <span className="flex items-center">
              ₹<NumberTicker value={total} />
            </span>
          </div>
        </div>
      </div>

      {/* Slide to Pay Area */}
      <div className="bg-white  border-t border-slate-100  px-5 pt-6 pb-32 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          {!isConfirming && !isProcessing ? (
            <motion.button
              key="proceed-btn"
              onClick={handleProceedToConfirm}
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
                className="w-full bg-slate-100  hover:bg-slate-200 :bg-slate-700 text-slate-700  py-4 rounded-2xl font-bold text-lg text-center transition-colors shrink-0"
              >
                Cancel
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-full ${theme.bg} text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)]`}
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
            className="absolute inset-0 z-[100] flex flex-col bg-slate-50  overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] bg-white  shadow-sm z-10 shrink-0 border-b border-slate-100 ">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMap(false)}
                className="w-10 h-10 rounded-full bg-slate-100  flex items-center justify-center text-slate-700 "
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="font-bold text-lg text-slate-800  tracking-tight">
                Select Location
              </h1>
            </div>
            <div className="flex-1 w-full bg-slate-200  relative overflow-hidden flex flex-col">
              {/* Simulated Map Background */}
              <div
                className="flex-1 w-full opacity-40 mix-blend-multiply "
                style={{
                  backgroundImage:
                    "radial-gradient(#cbd5e1 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <MapPin
                  className={`w-12 h-12 ${theme.text} -mt-12 drop-shadow-xl`}
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="bg-white  p-6 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.1)] relative z-20 pb-10">
              <h3 className="font-bold text-xl text-slate-800  mb-4">
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
                        ? `${theme.border} ${theme.bgLightest} `
                        : "border-slate-200  hover:bg-slate-50 :bg-slate-800/50"
                    }`}
                  >
                    <div className={`p-2 rounded-full mt-0.5 ${addressType === addr.type ? `${theme.bgLight} ${theme.text} ` : "bg-slate-100 text-slate-500 "}`}>
                      <addr.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 ">{addr.type}</h4>
                      <p className="text-sm text-slate-500  mt-0.5 leading-snug">{addr.street}</p>
                    </div>
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-300  shrink-0 mt-1">
                      {addressType === addr.type && (
                        <motion.div
                          layoutId="addressRadioCheck"
                          className={`w-2.5 h-2.5 rounded-full ${theme.bg}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMap(false)}
                className={`w-full ${theme.bg} text-white font-bold py-4 rounded-xl shadow-lg ${theme.shadowBtn}`}
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
