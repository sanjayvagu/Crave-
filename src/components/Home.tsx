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

interface HomeProps {
  serviceType: "food" | "grocery";
  onServiceTypeChange: (type: "food" | "grocery") => void;
  favorites: string[];
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
  onServiceTypeChange,
  favorites,
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

  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentCycle = serviceType === "food" 
    ? foodCycles[cycleIndex % foodCycles.length]
    : groceryCycles[cycleIndex % groceryCycles.length];

  const handleEnableLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setIsLocating(false);
            // Simulate capturing an unserviceable city randomly or just the first unserviceable one
            // We'll pick 'Pune' to demonstrate the GPS scenario.
            import("../data").then((module) => {
               const randomIndex = Math.floor(Math.random() * module.CITIES.length);
               onSelectCity(module.CITIES[randomIndex].id);
            });
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
    return RESTAURANTS.filter(r => r.cityId === selectedCity.id);
  }, [selectedCity.id]);

  const recommendedItems = useMemo(() => {
    const orderedItemNames = new Set<string>();
    MOCK_ORDERS.forEach((order) => {
      order.items.forEach((item) => orderedItemNames.add(item.name));
    });

    const recommended = MENU_ITEMS.filter((item) => {
      const parentRest = RESTAURANTS.find(r => r.id === item.restaurantId);
      return orderedItemNames.has(item.name) && parentRest?.cityId === selectedCity.id;
    });
    return recommended.slice(0, 5); // Return up to 5 items
  }, [selectedCity.id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      {/* Background fill for safe-area-inset-top */}
      <div className={`absolute top-0 left-0 right-0 h-[50vh] z-0 transition-colors duration-500 ${serviceType === "food" ? "bg-[#fc8019] dark:bg-[#e06d10]" : "bg-[#380e52] dark:bg-[#2e0b44]"}`} />
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-32">
          {/* Header & Hero Section */}
          <div className={`relative z-10 pt-[max(1.5rem,env(safe-area-inset-top))] pb-12 px-4 transition-colors duration-500 bg-gradient-to-b ${serviceType === "food" ? "from-[#fc8019] to-[#f27405] dark:from-[#e06d10] dark:to-[#c45e0a]" : "from-[#380e52] to-[#1d0628] dark:from-[#2e0b44] dark:to-[#16041f]"}`}>
            
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
            {selectedCity.name === "Prathipadu" && selectedCity.isServiceable && (
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
                 <button
                    onClick={() => onServiceTypeChange("grocery")}
                    className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${serviceType === "grocery" ? "text-[#48126b]" : "text-white/80 hover:text-white"}`}
                 >
                   {serviceType === "grocery" && <div className="absolute top-[-6px] bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm leading-tight lowercase">10 mins</div>}
                   <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png" alt="Grocery" className={`w-5 h-5 drop-shadow-sm transition-transform duration-300 ${serviceType === "grocery" ? "scale-110" : "scale-90 opacity-80"}`} />
                   Groceries
                 </button>
              </div>
            )}

            {/* Search Bar */}
            <motion.div
              onClick={onOpenSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10 mt-6 mx-1 flex items-center bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-full p-[14px] px-5 cursor-pointer overflow-hidden"
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
                    className="text-slate-700 dark:text-slate-300 font-bold max-w-[150px] truncate"
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
            
            {/* Animated Banner Overlay */}
            <div className="relative z-10 mt-[26px] mb-2 flex items-center justify-center">
              {serviceType === "food" ? (
                <div className="flex items-center gap-1.5 pointer-events-none relative">
                   <motion.img 
                       src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Pizza.png" 
                       className="w-[42px] h-[42px] drop-shadow-md z-10 relative -mr-2"
                       animate={{ y: [0, -4, 0] }}
                       transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   />
                   <div className="flex flex-col items-center">
                       <h2 className="text-[#ffed4a] font-black text-[28px] leading-none tracking-tighter drop-shadow-md italic pr-2" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                           FOODIE VERSE
                       </h2>
                       <div className="mt-[3px] bg-white text-[#fc8019] text-[9px] font-bold px-[12px] py-[3px] rounded-full uppercase tracking-[0.2em] shadow-sm">
                           Order Now
                       </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none w-full max-w-[260px]">
                   <div className="flex items-center justify-center w-full relative">
                       <motion.img 
                           src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Green%20Salad.png" 
                           className="w-[36px] h-[36px] drop-shadow-md absolute -left-4"
                           animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }}
                           transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                       />
                       <h2 className="text-white font-black text-xl text-center leading-tight tracking-tight drop-shadow-md px-4" style={{ fontFamily: "Outfit, Arial, sans-serif" }}>
                           Your cart, delivered before you're ready.
                       </h2>
                   </div>
                   <div className="mt-[8px] bg-white text-[#48126b] text-[9px] font-bold px-[12px] py-[3px] rounded-full uppercase tracking-[0.2em] shadow-sm">
                       Shop Now
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-8 pt-6 min-h-screen bg-slate-50 dark:bg-slate-950 rounded-t-[32px] -mt-6 relative z-20 shadow-[0_-10px_20px_rgb(0,0,0,0.05)]">

          {/* Conditional Content based on Serviceability */}
          {!selectedCity.isServiceable ? (
            <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
              <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-[#fc8019] opacity-50" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Unserviceable Area</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Coming soon to {selectedCity.name}!
              </p>
            </div>
          ) : serviceType === "grocery" ? (
            <GroceryView onUpdateCart={onUpdateCart} />
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
                      <button className="mt-3 bg-white dark:bg-slate-900 text-[#fc8019] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
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
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
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
                    <div className="w-[72px] h-[72px] bg-slate-50 dark:bg-slate-800/50 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3">
                      <img src={category.image} alt={category.name} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {category.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended for You */}
            {recommendedItems.length > 0 && (
              <div className="mt-2 mb-8">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
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
                        className="min-w-[160px] max-w-[160px] bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer flex flex-col"
                      >
                        <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {restaurant?.rating}
                          </div>
                        </div>
                        <div className="p-3.5 flex flex-col flex-1 justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 leading-tight">{item.name}</h3>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-1">{restaurant?.name}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
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
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
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
                      className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 cursor-pointer"
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
                      <div className="p-4 bg-white dark:bg-slate-900">
                        <div className="flex justify-between items-start">
                          <motion.h3
                            layoutId={`restaurant-title-${restaurant.id}`}
                            className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight"
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
                        <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
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
            <div className="mt-12 py-10 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center shrink-0 mb-4 cursor-pointer group">
                <div className="flex items-center">
                  <h1
                    className="text-4xl font-black tracking-tight lowercase text-slate-300 dark:text-slate-600 flex items-baseline group-hover:text-slate-800 dark:text-slate-100 transition-colors duration-500"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {"cra".split("").map((char, index) => (
                      <span key={index} className="inline-block">
                        {char}
                      </span>
                    ))}
                    <span className="text-slate-300 dark:text-slate-600 group-hover:text-[#fc8019] transition-colors duration-500">
                      v
                    </span>
                    <span className="inline-block">e</span>
                  </h1>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 self-end mb-2 ml-0.5 group-hover:bg-[#fc8019] transition-colors duration-500" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
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
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
          >
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Select City</h2>
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
                      ? "border-[#fc8019] bg-orange-50 dark:bg-[#fc8019]/10"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`font-bold text-lg ${selectedCity.id === city.id ? "text-[#fc8019]" : "text-slate-800 dark:text-slate-100"}`}>
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
