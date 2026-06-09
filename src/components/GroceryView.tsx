import React from "react";
import { motion } from "motion/react";
import { Clock, Star, Percent, Zap } from "lucide-react";
import { MenuItem } from "../types";

const GROCERY_ITEMS: MenuItem[] = [
  { id: "g1", restaurantId: "instamart", name: "Farm Fresh Tomatoes", price: 40, description: "500g", isVeg: true, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=100" },
  { id: "g2", restaurantId: "instamart", name: "Amul Taaza Milk", price: 34, description: "500ml pouch", isVeg: true, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "g3", restaurantId: "instamart", name: "Lay's Magic Masala", price: 20, description: "50g pack", isVeg: true, image: "https://images.unsplash.com/photo-1566478989037-eade3f7e540b?auto=format&fit=crop&w=1200&q=100" },
  { id: "g4", restaurantId: "instamart", name: "Aashirvaad Atta", price: 245, description: "5kg bag", isVeg: true, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=100" },
  { id: "g5", restaurantId: "instamart", name: "Dove Soap Bar", price: 55, description: "100g", isVeg: true, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1200&q=100" },
];

const RECOMMENDED_ITEMS: MenuItem[] = [
  { id: "g6", restaurantId: "instamart", name: "Maggi 2-Minute Noodles", price: 14, description: "70g", isVeg: true, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=1200&q=100" },
  { id: "g7", restaurantId: "instamart", name: "Surf Excel Easy Wash", price: 110, description: "1kg", isVeg: true, image: "https://images.unsplash.com/photo-1581646271587-1dbdd986d7e0?auto=format&fit=crop&w=1200&q=100" },
  { id: "g8", restaurantId: "instamart", name: "Fortune Sunlite Oil", price: 140, description: "1L pouch", isVeg: true, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=100" },
  { id: "g9", restaurantId: "instamart", name: "Brooke Bond Red Label", price: 130, description: "250g", isVeg: true, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=100" },
  { id: "g10", restaurantId: "instamart", name: "Dettol Handwash", price: 99, description: "200ml", isVeg: true, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=100" },
];

interface GroceryViewProps {
  onUpdateCart?: (item: MenuItem, delta: number) => void;
}

export const GroceryView: React.FC<GroceryViewProps> = ({ onUpdateCart }) => {
  return (
    <div className="flex flex-col animate-fade-in pb-10">
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
              <button className="mt-3 bg-white dark:bg-slate-900 text-[#16a34a] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
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
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
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
              <div className="w-[72px] h-[72px] bg-slate-50 dark:bg-slate-800/50 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3">
                <motion.img 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.1 }}
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain drop-shadow-md" 
                />
              </div>
              <span className="text-[11px] font-bold text-center leading-tight text-slate-700 dark:text-slate-300 w-16">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Snack Corner */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Craving a Snack?
          </h2>
          <span className="text-[#16a34a] text-sm font-bold cursor-pointer">See All</span>
        </div>
        <div className="grid grid-cols-2 gap-4 px-5">
          {[
            { name: "Chips & Crisps", items: "120+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/French%20Fries.png", color: "from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10" },
            { name: "Cold Drinks", items: "85+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Tropical%20Drink.png", color: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10" },
            { name: "Chocolates", items: "90+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Chocolate%20Bar.png", color: "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10" },
            { name: "Ice Creams", items: "40+ items", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Ice%20Cream.png", color: "from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-900/10" },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-3 flex flex-col h-32 relative overflow-hidden shadow-sm cursor-pointer border border-slate-100 dark:border-slate-800`}
            >
              <div className="z-10 relative">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight w-2/3">{cat.name}</h3>
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
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
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
               className="min-w-[220px] bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl flex items-center gap-4 cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm"
             >
               <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center p-2 shadow-sm shrink-0">
                 <motion.img 
                   animate={{ y: [0, -4, 0] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.15 }}
                   src={store.image} 
                   alt={store.name} 
                   className="w-full h-full object-contain" 
                 />
               </div>
               <div>
                 <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{store.name}</h3>
                 <p className="text-[10px] text-slate-500 font-medium mt-0.5">{store.suffix}</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between px-5 mb-4 mt-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Bestsellers
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5">
          {GROCERY_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="min-w-[160px] max-w-[160px] bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer flex flex-col relative"
            >
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                10% OFF
              </div>
              <div className="h-32 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{item.description}</div>
                  <h3 className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-100 line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 line-through">₹{Math.round(item.price * 1.1)}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">₹{item.price}</span>
                  </div>
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <div className="flex items-center justify-between px-5 mb-4 mt-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Recommended for You
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5">
          {RECOMMENDED_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="min-w-[160px] max-w-[160px] bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer flex flex-col relative"
            >
              <div className="h-32 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{item.description}</div>
                  <h3 className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-100 line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">₹{item.price}</span>
                  </div>
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
