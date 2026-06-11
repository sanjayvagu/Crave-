import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  ChevronDown,
  Percent,
  Clock,
  Star,
  History,
  Heart,
} from "lucide-react";
import { RESTAURANTS, MOCK_ORDERS, MENU_ITEMS, CITIES } from "../data";
import { Restaurant, Address, MenuItem, City } from "../types";
import { PullToRefresh } from "./PullToRefresh";
import { GroceryView } from "./GroceryView";
import { PharmacyView } from "./PharmacyView";

interface HomeProps {
  serviceType: "food" | "grocery" | "pharmacy";
  isVegMode: boolean;
  onVegModeChange: (isVeg: boolean) => void;
  onServiceTypeChange: (type: "food" | "grocery" | "pharmacy") => void;
  favorites: string[];
  isVendorOnline?: boolean;
  activeAddress?: Address;
  selectedCity: City;
  onSelectCity: (cityId: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onOpenSearch: (query?: string) => void;
  onUpdateCart?: (item: MenuItem, delta: number) => void;
}

export const Home: React.FC<HomeProps> = ({
  serviceType,
  isVegMode,
  onVegModeChange,
  onServiceTypeChange,
  favorites,
  isVendorOnline = true,
  activeAddress,
  selectedCity,
  onSelectCity,
  onToggleFavorite,
  onSelectRestaurant,
  onViewHistory,
  onViewProfile,
  onOpenSearch,
  onUpdateCart,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  const foodCycles = [
    { text: "EatRight", left: "Hamburger.png", right: "Green%20Salad.png" },
    { text: "Pizza", left: "Pizza.png", right: "Taco.png" },
    { text: "Biryani", left: "Pot%20of%20Food.png", right: "Poultry%20Leg.png" },
    { text: "Cake", left: "Shortcake.png", right: "Pancakes.png" },
    { text: "Sweets", left: "Doughnut.png", right: "Chocolate%20Bar.png" }
  ];

  const groceryCycles = [
    { text: "Groceries", left: "Red%20Apple.png", right: "Shopping%20Cart.png" },
    { text: "Vegetables", left: "Broccoli.png", right: "Carrot.png" },
    { text: "Fruits", left: "Banana.png", right: "Grapes.png" },
    { text: "Dairy", left: "Glass%20of%20Milk.png", right: "Cheese%20Wedge.png" }
  ];

  const pharmacyCycles = [
    { text: "Medicines", left: "Pill.png", right: "Stethoscope.png" },
    { text: "First Aid", left: "Adhesive%20Bandage.png", right: "Syringe.png" },
    { text: "Vitamins", left: "Mango.png", right: "Pill.png" },
    { text: "Health Care", left: "Drop%20of%20Blood.png", right: "Soap.png" }
  ];

  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentCycle = serviceType === "food" 
    ? foodCycles[cycleIndex % foodCycles.length]
    : serviceType === "grocery" 
      ? groceryCycles[cycleIndex % groceryCycles.length]
      : pharmacyCycles[cycleIndex % pharmacyCycles.length];

  const handleEnableLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setIsLocating(false);
            const randomIndex = Math.floor(Math.random() * CITIES.length);
            onSelectCity(CITIES[randomIndex].id);
          }, 800);
        },
        (error) => {
          console.error("Error obtaining location", error);
          setIsLocating(false);
        },
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleRefresh = async () => {
    // Simulate network delay for refreshing content
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const cityRestaurants = useMemo(() => {
    let filtered = RESTAURANTS.filter(r => r.cityId === selectedCity.id);
    if (serviceType === "food" && isVegMode) {
      filtered = filtered.filter(r => MENU_ITEMS.some(item => item.restaurantId === r.id && item.isVeg));
    }
    return filtered;
  }, [selectedCity.id, serviceType, isVegMode]);

  const recommendedItems = useMemo(() => {
    const orderedItemNames = new Set<string>();
    MOCK_ORDERS.forEach((order) => {
      order.items.forEach((item) => orderedItemNames.add(item.name));
    });

    let recommended = MENU_ITEMS.filter((item) => {
      const parentRest = RESTAURANTS.find(r => r.id === item.restaurantId);
      return orderedItemNames.has(item.name) && parentRest?.cityId === selectedCity.id;
    });

    if (serviceType === "food" && isVegMode) {
      recommended = recommended.filter(item => item.isVeg);
    }
    return recommended.slice(0, 5); // Return up to 5 items
  }, [selectedCity.id, serviceType, isVegMode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50  overflow-hidden"
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-32">
          {/* Header & Hero Section */}
          <div className={`relative z-10 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 px-4 transition-colors duration-500 bg-gradient-to-b ${
            serviceType === "food" 
              ? "from-[#fc8019] to-[#f27405]  " 
              : serviceType === "grocery" 
                ? "from-[#380e52] to-[#1d0628]  "
                : "from-[#20615b] to-[#1a514c]  "
          }`}>
            
            <div className="relative z-10 flex items-center justify-between gap-2">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className="flex items-center shrink-0 cursor-pointer group"
              >
                <h1
                  className="text-[26px] font-black tracking-tighter lowercase flex items-baseline text-white"
                >
                  {"cra".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut",
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{ y: [0, -3, 0], rotate: [0, 8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                    className="inline-block origin-bottom text-slate-900"
                  >
                    v
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.4,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    e
                  </motion.span>
                </h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-white self-end mb-2 ml-[3px]"
                />
              </motion.div>

              {/* Address */}
              <div
                onClick={() => setShowCitySelector(true)}
                className="flex flex-col flex-1 items-center justify-center cursor-pointer group px-2"
              >
                <div className="flex items-center gap-1">
                  {isLocating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-[14px] h-[14px] shrink-0 rounded-full border-2 border-white border-t-transparent"
                    />
                  ) : (
                    <MapPin className="text-white/90 w-[14px] h-[14px] shrink-0 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  )}
                  <div className="flex items-center font-extrabold text-[15px] text-white tracking-tight">
                    {selectedCity.name}{" "}
                    <ChevronDown className="w-[14px] h-[14px] text-white/80 group-hover:text-white transition-colors ml-0.5" strokeWidth={2.5}/>
                  </div>
                </div>
                <p className="text-[11px] text-white/70 font-medium tracking-wide">
                  {isLocating
                    ? "Locating..."
                    : selectedCity.pinCodes[0] || "Select Location"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <motion.div
                  onClick={onViewProfile}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer w-9 h-9 rounded-full overflow-hidden shadow-sm border border-white/20"
                >
                  <img
                    src="https://i.pravatar.cc/100?img=11"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Service Toggle */}
            {(selectedCity.name === "Prathipadu" || selectedCity.name === "Yeleswaram") && selectedCity.isServiceable && (
              <div className="relative z-10 flex bg-black/10 p-1 mt-5 mx-1 rounded-2xl border border-white/10 backdrop-blur-md">
                 <motion.div
                   className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm"
                   animate={{ x: serviceType === "food" ? 0 : "100%" }}
                   transition={{ type: "spring", stiffness: 400, damping: 30 }}
                 />
                 <button
                    onClick={() => onServiceTypeChange("food")}
                    className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${serviceType === "food" ? "text-[#fc8019]" : "text-white/80 hover:text-white"}`}
                 >
                   <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Hamburger.png" alt="Food" className={`w-5 h-5 drop-shadow-sm transition-transform duration-300 ${serviceType === "food" ? "scale-110" : "scale-90 opacity-80"}`} />
                   Food Delivery
                 </button>
                 {selectedCity.name === "Prathipadu" ? (
                   <button
                      onClick={() => onServiceTypeChange("grocery")}
                      className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${serviceType === "grocery" ? "text-[#48126b]" : "text-white/80 hover:text-white"}`}
                   >
                     {serviceType === "grocery" && <div className="absolute top-[-6px] bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm leading-tight lowercase">10 mins</div>}
                     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png" alt="Grocery" className={`w-5 h-5 drop-shadow-sm transition-transform duration-300 ${serviceType === "grocery" ? "scale-110" : "scale-90 opacity-80"}`} />
                     Groceries
                   </button>
                 ) : (
                   <button
                      onClick={() => onServiceTypeChange("pharmacy")}
                      className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${serviceType === "pharmacy" ? "text-[#20615b]" : "text-white/80 hover:text-white"}`}
                   >
                     {serviceType === "pharmacy" && <div className="absolute top-[-6px] bg-[#1a514c] text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm leading-tight lowercase">15 mins</div>}
                     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pill.png" alt="Pharmacy" className={`w-5 h-5 drop-shadow-sm transition-transform duration-300 ${serviceType === "pharmacy" ? "scale-110" : "scale-90 opacity-80"}`} />
                     Medicine
                   </button>
                 )}
              </div>
            )}

            {/* Search Bar & Veg Toggle */}
            <div className="mt-6 mx-1 flex items-center gap-3 relative z-10">
              <motion.div
                onClick={onOpenSearch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center bg-white shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-[20px] p-[14px] px-5 cursor-pointer overflow-hidden"
              >
                <Search className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <div className="flex-1 ml-3 text-slate-400 text-[15px] font-medium flex items-center h-5 overflow-hidden gap-[3px]">
                  <span>Search for '</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={currentCycle.text}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-slate-700 font-bold max-w-[120px] truncate"
                    >
                      {currentCycle.text}
                    </motion.span>
                  </AnimatePresence>
                  <span>'</span>
                </div>
                <div className="text-[#fc8019] ml-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </div>
              </motion.div>

              {serviceType === "food" && (
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="bg-black/20 backdrop-blur-md border border-white/10 p-1.5 px-2.5 rounded-2xl shadow-inner flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none drop-shadow-sm">Veg</span>
                    <button
                      onClick={() => onVegModeChange(!isVegMode)}
                      className="w-10 h-6 rounded-full p-[2px] flex items-center transition-colors duration-300 relative shadow-inner overflow-hidden cursor-pointer"
                      style={{ background: "rgba(0,0,0,0.4)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}
                    >
                       <motion.div
                         initial={false}
                         animate={{ x: isVegMode ? 16 : 0 }}
                         transition={{ type: "spring", stiffness: 500, damping: 30 }}
                         className="w-[20px] h-[20px] bg-white rounded-full shadow-md flex items-center justify-center absolute left-[2px]"
                       >
                         <motion.div 
                           initial={false}
                           animate={{ scale: isVegMode ? 1 : 0 }}
                           className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" 
                         />
                       </motion.div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Animated Banner Overlay */}
            <div className="relative z-10 mt-[26px] mb-2 flex items-center justify-center">
              {serviceType === "food" ? (
                <div className="flex flex-col items-center pointer-events-none w-full relative pt-2 pb-6">
                   <div className="flex flex-row items-center justify-center w-full relative z-10 px-2 mt-4 space-x-5">
                       <motion.div 
                         initial={{ scale: 0, opacity: 0, x: -20 }}
                         animate={{ scale: 1, opacity: 1, x: 0 }}
                         transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
                         className="relative flex justify-center shrink-0"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[56px] h-[56px] text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] relative z-10">
                           <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                         </svg>
                       </motion.div>
                       
                       <div className="flex flex-col text-left justify-center">
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#ffcca5] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Cravings <span className="font-extrabold text-white">Satisfied.</span>
                           </motion.div>
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#ffcca5] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Delivered <span className="font-extrabold text-white">Hot.</span>
                           </motion.div>
                       </div>
                   </div>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                     className="mt-8 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg"
                   >
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                     </span>
                     <span className="text-[11px] text-white font-bold tracking-wider uppercase">Hot & Fresh Meals</span>
                   </motion.div>
                </div>
              ) : serviceType === "grocery" ? (
                <div className="flex flex-col items-center pointer-events-none w-full relative pt-2 pb-6">
                   <div className="flex flex-row items-center justify-center w-full relative z-10 px-2 mt-4 space-x-5">
                       <motion.div 
                         initial={{ scale: 0, opacity: 0, x: -20 }}
                         animate={{ scale: 1, opacity: 1, x: 0 }}
                         transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
                         className="relative flex justify-center shrink-0"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[56px] h-[56px] text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] relative z-10">
                           <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                         </svg>
                       </motion.div>
                       
                       <div className="flex flex-col text-left justify-center">
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#d8aef5] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Pantry <span className="font-extrabold text-white">Stocked.</span>
                           </motion.div>
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#d8aef5] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Delivered <span className="font-extrabold text-white">Fresh.</span>
                           </motion.div>
                       </div>
                   </div>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                     className="mt-8 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg"
                   >
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                     </span>
                     <span className="text-[11px] text-white font-bold tracking-wider uppercase">Daily Household Needs</span>
                   </motion.div>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none w-full relative pt-2 pb-6">
                   <div className="flex flex-row items-center justify-center w-full relative z-10 px-2 mt-4 space-x-5">
                       <motion.div 
                         initial={{ scale: 0, opacity: 0, x: -20 }}
                         animate={{ scale: 1, opacity: 1, x: 0 }}
                         transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
                         className="relative flex justify-center shrink-0"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[56px] h-[56px] text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] relative z-10">
                           <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                         </svg>
                       </motion.div>
                       
                       <div className="flex flex-col text-left justify-center">
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#a5ccca] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Instant <span className="font-extrabold text-white">Relief.</span>
                           </motion.div>
                           <motion.div 
                             initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                             transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                             className="text-[#a5ccca] font-medium text-[26px] leading-[1.1] tracking-tight" 
                             style={{ fontFamily: "'Inter', sans-serif" }}
                           >
                               Delivered <span className="font-extrabold text-white">Faster.</span>
                           </motion.div>
                       </div>
                   </div>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                     className="mt-8 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg"
                   >
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                     </span>
                     <span className="text-[11px] text-white font-bold tracking-wider uppercase">Genuine Medicines & Care</span>
                   </motion.div>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-8 pt-6 bg-slate-50  rounded-t-[32px] -mt-6 relative z-20 shadow-[0_-10px_20px_rgb(0,0,0,0.05)]">

          {/* Conditional Content based on Serviceability */}
          {!selectedCity.isServiceable ? (
            <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
              <div className="w-32 h-32 bg-slate-200  rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-[#fc8019] opacity-50" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800  mb-2">Unserviceable Area</h2>
              <p className="text-slate-500 ">
                Coming soon to {selectedCity.name}!
              </p>
            </div>
          ) : serviceType === "grocery" ? (
            <GroceryView onUpdateCart={onUpdateCart} isVendorOnline={isVendorOnline} />
          ) : serviceType === "pharmacy" ? (
            <PharmacyView onUpdateCart={onUpdateCart} isVendorOnline={isVendorOnline} />
          ) : (
            <>
              {/* Promotional Offers */}
              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-5 px-5">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    className="min-w-[280px] h-36 rounded-3xl bg-gradient-to-br from-[#fc8019] to-[#e86600] p-4 text-white shadow-lg overflow-hidden relative"
                  >
                    <div className="relative z-10">
                      <span className="font-bold text-2xl drop-shadow-md">
                        50% OFF
                      </span>
                      <p className="text-white/90 text-sm mt-1">
                        on your first 3 orders
                      </p>
                      <button className="mt-3 bg-white  text-[#fc8019] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
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
                        Free delivery + 20% extra off
                      </p>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                        Join Now
                      </span>
                    </div>
                  </motion.div>
            </div>

            {/* Categories */}
            <div className="mb-8 cursor-grab active:cursor-grabbing">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800  tracking-tight">
                  What's on your mind?
                </h2>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-5 px-5">
                {[
                  { name: "Burgers", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Hamburger.png" },
                  { name: "Pizzas", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Pizza.png" },
                  { name: "Sushi", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Sushi.png" },
                  { name: "Healthy", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Green%20Salad.png" },
                  { name: "Indian", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Curry%20Rice.png" },
                  { name: "Desserts", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Ice%20Cream.png" },
                  { name: "Drinks", image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Tropical%20Drink.png" },
                ].map((category, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenSearch(category.name)}
                    className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
                  >
                    <div className="w-[72px] h-[72px] bg-slate-50  rounded-full shadow-sm border border-slate-100  flex items-center justify-center p-3">
                      <img src={category.image} alt={category.name} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 ">
                      {category.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended for You */}
            {recommendedItems.length > 0 && (
              <div className="mt-2 mb-8">
                <h2 className="text-lg font-bold text-slate-800  mb-4 tracking-tight">
                  Recommended for You
                </h2>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5">
                  {recommendedItems.map((item) => {
                    const restaurant = RESTAURANTS.find(r => r.id === item.restaurantId);
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => restaurant && onSelectRestaurant(restaurant)}
                        className="min-w-[160px] max-w-[160px] bg-white  rounded-[24px] overflow-hidden shadow-sm border border-slate-100  cursor-pointer flex flex-col"
                      >
                        <div className="relative h-28 w-full bg-slate-100 ">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {restaurant?.rating}
                          </div>
                        </div>
                        <div className="p-3.5 flex flex-col flex-1 justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800  line-clamp-1 leading-tight">{item.name}</h3>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-1">{restaurant?.name}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-extrabold text-slate-800  text-sm">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              className="w-6 h-6 rounded-full bg-[#1b1c20] text-white flex items-center justify-center hover:bg-slate-800 transition-colors pointer-events-auto"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                if (onUpdateCart) onUpdateCart(item, 1);
                              }}
                            >
                              <span className="text-xs">+</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Restaurants */}
            <div className="mt-2">
              <h2 className="text-lg font-bold text-slate-800  mb-4 tracking-tight">
                Top Restaurants to explore
              </h2>
              <div className="flex flex-col gap-6">
                  {cityRestaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      layoutId={`restaurant-${restaurant.id}`}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onSelectRestaurant(restaurant)}
                      className="bg-white  rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100  cursor-pointer"
                    >
                      <div className="relative h-44">
                        <motion.img
                          layoutId={`restaurant-img-${restaurant.id}`}
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(restaurant.id);
                          }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center p-0 border border-white/30"
                        >
                          <Heart
                            className={`w-5 h-5 ${favorites.includes(restaurant.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                          />
                        </motion.button>
                        <div className="absolute top-1/2 bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                          {restaurant.offers && (
                            <div className="flex items-center gap-1 text-white font-bold text-lg">
                              <Percent className="w-5 h-5 text-blue-400" />
                              {restaurant.offers}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white ">
                        <div className="flex justify-between items-start">
                          <motion.h3
                            layoutId={`restaurant-title-${restaurant.id}`}
                            className="font-bold text-xl text-slate-800  tracking-tight"
                          >
                            {restaurant.name}
                          </motion.h3>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-bold">
                                {restaurant.rating}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1">
                              {restaurant.reviewCount}+ reviews
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-slate-500  text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {restaurant.deliveryTime}
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <div>
                            {restaurant.tags[0]}, {restaurant.tags[1]}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            </>
            )}

            {/* Footer */}
            <div className="mt-12 py-10 border-t border-slate-200  flex flex-col items-center justify-center">
              <div className="flex flex-col items-center shrink-0 mb-4 cursor-pointer group">
                <div className="flex items-center">
                  <h1
                    className="text-4xl font-black tracking-tight lowercase text-slate-300  flex items-baseline group-hover:text-slate-800  transition-colors duration-500"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {"cra".split("").map((char, index) => (
                      <span key={index} className="inline-block">
                        {char}
                      </span>
                    ))}
                    <span className="text-slate-300  group-hover:text-[#fc8019] transition-colors duration-500">
                      v
                    </span>
                    <span className="inline-block">e</span>
                  </h1>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 self-end mb-2 ml-0.5 group-hover:bg-[#fc8019] transition-colors duration-500" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400  tracking-widest uppercase">
                Developed by Sanjay vagu
              </p>
            </div>
          </div>
        </div>
      </PullToRefresh>

      {/* City Selector Modal */}
      {showCitySelector && (
        <div className="absolute inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
             onClick={() => setShowCitySelector(false)}>
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white  rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
          >
            <h2 className="text-xl font-bold text-slate-800  mb-4">Select City</h2>
            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-6">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city.id);
                    setShowCitySelector(false);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                    selectedCity.id === city.id
                      ? "border-[#fc8019] bg-orange-50 "
                      : "border-slate-200  hover:bg-slate-50 :bg-slate-800"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`font-bold text-lg ${selectedCity.id === city.id ? "text-[#fc8019]" : "text-slate-800 "}`}>
                      {city.name}
                    </span>
                    {!city.isServiceable && (
                      <span className="text-xs text-red-500 font-medium">Coming Soon</span>
                    )}
                  </div>
                  {selectedCity.id === city.id && (
                     <div className="w-5 h-5 rounded-full bg-[#fc8019] flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-white" />
                     </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
