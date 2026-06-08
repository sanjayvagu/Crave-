import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  User,
  CreditCard,
  MapPin,
  Bell,
  LogOut,
  ChevronRight,
  Plus,
  MapPin as MapPinIcon,
  Check,
  Wallet,
  Smartphone,
  Landmark,
  Moon,
  Sun,
  ShoppingBag,
  Heart,
  Star,
  Clock,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { RESTAURANTS } from "../data";
import { Restaurant, Address } from "../types";

interface ProfileProps {
  favorites: string[];
  addresses: Address[];
  selectedAddressId: string;
  onSetAddresses: (addresses: Address[]) => void;
  onSelectAddressId: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onViewOrders?: () => void;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  favorites,
  addresses,
  selectedAddressId,
  onSetAddresses,
  onSelectAddressId,
  onToggleFavorite,
  onBack,
  onViewOrders,
  onSelectRestaurant,
}) => {
  const [activeView, setActiveView] = useState<
    "main" | "edit" | "payment" | "address" | "wishlist"
  >("main");
  const { theme, toggleTheme } = useTheme();

  const favoriteRestaurants = RESTAURANTS.filter((r) =>
    favorites.includes(r.id),
  );

  const menuItems = [
    {
      id: "orders",
      icon: ShoppingBag,
      label: "My Orders",
      value: "3 Active, 12 Past",
      onClick: onViewOrders,
    },
    {
      id: "wishlist",
      icon: Heart,
      label: "Saved Restaurants",
      value: `${favoriteRestaurants.length} Restaurants`,
    },
    { id: "edit", icon: User, label: "Edit Profile", value: "Jane Doe" },
    {
      id: "payment",
      icon: CreditCard,
      label: "Payment Methods",
      value: "2 Cards",
    },
    {
      id: "address",
      icon: MapPin,
      label: "Saved Addresses",
      value: `${addresses.length} Saved`,
    },
    {
      id: "theme",
      icon: theme === "dark" ? Sun : Moon,
      label: "Dark Mode",
      value: theme === "dark" ? "On" : "Off",
      onClick: toggleTheme,
    },
    { id: null, icon: Bell, label: "Notifications", value: "On" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%", zIndex: 10 }}
      animate={{ opacity: 1, x: 0, zIndex: 10 }}
      exit={{ opacity: 0, x: "100%", zIndex: 10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {activeView === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full w-full absolute inset-0"
          >
            <div className="flex items-center gap-4 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                Profile
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              <div className="bg-white dark:bg-slate-900 p-6 shadow-sm border-b border-slate-100 dark:border-slate-800 flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shadow-md">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Jane Doe"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Jane Doe
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  jane.doe@example.com
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  +1 (555) 123-4567
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-y border-slate-100 dark:border-slate-800 mt-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.id && item.id !== "theme") {
                          setActiveView(item.id as any);
                        }
                      }}
                      whileHover={{
                        backgroundColor:
                          theme === "dark" ? "#1e293b" : "#f8fafc",
                      }}
                      whileTap={{
                        backgroundColor:
                          theme === "dark" ? "#334155" : "#f1f5f9",
                      }}
                      className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">
                            {item.label}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.value}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 px-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-red-100 dark:border-red-500/20 shadow-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-12 py-10 flex flex-col items-center justify-center">
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
          </motion.div>
        )}

        {activeView === "edit" && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full absolute inset-0 bg-white dark:bg-slate-900"
          >
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveView("main")}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Edit Profile
                </h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32">
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer mb-2">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold shadow-sm">
                      Change
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Jane Doe"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="jane.doe@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView("main")}
                className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeView === "address" && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full absolute inset-0 bg-slate-50 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveView("main")}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Saved Addresses
                </h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-4">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => onSelectAddressId(addr.id)}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border shadow-sm relative overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#fc8019] ring-1 ring-[#fc8019]"
                        : "border-slate-200 dark:border-slate-700 hover:border-[#fc8019]/50"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-orange-50 dark:bg-orange-500/10 text-[#fc8019]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <MapPinIcon className="w-6 h-6" />
                      </div>
                      <div className="pr-10">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                          {addr.label}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                          {addr.value}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                      <button className="text-sm font-bold text-[#fc8019]">
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetAddresses(
                            addresses.filter((a) => a.id !== addr.id),
                          );
                          if (isSelected) {
                            onSelectAddressId(
                              addresses.find((a) => a.id !== addr.id)?.id || "",
                            );
                          }
                        }}
                        className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              <motion.button
                onClick={() => {
                  const newId = Date.now().toString();
                  onSetAddresses([
                    ...addresses,
                    {
                      id: newId,
                      label: "New Address",
                      value: "789 New Location St, City",
                    },
                  ]);
                  onSelectAddressId(newId);
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-50 dark:bg-[#fc8019]/10 border border-orange-200 dark:border-[#fc8019]/30 text-[#fc8019] border-dashed font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeView === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full absolute inset-0 bg-slate-50 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveView("main")}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Payment Methods
                </h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
              <div>
                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-3">
                  Saved Cards
                </h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden mb-3 group">
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">
                        •••• •••• •••• 4242
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden mb-4 group">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">
                        •••• •••• •••• 8899
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Expires 08/24
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  Add New Card
                </motion.button>
              </div>

              <div>
                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-3">
                  Other Methods
                </h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Net Banking
                    </span>
                  </div>
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      UPI Apps
                    </span>
                  </div>
                  <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-10 h-10 bg-[#fc8019]/10 dark:bg-[#fc8019]/20 rounded-xl flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-[#fc8019]" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Store Wallet ($45.50)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "wishlist" && (
          <motion.div
            key="wishlist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full absolute inset-0 bg-slate-50 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveView("main")}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Saved Restaurants
                </h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32">
              <div className="flex flex-col gap-4">
                {favoriteRestaurants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                    <Heart className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-medium text-lg text-slate-800 dark:text-slate-200">
                      No saved restaurants
                    </p>
                    <p className="text-sm">
                      Tap the heart icon on any restaurant to save it.
                    </p>
                  </div>
                ) : (
                  favoriteRestaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      onClick={() =>
                        onSelectRestaurant && onSelectRestaurant(restaurant)
                      }
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex cursor-pointer relative"
                    >
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(restaurant.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 z-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center p-0 border border-white/30"
                      >
                        <Heart className="w-4 h-4 fill-[#fc8019] text-[#fc8019]" />
                      </motion.button>
                      <div className="w-1/3 min-w-[100px]">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#fc8019] fill-current" />
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              {restaurant.rating}
                            </span>
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {restaurant.deliveryTime}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
