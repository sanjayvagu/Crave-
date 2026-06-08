import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Receipt,
  TicketPercent,
  ChevronRight,
  Wallet,
  CheckCircle2,
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

export const Cart: React.FC<CartProps> = ({
  cart,
  addresses,
  selectedAddressId,
  onSelectAddressId,
  onBack,
  onCheckoutComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"upi" | "cash">("upi");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<string>("No Tip");

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
    if (code) {
      setAppliedCoupon(code);
    }
  };

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
     discountAmount = 50; // simple mock discount
  }

  const tipAmount = selectedTip === "No Tip" ? 0 : itemTotal * (parseInt(selectedTip) / 100);
  const deliveryFee = itemTotal > 0 ? 16.55 : 0;
  const platformFee = 5.0;
  const taxes = itemTotal * 0.05; // govt taxes
  const total = Math.max(0, itemTotal - discountAmount) + deliveryFee + platformFee + taxes + tipAmount;

  if (isProcessing) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-[#60b246] border-t-transparent mb-6"
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
      className="absolute inset-0 flex flex-col h-full bg-[#f8f9fc]"
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] bg-white shadow-sm z-10 shrink-0">
        <button onClick={onBack} className="w-10 h-10 bg-slate-100/80 hover:bg-slate-200 rounded-full flex items-center justify-center text-[#1a2333] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-extrabold text-[#1a2333] text-[22px] tracking-tight leading-none">Checkout</h1>
          <p className="text-slate-500 font-medium text-[13px] mt-1">Truffles & Co. • {cart.reduce((a, b) => a + b.quantity, 0)} items</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 pb-40">
        
        {/* Deliver To */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[#fc8019]" />
            <h3 className="font-bold text-[17px] text-[#1a2333]">Choose Delivery Address</h3>
          </div>
          <div className="space-y-3">
            {addresses.map(a => (
               <div key={a.id} onClick={() => onSelectAddressId(a.id)} className={`p-4 border rounded-2xl cursor-pointer transition-colors ${selectedAddressId === a.id ? 'border-[#fc8019] bg-orange-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                 <div className="flex justify-between">
                   <h4 className="font-bold text-[#1a2333]">{a.label}</h4>
                   {selectedAddressId === a.id && <CheckCircle2 className="w-5 h-5 text-[#fc8019]" />}
                 </div>
                 <p className="text-sm text-slate-500 mt-1">{a.value}</p>
               </div>
            ))}
          </div>
        </div>

        {/* Offers & Benefits */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <TicketPercent className="w-6 h-6 text-[#fc8019]" />
            <h3 className="font-bold text-[17px] text-[#1a2333]">Offers & Benefits</h3>
          </div>
          {appliedCoupon ? (
             <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-bold text-[15px] uppercase tracking-tight">'{appliedCoupon}' APPLIED</p>
                  <p className="text-green-600 text-sm font-medium mt-0.5">You saved ₹{discountAmount.toFixed(0)}</p>
                </div>
                <button onClick={() => setAppliedCoupon(null)} className="text-green-800 bg-green-200/50 hover:bg-green-200 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Remove</button>
             </div>
          ) : (
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="ENTER COUPON CODE" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 min-w-0 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#1a2333] placeholder:text-slate-400 placeholder:font-medium outline-none uppercase focus:border-slate-400 transition-colors" 
              />
              <button onClick={handleApplyCoupon} className="bg-slate-500 hover:bg-slate-600 text-white font-bold px-6 rounded-2xl transition-colors shrink-0">Apply</button>
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <h3 className="font-bold text-[16px] text-[#1a2333] mb-4">Add a tip for the delivery partner</h3>
          <div className="flex gap-2">
            {['No Tip', '10%', '15%', '20%'].map(tip => (
              <button 
                key={tip}
                onClick={() => setSelectedTip(tip)}
                className={`flex-1 py-3 rounded-2xl font-bold text-[14px] border ${selectedTip === tip ? 'border-[#fc8019] text-[#fc8019] bg-orange-50/50' : 'border-slate-200 text-[#1a2333] hover:border-slate-300'}`}
              >
                {tip}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
           <div className="flex items-center gap-3 mb-5">
              <Wallet className="w-6 h-6 text-[#fc8019]" />
              <h3 className="font-bold text-[17px] text-[#1a2333]">Payment Method</h3>
           </div>
           <div className="space-y-4">
             <div className="flex items-start gap-4 cursor-pointer" onClick={() => setSelectedPaymentMethod("upi")}>
                <div className={`w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center shrink-0 mt-0.5 ${selectedPaymentMethod === "upi" ? "border-[#60b246]" : "border-slate-300"}`}>
                  {selectedPaymentMethod === "upi" && <div className="w-2.5 h-2.5 bg-[#60b246] rounded-full"></div>}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100">
                   <h4 className="font-bold text-[#1a2333] text-[15px]">UPI, cards, net banking & wallets</h4>
                   <p className="text-slate-500 text-[13px] font-medium mt-1">Pay safely with Razorpay</p>
                </div>
             </div>
             
             <div className="flex items-start gap-4 cursor-pointer" onClick={() => setSelectedPaymentMethod("cash")}>
                <div className={`w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center shrink-0 mt-0.5 ${selectedPaymentMethod === "cash" ? "border-[#60b246]" : "border-slate-300"}`}>
                  {selectedPaymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-[#60b246] rounded-full"></div>}
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-[#1a2333] text-[15px]">Cash on delivery</h4>
                   <p className="text-slate-500 text-[13px] font-medium mt-1 leading-relaxed">Pay cash or UPI when your rider arrives</p>
                </div>
             </div>
           </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] mb-4">
           <div className="flex items-center gap-3 mb-4">
              <Receipt className="w-6 h-6 text-[#fc8019]" />
              <h3 className="font-bold text-[17px] text-[#1a2333]">Bill Details</h3>
           </div>
           
           <div className="space-y-3 px-1">
             <div className="flex justify-between text-slate-500 font-medium text-[14px]">
               <span>Item Total</span>
               <span className="text-[#1a2333]">₹{itemTotal.toFixed(2)}</span>
             </div>
             {discountAmount > 0 && (
               <div className="flex justify-between text-green-600 font-bold text-[14px]">
                 <span>Item Discount</span>
                 <span>-₹{discountAmount.toFixed(2)}</span>
               </div>
             )}
             <div className="flex justify-between text-slate-500 font-medium text-[14px]">
               <span>Delivery Fee</span>
               <span className="text-[#1a2333]">₹{deliveryFee.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-slate-500 font-medium text-[14px]">
               <span>Platform Fee</span>
               <span className="text-[#1a2333]">₹{platformFee.toFixed(2)}</span>
             </div>
             {tipAmount > 0 && (
               <div className="flex justify-between text-slate-500 font-medium text-[14px]">
                 <span>Delivery Tip</span>
                 <span className="text-[#1a2333]">₹{tipAmount.toFixed(2)}</span>
               </div>
             )}
             <div className="flex justify-between items-center text-slate-500 font-medium pb-4 border-b border-dashed border-slate-200 text-[14px]">
               <span className="flex items-center gap-1">Govt Taxes <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" /></span>
               <span className="text-[#1a2333]">₹{taxes.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center pt-2 font-extrabold text-[#1a2333] text-[18px]">
               <span>To Pay</span>
               <span>₹{total.toFixed(2)}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 w-full left-0 bg-gradient-to-t from-[#f8f9fc] via-[#f8f9fc] to-transparent pt-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-5 z-40 pointer-events-none">
        <motion.button
          onClick={handleConfirmOrder}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#60b246] hover:bg-[#529d3a] text-white py-4 rounded-[1.25rem] font-bold text-[17px] flex items-center justify-between px-5 shadow-[0_8px_30px_rgb(96,178,70,0.3)] pointer-events-auto transition-colors"
        >
          <span className="flex items-center">
            Pay ₹{total.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <span>Proceed</span>
            <div className="bg-white/20 p-1 rounded-full">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};;
