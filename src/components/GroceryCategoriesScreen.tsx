import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mic, ArrowLeft } from "lucide-react";
import { GROCERY_ITEMS, RECOMMENDED_GROCERY_ITEMS } from "../data";

import { MenuItem } from "../types";

interface GroceryCategoriesScreenProps {
  onBack?: () => void;
  onUpdateCart?: (item: MenuItem, delta: number) => void;
}

export const GroceryCategoriesScreen: React.FC<GroceryCategoriesScreenProps> = ({ onBack, onUpdateCart }) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const categories = [
    { name: "Fresh Veggies", items: "200+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Broccoli.png", color: "bg-green-50 dark:bg-green-900/20" },
    { name: "Fruits", items: "150+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Red%20Apple.png", color: "bg-red-50 dark:bg-red-900/20" },
    { name: "Dairy & Bread", items: "300+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Bread.png", color: "bg-orange-50 dark:bg-orange-900/20" },
    { name: "Snacks", items: "500+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/French%20Fries.png", color: "bg-yellow-50 dark:bg-yellow-900/20" },
    { name: "Drinks", items: "150+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Tropical%20Drink.png", color: "bg-blue-50 dark:bg-blue-900/20" },
    { name: "Meats", items: "80+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Cut%20of%20Meat.png", color: "bg-red-50 dark:bg-rose-900/20" },
    { name: "Care", items: "120+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20of%20Soap.png", color: "bg-teal-50 dark:bg-teal-900/20" },
    { name: "Cleaning", items: "90+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Sponge.png", color: "bg-yellow-50 dark:bg-yellow-900/20" },
    { name: "Chocolates", items: "90+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Chocolate%20Bar.png", color: "bg-amber-50 dark:bg-amber-900/20" },
    { name: "Ice Creams", items: "40+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Ice%20Cream.png", color: "bg-pink-50 dark:bg-pink-900/20" },
  ];

  const allGroceryItems = [...GROCERY_ITEMS, ...RECOMMENDED_GROCERY_ITEMS];

  const filteredCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const filteredItems = query
    ? allGroceryItems.filter(
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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <div className="px-5 pb-4 pt-[max(3rem,env(safe-area-inset-top))] bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Search Groceries</h2>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for groceries, categories..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl py-3.5 pl-12 pr-12 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-500 font-medium border border-slate-200 dark:border-slate-700 focus:border-[#16a34a]/50 transition-colors shadow-inner"
          />
          <button
            onClick={startListening}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors z-10 ${
              isListening
                ? "bg-red-100 text-red-500 dark:bg-red-900/30 animate-pulse"
                : "text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
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
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg tracking-tight">
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
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md ${cat.color}`}
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
                    <h3 className="text-xs font-bold text-center leading-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      {cat.name}
                    </h3>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">{cat.items}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg tracking-tight">
                Results
              </h3>
              
              {filteredCategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Categories</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {filteredCategories.map((cat, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md ${cat.color}`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center mb-2">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        <h3 className="text-[11px] font-bold text-center leading-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                          {cat.name}
                        </h3>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Items</h4>
                  <div className="space-y-4">
                    {filteredItems.map((item, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: idx * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        key={item.id}
                        className="bg-white dark:bg-slate-900 p-3 rounded-2xl flex items-center gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-800"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {item.description}
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            ₹{item.price}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdateCart?.(item, 1); }}
                          className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-lg leading-none active:scale-95 transition-transform"
                        >
                          +
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCategories.length === 0 && filteredItems.length === 0 && (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
