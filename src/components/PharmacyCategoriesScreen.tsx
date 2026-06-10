import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mic, ArrowLeft } from "lucide-react";
import { PHARMACY_ITEMS, RECOMMENDED_PHARMACY_ITEMS } from "../data";

import { MenuItem } from "../types";

interface PharmacyCategoriesScreenProps {
  onBack?: () => void;
  onUpdateCart?: (item: MenuItem, delta: number) => void;
}

export const PharmacyCategoriesScreen: React.FC<PharmacyCategoriesScreenProps> = ({ onBack, onUpdateCart }) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const categories = [
    { name: "Medicines", items: "1200+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pill.png", color: "bg-blue-50" },
    { name: "First Aid", items: "300+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Adhesive%20Bandage.png", color: "bg-red-50" },
    { name: "Vitamins", items: "500+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Mango.png", color: "bg-orange-50" },
    { name: "Medical Devices", items: "85+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Stethoscope.png", color: "bg-slate-100" },
    { name: "Personal Care", items: "900+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20of%20Soap.png", color: "bg-teal-50" },
    { name: "Baby Care", items: "450+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Baby.png", color: "bg-pink-50" },
    { name: "Ayurveda", items: "600+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Plants/Herb.png", color: "bg-green-50" },
  ];

  const allPharmacyItems = [...PHARMACY_ITEMS, ...RECOMMENDED_PHARMACY_ITEMS];

  const filteredCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const filteredItems = query
    ? allPharmacyItems.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          (i.category && i.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 overflow-hidden"
    >
      <div className="px-5 pb-4 pt-[max(3rem,env(safe-area-inset-top))] bg-white shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Search Pharmacy</h2>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for medicines, health products..."
            className="w-full bg-slate-100 rounded-2xl py-3.5 pl-12 pr-12 outline-none text-slate-800 placeholder-slate-500 font-medium border border-slate-200 focus:border-[#20615b]/50 transition-colors shadow-inner"
          />
          <button
            onClick={startListening}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors z-10 ${
              isListening
                ? "bg-red-100 text-red-500 animate-pulse"
                : "text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <AnimatePresence>
          {!query ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-bold text-slate-800 mb-4 text-lg tracking-tight">
                All Categories
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer shadow-sm border border-slate-100 transition-shadow hover:shadow-md ${cat.color}`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      <motion.img 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.1 }}
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-contain drop-shadow-sm" 
                      />
                    </div>
                    <span className="font-bold text-xs text-center text-slate-700 leading-tight">
                      {cat.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filteredItems.length > 0 ? (
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 text-lg tracking-tight">Products</h3>
                  <div className="flex flex-col gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.description}</p>
                          <span className="font-bold text-slate-800 mt-1 block">₹{item.price}</span>
                        </div>
                        <button
                          onClick={() => onUpdateCart && onUpdateCart(item, 1)}
                          className="px-4 py-2 bg-[#20615b] text-white text-xs font-bold rounded-xl active:scale-95"
                        >
                          ADD
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full pt-10">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <Search className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-800 mb-1">No results found</h3>
                   <p className="text-slate-500 text-center text-sm">We couldn't find any medicine for "{query}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
