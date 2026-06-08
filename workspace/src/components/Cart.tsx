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
  Banknote,
  Smartphone,
  Check,
  Trash2,
  Wallet
} from "lucide-react";
import confetti from "canvas-confetti";
import { CartItem, MenuItem, Address } from "../types";

interface CartProps {
  cart: CartItem[];
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddressId: (id: string) => void;
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
  addresses,
  selectedAddressId,
  onSelectAddressId,
  onBack,
  onCheckoutComplete,
  onUpdateCart,
  onUpdateInstructions,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "cash">("upi");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("7032262284");

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
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playBeep = (freq: number, startTime: number, duration: number) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

          gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
          gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + startTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + startTime + duration);

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
    }, 2000);
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "CRAVE20" || code === "SAVE10" || code === "YUM50") {
      setAppliedCoupon(code);
      setCouponError(false);
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2000);
    }
  };

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon === "CRAVE20") {
    discountAmount = itemTotal * 0.2;
  } else if (appliedCoupon === "SAVE10") {
    discountAmount = itemTotal * 0.1;
  } else if (appliedCoupon === "YUM50") {
    discountAmount = 50;
  }

  const deliveryFee = itemTotal > 0 ? 16.55 : 0;
  const platformFee = 5.0;
  const taxes = itemTotal * 0.05; // govt taxes
  const total = Math.max(0, itemTotal - discountAmount) + deliveryFee + platformFee + taxes;
  const freeDeliveryThreshold = 299;
  const deliveryShortfall = freeDeliveryThreshold - itemTotal;

  if (isProcessing) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-[#e23744] border-t-transparent mb-6"
        />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Processing Payment...</h2>
        <p className="text-slate-500 text-center">Securely verifying your transaction.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%", zIndex: 20 }}
      animate={{ opacity: 1, x: 0, zIndex: 20 }}
      exit={{ opacity: 0, x: "100%", zIndex: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col h-full bg-[#fcf9f5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] bg-white shadow-sm z-10 shrink-0">
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} className="p-2 -ml-2 text-slate-800">
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        <div className="text-center">
          <h1 className="font-bold text-[19px] text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Free Food Corner</p>
        </div>
        <button onClick={onBack} className="p-2 -mr-2 text-[#e23744]">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-32">
        {/* Your Order */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-900/10 overflow-hidden">
          <div className="p-4 border-b border-orange-900/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=150&h=150&fit=crop" alt="Food" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-slate-800">Your Order</h3>
                <p className="text-xs text-slate-500">Free Food Corner</p>
              </div>
            </div>
            <div className="bg-red-50 text-[#e23744] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-red-100">
              <Clock className="w-3 h-3" /> 18 min
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center shrink-0 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] text-slate-800 font-medium">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">₹{item.price} each</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <div className="flex items-center bg-red-50 border border-red-200 rounded-lg p-0.5 shadow-sm">
                        <button onClick={() => onUpdateCart(item, -1)} className="p-1 px-2 text-[#e23744] hover:bg-white rounded-md transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-[13px] font-bold w-6 text-center text-[#e23744]">{item.quantity}</span>
                        <button onClick={() => onUpdateCart(item, 1)} className="p-1 px-2 text-[#e23744] hover:bg-white rounded-md transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                     </div>
                     <span className="font-bold text-[14px] text-slate-800 mt-1">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-orange-900/10">
            <button onClick={onBack} className="flex items-center gap-2 text-[#e23744] font-bold text-sm tracking-tight w-full">
              <Plus className="w-4 h-4" /> Add more items
              <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />
            </button>
          </div>
        </div>

        {/* Free Delivery Banner */}
        {deliveryShortfall > 0 && (
           <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100 flex items-center gap-3">
             <div className="text-[#e23744]">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
             </div>
             <div className="flex-1">
               <p className="text-[#e23744] font-bold text-sm">Add ₹{deliveryShortfall.toFixed(0)} more for FREE delivery!</p>
               <div className="w-full bg-red-200 rounded-full h-1 mt-2">
                 <div className="bg-[#e23744] h-1 rounded-full" style={{ width: `${Math.min(100, (itemTotal / freeDeliveryThreshold) * 100)}%` }}></div>
               </div>
             </div>
           </div>
        )}

        {/* Delivery To */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-900/10">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <div className="bg-[#e23744] p-1.5 rounded-full text-white shadow-sm border-2 border-red-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[15px] text-slate-800">Delivery To</h3>
             </div>
             <button className="text-[#e23744] text-[13px] font-bold tracking-tight">Change</button>
          </div>
          <div className="flex gap-4 items-start pl-2">
             <div className="w-20 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative border border-slate-200">
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=17.3850,78.4867&zoom=14&size=200x200&sensor=false&style=feature:all|element:labels|visibility:off" alt="Map" className="w-full h-full object-cover opacity-70" />
                <MapPin className="w-5 h-5 text-[#e23744] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-[#e23744] drop-shadow-md" />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h4 className="font-bold text-slate-800 tracking-tight">{addresses.find(a => a.id === selectedAddressId)?.label || "Home"}</h4>
                   <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 flex items-center rounded"><ArrowLeft className="w-2.5 h-2.5 inline mr-0.5 rotate-[-45deg]" /> 3.3 km</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pr-6 line-clamp-2">
                  {addresses.find(a => a.id === selectedAddressId)?.value || "FFPJ+7C5, 25/254, Sanjeev Nagar, Srinivasa Nagar, Nandyala, Andhr..."}
                </p>
             </div>
          </div>
        </div>

        {/* Offers & Coupons */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-900/10 p-4">
           <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-50 p-1.5 rounded-lg text-orange-400">
                <TicketPercent className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-800">Offers & Coupons</h3>
           </div>
           
           {appliedCoupon ? (
             <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-sm uppercase tracking-tight">'{appliedCoupon}' applied</p>
                    <p className="text-green-600 text-xs font-medium">You saved ₹{discountAmount.toFixed(0)}</p>
                  </div>
                </div>
                <button onClick={() => setAppliedCoupon(null)} className="text-red-500 font-bold text-xs hover:underline">Remove</button>
              </div>
           ) : (
             <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider">
                 <span>AVAILABLE OFFERS</span>
                 <span>2/2</span>
               </div>
               <div className="flex gap-2 relative overflow-hidden rounded-xl border border-orange-100 shadow-sm">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white px-4 py-3 text-sm font-medium outline-none placeholder:text-slate-400 text-slate-800 uppercase"
                  />
                  <button onClick={handleApplyCoupon} disabled={!couponInput.trim()} className="bg-red-50/50 hover:bg-red-100/50 text-[#e23744] font-bold px-6 py-3 text-sm transition-colors uppercase border-l border-orange-50">
                    Apply
                  </button>
               </div>
               {couponError && <p className="text-[10px] text-red-500 font-bold -mt-2 ml-2">Invalid coupon code</p>}
               
               {/* Fixed coupon card */}
               <div className="relative rounded-xl border border-orange-100 mt-2 overflow-hidden flex shadow-sm bg-white cursor-pointer" onClick={() => { setCouponInput("YUM50"); handleApplyCoupon(); }}>
                  <div className="bg-[#fcb300] w-20 flex flex-col items-center justify-center text-slate-900 border-r border-dashed border-orange-200 relative mb-[-1px]">
                     <span className="font-extrabold text-[22px] tracking-tighter leading-none mt-1">₹50</span>
                     <span className="text-[10px] font-bold">OFF</span>
                     <div className="w-3 h-3 bg-white rounded-full absolute -right-1.5 -top-1.5"></div>
                     <div className="w-3 h-3 bg-white rounded-full absolute -right-1.5 -bottom-1.5"></div>
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between items-start relative">
                     <div className="flex justify-between w-full items-start">
                        <span className="text-[#fc8019] text-[11px] font-bold uppercase tracking-wider bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">YUM50</span>
                        <span className="text-orange-600 bg-orange-100/50 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Min ₹299</span>
                     </div>
                     <p className="text-[11px] text-slate-600 font-medium leading-tight mt-2 w-[85%]">₹50 off on your order above 299!</p>
                     <button className="bg-[#e23744] hover:bg-[#c9303c] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase absolute bottom-3 right-3 shadow-sm transition-colors">Apply</button>
                  </div>
               </div>
             </div>
           )}
        </div>

        {/* Receiver mobile number */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-900/10 p-4 relative">
           <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-50 p-1.5 rounded-lg text-[#e23744] shadow-sm border border-red-100">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-800">Receiver mobile number</h3>
           </div>
           <div>
             <input
               type="text"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-slate-300 transition-colors shadow-sm"
             />
           </div>
           <div className="flex justify-end mt-2">
             <button className="text-[#e23744] text-xs font-bold tracking-tight">Use my number</button>
           </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-900/10 p-4">
           <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-50 p-1.5 rounded-lg text-[#e23744] shadow-sm border border-red-100">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-800">Payment method</h3>
           </div>
           
           <div className="space-y-4">
             <div className="flex items-start gap-4 cursor-pointer" onClick={() => setSelectedPaymentMethod("upi")}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedPaymentMethod === "upi" ? "border-[#e23744]" : "border-slate-300"}`}>
                  {selectedPaymentMethod === "upi" && <div className="w-2.5 h-2.5 bg-[#e23744] rounded-full"></div>}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100">
                   <h4 className="font-medium text-slate-800 text-[14px]">UPI, cards, net banking & wallets</h4>
                   <p className="text-slate-400 text-[11px] font-medium mt-1">Pay now with Razorpay</p>
                </div>
             </div>
             
             <div className="flex items-start gap-4 cursor-pointer" onClick={() => setSelectedPaymentMethod("cash")}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedPaymentMethod === "cash" ? "border-[#e23744]" : "border-slate-300"}`}>
                  {selectedPaymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-[#e23744] rounded-full"></div>}
                </div>
                <div className="flex-1">
                   <h4 className="font-medium text-slate-800 text-[14px]">Cash on delivery</h4>
                   <p className="text-slate-400 text-[11px] font-medium mt-1 leading-relaxed">Pay cash or UPI when your rider arrives (they can show a QR)</p>
                </div>
             </div>
           </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-900/10 p-4">
           <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-50 p-1.5 rounded-lg text-green-600 shadow-sm border border-green-100">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-800">Bill Details</h3>
           </div>
           
           <div className="space-y-3 px-1 text-[13px]">
             <div className="flex justify-between text-slate-600">
               <span>Item Total</span>
               <span className="font-medium text-slate-800">₹{itemTotal.toFixed(0)}</span>
             </div>
             {discountAmount > 0 && (
               <div className="flex justify-between text-green-600 font-medium">
                 <span>Item Discount</span>
                 <span>-₹{discountAmount.toFixed(0)}</span>
               </div>
             )}
             <div className="flex justify-between text-slate-600">
               <span>Delivery Fee</span>
               <span className="font-medium text-slate-800">₹{deliveryFee.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-slate-600">
               <span>Platform Fee</span>
               <span className="font-medium text-slate-800">₹{platformFee.toFixed(0)}</span>
             </div>
             <div className="flex justify-between items-center text-slate-600 pb-3 border-b border-dashed border-slate-200">
               <span className="flex items-center gap-1">Govt Taxes <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" /></span>
               <span className="font-medium text-slate-800">₹{taxes.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center pt-1 font-bold text-slate-900 text-[15px]">
               <span>To Pay</span>
               <span>₹{total.toFixed(2)}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Slide to Pay Area */}
      <div className="bg-white border-t border-slate-100 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0 rounded-t-2xl shadow-[0_-10px_20px_rgb(0,0,0,0.03)] absolute bottom-0 w-full z-30">
        <motion.button
          onClick={handleConfirmOrder}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#e23744] hover:bg-[#c9303c] shadow-lg shadow-red-500/20 text-white py-[16px] rounded-xl font-bold flex items-center justify-center gap-2 transition-colors relative overflow-hidden"
        >
          <span className="text-[17px] tracking-tight">Pay ₹{total.toFixed(2)}</span>
          <ChevronRight className="w-5 h-5 absolute right-4 opacity-80" />
        </motion.button>
      </div>
    </motion.div>
  );
};
