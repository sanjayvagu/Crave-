import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
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
import { RESTAURANTS } from "../data";
import { Restaurant, Address } from "../types";
import { PullToRefresh } from "./PullToRefresh";

interface HomeProps {
  favorites: string[];
  activeAddress?: Address;
  onToggleFavorite: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onOpenSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({
  favorites,
  activeAddress,
  onToggleFavorite,
  onSelectRestaurant,
  onViewHistory,
  onViewProfile,
  onOpenSearch,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnableLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setIsLocating(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-32">
          {/* Header - Glassmorphic */}
          <div className="sticky top-0 z-50 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 px-4">
            <div className="flex items-center justify-between gap-2">
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
                  className="text-2xl font-black tracking-tight lowercase text-slate-800 dark:text-slate-100 flex items-baseline"
                  style={{ fontFamily: "Outfit, sans-serif" }}
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
                      className="inline-block group-hover:text-[#fc8019] transition-colors"
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
                    className="text-[#fc8019] inline-block origin-bottom"
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
                    className="inline-block group-hover:text-[#fc8019] transition-colors"
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
                  className="w-1 h-1 rounded-full bg-[#fc8019] self-end mb-1.5 ml-0.5 group-hover:scale-150 transition-transform"
                />
              </motion.div>

              {/* Address */}
              <div
                onClick={handleEnableLocation}
                className="flex flex-col flex-1 items-center justify-center truncate cursor-pointer group"
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
                      className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-[#fc8019] border-t-transparent"
                    />
                  ) : (
                    <MapPin className="text-[#fc8019] w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="flex items-center font-bold text-xs text-slate-800 dark:text-slate-100">
                    {activeAddress?.label || "Location"}{" "}
                    <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-[#fc8019] transition-colors" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-32 text-center pl-2 group-hover:text-slate-800 dark:text-slate-100 transition-colors">
                  {isLocating
                    ? "Locating..."
                    : activeAddress?.value || "Select Location"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onViewHistory}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <History className="w-4 h-4" />
                </motion.button>
                <motion.div
                  onClick={onViewProfile}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer w-9 h-9 rounded-full overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src="https://i.pravatar.cc/100?img=11"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Search Bar Placeholder */}
            <motion.div
              onClick={onOpenSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex items-center bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-3 border border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-1" />
              <p className="flex-1 ml-3 text-slate-400 dark:text-slate-500">
                Search for restaurants, cuisines...
              </p>
            </motion.div>
          </div>

          <div className="px-5 pb-8 pt-4">
            {/* Promotional Offers */}
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-6 -mx-5 px-5">
              {isLoading ? (
                <>
                  <div className="min-w-[280px] h-36 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="min-w-[280px] h-36 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Top Restaurants */}
            <div className="mt-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                Top Restaurants to explore
              </h2>
              <div className="flex flex-col gap-6">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((key) => (
                      <div
                        key={key}
                        className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 dark:border-slate-800"
                      >
                        <div className="h-44 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        <div className="p-4 bg-white dark:bg-slate-900">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                          </div>
                          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-3"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  RESTAURANTS.map((restaurant) => (
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
                  ))
                )}
              </div>
            </div>

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
    </motion.div>
  );
};
