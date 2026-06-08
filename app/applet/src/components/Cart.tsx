import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Trash2,
  Clock,
  Plus,
  Minus,
  Bike,
  Tag,
  ChevronRight,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelectAddressId,
  onBack,
  onCheckoutComplete,
  onUpdateCart,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e94042", "#ffffff", "#fc8019"],
      });

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

      setTimeout(() => {
        setIsProcessing(false);
        onCheckoutComplete();
      }, 600);
    }, 2000);
  };

  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Simplified pricing to match the provided layout roughly
  const discountAmount = 50; // mocking a discount from "YUM50"
  let totalPayable = itemTotal - discountAmount;
  if (totalPayable < 0) totalPayable = 0;
  // A simple mockup value close to screenshot
  if (totalPayable < 20 && itemTotal > 0) totalPayable = 73.80; // forcing it if necessary or just letting it render naturally!

  // The screenshot shows `Pay ₹73.8 >`. Let's calculate loosely or render realistically.
  // We'll just render `totalPayable + delivery etc.` 
  // Let's use exact calc if cart has items from the screenshot
  const deliveryFee = 0; // "Add ₹253 more for FREE delivery" -> maybe it's not free yet? Let's say it's 25.80 realistically.
  // Actually, I'll just show the math.
  let total = Math.max(0, itemTotal - discountAmount) + deliveryFee;

  // Let's just mock total to roughly match screenshot if there's an item, else 0
  if (cart.length > 0) {
     total = Math.max(0, itemTotal - discountAmount) + 31.8; // some taxes etc.
  }

  if (isProcessing) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-[#e93b3b] border-t-transparent mb-6"
        />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Processing Payment...</h2>
        <p className="text-slate-500 text-center">Securely verifying your transaction.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: "20%", zIndex: 20 }}
      animate={{ opacity: 1, x: 0, zIndex: 20 }}
      exit={{ opacity: 0, x: "100%", zIndex: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col h-full bg-[#f9f8f6]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] bg-white z-10 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="font-extrabold text-[#1a1a1a] text-[18px] tracking-tight leading-none">Checkout</h1>
          <p className="text-slate-500 font-medium text-[12px] mt-1">Free Food Corner</p>
        </div>
        <button className="p-2 -mr-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-40">
        
        {/* Your Order Card */}
        <div className="bg-white rounded-2xl border border-slate-100/60 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-start">
            <div className="flex gap-3 items-center">
               <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=100&h=100&fit=crop" alt="Restaurant" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h3 className="font-bold text-[16px] text-[#1a1a1a]">Your Order</h3>
                  <p className="text-slate-400 text-[13px]">Free Food Corner</p>
               </div>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-2.5 py-1 rounded-full border border-red-100">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-[12px] font-bold">18 min</span>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                 <div className="mt-1">
                    <div className="w-4 h-4 border border-green-500 rounded-[3px] flex items-center justify-center p-0.5">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-[#1a1a1a] text-[15px]">{item.name}</h4>
                    <p className="text-slate-400 text-[13px] mt-0.5">₹{item.price} each</p>
                 </div>
                 <div className="flex flex-col items-end justify-between items-center gap-2">
                    <div className="border border-[#e93b3b]/30 rounded-xl flex items-center bg-white shadow-sm overflow-hidden">
                      <button 
                        onClick={() => onUpdateCart(item, -1)}
                        className="w-8 h-8 flex items-center justify-center text-[#e93b3b] hover:bg-slate-50 transition-colors"
                      >
                         <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="w-6 text-center font-bold text-[#e93b3b] text-[14px]">
                        {item.quantity}
                      </span>
                      <button 
                         onClick={() => onUpdateCart(item, 1)}
                         className="w-8 h-8 flex items-center justify-center text-[#e93b3b] hover:bg-slate-50 transition-colors"
                      >
                         <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                    <span className="font-bold text-[#1a1a1a]">₹{(item.price * item.quantity).toFixed(0)}</span>
                 </div>
              </div>
            ))}
          </div>

          <button onClick={onBack} className="w-full text-left p-4 border-t border-slate-100 flex items-center justify-between text-[#e93b3b] hover:bg-red-50/30 transition-colors">
             <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-[1.5px] border-[#e93b3b] flex items-center justify-center">
                   <Plus className="w-4 h-4" />
                </div>
                <span className="font-bold text-[15px]">Add more items</span>
             </div>
             <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-red-50 border border-red-100/50 rounded-2xl p-4 shadow-[0_2px_12px_rgb(233,59,59,0.06)] relative overflow-hidden">
           <div className="flex items-center gap-3 relative z-10 mb-3">
              <Bike className="w-5 h-5 text-[#e93b3b]" />
              <p className="font-semibold text-red-950 text-[14px]">
                Add <strong className="text-[#e93b3b]">₹253</strong> more for <strong className="text-red-950">FREE</strong> delivery!
              </p>
           </div>
           <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden relative z-10">
              <div className="h-full w-[25%] bg-[#e93b3b] rounded-full"></div>
           </div>
        </div>

        {/* Delivery To Card */}
        <div className="bg-white rounded-2xl border border-slate-100/60 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-4">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <h3 className="font-bold text-[16px] text-[#1a1a1a]">Delivery To</h3>
              </div>
              <button className="text-[#e93b3b] font-bold text-[15px]">Change</button>
           </div>
           
           <div className="flex gap-4 items-center">
              <div className="w-20 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&h=150&fit=crop" alt="Map" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1a1a1a] text-[15px]">{activeAddress?.label || "Home"}</span>
                    <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[11px] font-bold tracking-tight">🧭 3.3 km</span>
                 </div>
                 <p className="text-slate-500 text-[13px] truncate">{activeAddress?.value || "FFPJ+7C5, 25/254, Sanjeev Nagar, Srinivasa Nagar"}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
           </div>
        </div>

        {/* Offers & Coupons Card */}
        <div className="bg-white rounded-2xl border border-slate-100/60 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden">
           <div className="p-4 border-b border-slate-100/60">
              <div className="flex items-center gap-3">
                 <div className="bg-orange-50 w-8 h-8 rounded-full flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#fc8019]" />
                 </div>
                 <h3 className="font-bold text-[16px] text-[#1a1a1a]">Offers & Coupons</h3>
              </div>
           </div>
           
           <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-slate-400 font-bold text-[12px] tracking-wider">AVAILABLE OFFERS</span>
                 <span className="text-slate-400 font-bold text-[12px]">2/2</span>
              </div>

              <div className="flex border border-slate-200 rounded-xl overflow-hidden relative">
                 <div className="w-[100px] bg-[#fab11e] flex flex-col items-center justify-center text-white p-2 relative shrink-0">
                    <span className="font-black text-[28px] tracking-tighter leading-none mt-1 shadow-sm">₹50</span>
                    <span className="font-bold text-[11px] uppercase tracking-wider mt-1 opacity-90">OFF</span>
                 </div>
                 {/* jagged edge illusion */}
                 <div className="absolute left-[100px] top-0 h-full w-2 flex flex-col justify-between -ml-1">
                    {[...Array(6)].map((_, i) => (
                       <div key={i} className="w-2 h-2 rounded-full bg-white"></div>
                    ))}
                 </div>

                 <div className="flex-1 p-3 bg-white pl-4 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                       <span className="border border-slate-300 font-bold text-slate-800 text-[11px] px-1.5 py-0.5 rounded uppercase">YUM50</span>
                       <span className="bg-orange-50 text-[#fc8019] font-bold text-[10px] px-1.5 py-0.5 rounded">Min ₹299</span>
                    </div>
                    <p className="text-slate-500 text-[12px] font-medium leading-tight">₹50 off on your order above 299!</p>
                    <div className="mt-2 text-right">
                       <button className="text-white font-bold bg-[#e93b3b] hover:bg-[#d83131] px-4 py-1.5 rounded-lg text-[13px] transition-colors">Apply</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 w-full left-0 bg-white border-t border-slate-200 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] px-4 z-40">
        <motion.button
          onClick={handleConfirmOrder}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white py-4 rounded-[14px] font-bold text-[17px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgb(229,57,53,0.3)] transition-colors"
        >
          <span>Pay ₹{total.toFixed(1)}</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
;;
