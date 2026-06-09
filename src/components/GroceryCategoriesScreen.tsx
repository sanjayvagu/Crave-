import React from "react";
import { motion } from "motion/react";

interface GroceryCategoriesScreenProps {
  onBack?: () => void;
}

export const GroceryCategoriesScreen: React.FC<GroceryCategoriesScreenProps> = ({ onBack }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <div className="px-5 pb-4 pt-[max(3rem,env(safe-area-inset-top))] bg-white dark:bg-slate-900 shadow-sm xl:sticky top-0 z-10 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">All Categories</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
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
      </div>
    </motion.div>
  );
};
