import React from "react";
import { motion } from "motion/react";
import { Clock, Star, Percent, Zap } from "lucide-react";
import { MenuItem } from "../types";

import { GROCERY_ITEMS, RECOMMENDED_GROCERY_ITEMS } from "../data";

interface GroceryViewProps {
  onUpdateCart?: (item: MenuItem, delta: number) => void;
  isVendorOnline?: boolean;
}

export const GroceryView: React.FC<GroceryViewProps> = ({ onUpdateCart, isVendorOnline = true }) => {
  return (
    <div className="flex flex-col animate-fade-in pb-10">
      {!isVendorOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 mx-5 flex flex-col items-center justify-center text-center">
          <span className="text-orange-600 font-bold text-lg mb-1">Currently Offline</span>
          <span className="text-orange-500/80 text-sm font-medium">Store is not accepting orders at the moment.</span>
        </div>
      )}
      {/* Promotional Offers */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-5 px-5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="min-w-[280px] h-36 rounded-3xl bg-gradient-to-br from-[#16a34a] to-[#15803d] p-4 text-white shadow-lg overflow-hidden relative"
          >
            <div className="relative z-10">
              <span className="font-bold text-2xl drop-shadow-md">
                60% OFF
              </span>
              <p className="text-white/90 text-sm mt-1">
                on your first grocery order
              </p>
              <button className="mt-3 bg-white  text-[#16a34a] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Claim Now
              </button>
            </div>
            {/* Abstract decorative circles */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute right-10 -top-10 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="min-w-[280px] h-36 rounded-3xl bg-gradient-to-br from-[#1b1c20] to-[#2d2e32] p-4 text-white shadow-lg overflow-hidden relative"
          >
            <div className="relative z-10">
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                PRO
              </span>
              <p className="text-white/90 text-sm mt-1 mb-3">
                Free delivery on groceries
              </p>
              <span className="text-xs font-bold bg-white/10 px-2 py-1 flex items-center justify-center w-max rounded-md">
                Join Now
              </span>
            </div>
          </motion.div>
      </div>

      {/* Grocery Categories */}
      <div className="mb-8 cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800  tracking-tight">
            Shop by Category
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-5 px-5">
          {[
            { name: "Fresh Veggies", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Broccoli.png" },
            { name: "Fruits", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Red%20Apple.png" },
            { name: "Dairy & Bread", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Bread.png" },
            { name: "Snacks", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Popcorn.png" },
            { name: "Drinks", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Tropical%20Drink.png" },
            { name: "Meats", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Cut%20of%20Meat.png" },
            { name: "Care", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20of%20Soap.png" },
            { name: "Cleaning", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Sponge.png" },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2.5 cursor-pointer shrink-0"
            >
              <div className="w-[72px] h-[72px] bg-slate-50  rounded-full shadow-sm border border-slate-100  flex items-center justify-center p-3">
                <motion.img 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.1 }}
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain drop-shadow-md" 
                />
              </div>
              <span className="text-[11px] font-bold text-center leading-tight text-slate-700  w-16">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Snack Corner */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800  tracking-tight">
            Craving a Snack?
          </h2>
          <span className="text-[#16a34a] text-sm font-bold cursor-pointer">See All</span>
        </div>
        <div className="grid grid-cols-2 gap-4 px-5">
          {[
            { name: "Chips & Crisps", items: "120+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/French%20Fries.png", color: "from-orange-100 to-orange-50  " },
            { name: "Cold Drinks", items: "85+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Tropical%20Drink.png", color: "from-blue-100 to-blue-50  " },
            { name: "Chocolates", items: "90+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Chocolate%20Bar.png", color: "from-amber-100 to-amber-50  " },
            { name: "Ice Creams", items: "40+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Ice%20Cream.png", color: "from-pink-100 to-pink-50  " },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-3 flex flex-col h-32 relative overflow-hidden shadow-sm cursor-pointer border border-slate-100 `}
            >
              <div className="z-10 relative">
                <h3 className="font-bold text-sm text-slate-800  leading-tight w-2/3">{cat.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{cat.items}</p>
              </div>
              <motion.img 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.2 }}
                src={cat.image} 
                className="absolute -bottom-2 -right-2 w-20 h-20 object-contain drop-shadow-md rounded-tl-xl" 
                alt={cat.name} 
              />
            </motion.div>
          ))}
        </div>
      </div>
      {/* Curated Stores */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800  tracking-tight">
            Curated Stores
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-5 px-5">
          {[
            { name: "The Health Store", suffix: "Organic & Healthy", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Avocado.png" },
            { name: "The Breakfast Cafe", suffix: "Start your day right", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Pancakes.png" },
            { name: "Pet Care", suffix: "For your furry friends", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png" },
            { name: "Stationery", suffix: "Office & School", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pencil.png" }
          ].map((store, idx) => (
             <motion.div
               key={idx}
               whileHover={{ y: -2 }}
               whileTap={{ scale: 0.98 }}
               className="min-w-[220px] bg-slate-50  p-4 rounded-3xl flex items-center gap-4 cursor-pointer border border-slate-100  shadow-sm"
             >
               <div className="w-12 h-12 bg-white  rounded-full flex items-center justify-center p-2 shadow-sm shrink-0">
                 <motion.img 
                   animate={{ y: [0, -4, 0] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.15 }}
                   src={store.image} 
                   alt={store.name} 
                   className="w-full h-full object-contain" 
                 />
               </div>
               <div>
                 <h3 className="font-bold text-sm text-slate-800  leading-tight">{store.name}</h3>
                 <p className="text-[10px] text-slate-500 font-medium mt-0.5">{store.suffix}</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800  tracking-tight">
            Bestsellers
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5">
          {GROCERY_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="min-w-[160px] max-w-[160px] bg-white  rounded-[24px] overflow-hidden shadow-sm border border-slate-100  cursor-pointer flex flex-col relative"
            >
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                10% OFF
              </div>
              <div className="h-32 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-white  border-t border-slate-100 ">
                <div>
                  <div className="text-xs font-medium text-slate-500  mb-1">{item.description}</div>
                  <h3 className="font-bold text-sm leading-tight text-slate-800  line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 line-through">₹{Math.round(item.price * 1.1)}</span>
                    <span className="font-bold text-slate-800  text-base">₹{item.price}</span>
                  </div>
                  {isVendorOnline ? (
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center hover:bg-[#15803d] transition-colors relative z-20 shadow-sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (onUpdateCart) onUpdateCart(item, 1);
                      }}
                    >
                      <span className="text-xl font-medium leading-none pb-0.5">+</span>
                    </motion.button>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md">Offline</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <div className="flex items-center justify-between px-5 mb-4 mt-4">
          <h2 className="text-lg font-bold text-slate-800  tracking-tight">
            Recommended for You
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5">
          {RECOMMENDED_GROCERY_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="min-w-[160px] max-w-[160px] bg-white  rounded-[24px] overflow-hidden shadow-sm border border-slate-100  cursor-pointer flex flex-col relative"
            >
              <div className="h-32 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-white  border-t border-slate-100 ">
                <div>
                  <div className="text-xs font-medium text-slate-500  mb-1">{item.description}</div>
                  <h3 className="font-bold text-sm leading-tight text-slate-800  line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800  text-base">₹{item.price}</span>
                  </div>
                  {isVendorOnline ? (
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center hover:bg-[#15803d] transition-colors relative z-20 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onUpdateCart) onUpdateCart(item, 1);
                      }}
                    >
                      <span className="text-xl font-medium leading-none pb-0.5">+</span>
                    </motion.button>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md">Offline</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
