import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Clock,
  MoreHorizontal,
  Search,
  Star,
  Plus,
  Minus,
  Utensils,
} from "lucide-react";
import { Restaurant, MenuItem, CartItem } from "../types";
import { MENU_ITEMS } from "../data";

interface MenuProps {
  restaurant: Restaurant;
  cart: CartItem[];
  isVegMode?: boolean;
  isVendorOnline?: boolean;
  onUpdateCart: (item: MenuItem, delta: number) => void;
  onBack: () => void;
  onCheckout: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  restaurant,
  cart,
  isVegMode = false,
  isVendorOnline = true,
  onUpdateCart,
  onBack,
  onCheckout,
}) => {
  const menuItems = useMemo(
    () => MENU_ITEMS.filter((m) => m.restaurantId === restaurant.id),
    [restaurant.id],
  );
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(menuItems.map((m) => m.category || "Other"))),
    ],
    [menuItems],
  );
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"All" | "Veg" | "Non-Veg">(
    isVegMode ? "Veg" : "All"
  );
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((m) => {
      const categoryMatch =
        activeCategory === "All" || (m.category || "Other") === activeCategory;
      const searchMatch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const dietaryMatch =
        dietaryFilter === "All" ||
        (dietaryFilter === "Veg" && m.isVeg) ||
        (dietaryFilter === "Non-Veg" && !m.isVeg);
      return categoryMatch && searchMatch && dietaryMatch;
    });
  }, [menuItems, activeCategory, searchQuery, dietaryFilter]);

  const getItemQuantity = (itemId: string) => {
    return cart.find((c) => c.id === itemId)?.quantity || 0;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%", zIndex: 10 }}
      animate={{ opacity: 1, x: 0, zIndex: 10 }}
      exit={{ opacity: 0, x: "100%", zIndex: 10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50  overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Parallax Header */}
        <div className="relative h-64 bg-black/10">
          <motion.img
            layoutId={`restaurant-img-${restaurant.id}`}
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-between">
            {/* Top Bar inside image */}
            <div className="flex justify-between items-center z-10 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="pb-2">
              <motion.h1
                layoutId={`restaurant-title-${restaurant.id}`}
                className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
              >
                {restaurant.name}
              </motion.h1>
              <div className="flex items-center gap-4 mt-2 text-white/90 text-sm font-medium drop-shadow-md">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white text-white" />
                  {restaurant.rating}{" "}
                  <span className="opacity-75 text-xs ml-1">
                    ({restaurant.reviewCount}+)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {restaurant.deliveryTime}
                </div>
                <div>{restaurant.tags.join(", ")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white  rounded-t-3xl -mt-6 relative z-10 pt-8 px-5 min-h-screen">
          {!isVendorOnline && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex flex-col items-center justify-center text-center">
              <span className="text-orange-600 font-bold text-lg mb-1">Currently Offline</span>
              <span className="text-orange-500/80 text-sm font-medium">This vendor is not accepting orders at the moment.</span>
            </div>
          )}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-slate-800 ">
                Menu
              </h2>
              <div className="flex items-center gap-2">
                {(["All", "Veg", "Non-Veg"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDietaryFilter(filter)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      dietaryFilter === filter
                        ? "border-[#fc8019] bg-orange-50 text-[#fc8019] "
                        : "border-slate-200  text-slate-600  hover:bg-slate-50 :bg-slate-800"
                    }`}
                  >
                    {filter === "Veg" && (
                      <div className="w-3 h-3 border border-green-500 flex items-center justify-center rounded-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                    {filter === "Non-Veg" && (
                      <div className="w-3 h-3 border border-red-500 flex items-center justify-center rounded-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                    {filter === "All" && (
                      <div className="w-3 h-3 flex justify-center items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fc8019]"></div>
                      </div>
                    )}
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-2">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100  text-slate-800  pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#fc8019]/50 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          <motion.div
            className="flex flex-col gap-8 pb-12"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {(activeCategory === "All"
                ? categories.filter((c) => c !== "All")
                : [activeCategory]
              ).map((category) => {
                const categoryItems = filteredItems.filter(
                  (item) => (item.category || "Other") === category,
                );
                if (categoryItems.length === 0) return null;

                return (
                  <motion.div
                    layout
                    key={category}
                    className="mb-4"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <h2 className="text-xl font-bold text-slate-800  mb-6">
                      {category}
                    </h2>
                    <motion.div
                      className="flex flex-col gap-8"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.08,
                          },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {categoryItems.map((item) => {
                            const qty = getItemQuantity(item.id);
                            return (
                              <motion.div
                                layout
                                variants={{
                                  hidden: { opacity: 0, x: -25 },
                                  visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                      type: "spring",
                                      stiffness: 260,
                                      damping: 20,
                                    },
                                  },
                                  exit: { opacity: 0, scale: 0.95 },
                                }}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                key={item.id}
                                className="flex justify-between group"
                              >
                                <div className="flex-1 pr-4">
                                  <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center mb-1">
                                    <div
                                      className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}
                                    ></div>
                                  </div>
                                  <h3 className="font-bold text-slate-800  text-lg leading-tight">
                                    {item.name}
                                  </h3>
                                  <p className="font-bold text-slate-700  mt-1">
                                    ₹{item.price.toFixed(2)}
                                  </p>
                                  <p className="text-slate-500  text-sm mt-2 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="relative">
                                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>

                                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                                    <AnimatePresence mode="popLayout">
                                      {!isVendorOnline ? (
                                        <div className="bg-slate-100 text-slate-400 font-bold text-[10px] px-2 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center w-28 relative z-20 whitespace-nowrap overflow-hidden">
                                          Unavailable
                                        </div>
                                      ) : qty === 0 ? (
                                        <motion.button
                                          key="add"
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0.8, opacity: 0 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => onUpdateCart(item, 1)}
                                          className="bg-white  text-[#fc8019] font-bold text-sm px-6 py-2 rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.1)] border border-[#fc8019]/20 flex items-center justify-center w-28 relative z-20"
                                        >
                                          ADD
                                        </motion.button>
                                      ) : (
                                        <motion.div
                                          key="qty"
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0.8, opacity: 0 }}
                                          className="bg-white  text-[#fc8019] font-bold shadow-[0_4px_15px_rgb(0,0,0,0.1)] border border-[#fc8019]/20 rounded-xl flex items-center justify-between w-28 h-[38px] px-2 relative z-20 shrink-0"
                                        >
                                          <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() =>
                                              onUpdateCart(item, -1)
                                            }
                                            className="p-1"
                                          >
                                            <Minus className="w-4 h-4" />
                                          </motion.button>
                                          <motion.span
                                            key={qty}
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-slate-800 "
                                          >
                                            {qty}
                                          </motion.span>
                                          <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() =>
                                              onUpdateCart(item, 1)
                                            }
                                            className="p-1"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </motion.button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Floating Cart Bar (Glassmorphic) */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-5 right-5 z-40"
            onClick={onCheckout}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#60b246] shadow-xl shadow-[#60b246]/30 text-white p-4 rounded-2xl flex items-center justify-between cursor-pointer"
            >
              <div>
                <motion.div
                  key={totalCartItems}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-bold uppercase text-xs tracking-wider"
                >
                  {totalCartItems} ITEM{totalCartItems > 1 && "S"}
                </motion.div>
                <motion.div
                  key={totalCartValue}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-bold text-lg leading-tight mt-0.5"
                >
                  ₹{totalCartValue.toFixed(2)}
                </motion.div>
              </div>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
                <span>View Cart</span>
                <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Category Menu Button */}
      <AnimatePresence>
        {!isMenuModalOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuModalOpen(true)}
            className={`absolute right-5 z-30 bg-[#2d2e32] text-white font-bold rounded-full px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-[#3e3f43] flex items-center justify-center gap-2 transition-all duration-300 ${totalCartItems > 0 ? "bottom-[100px]" : "bottom-8"}`}
          >
            <Utensils className="w-5 h-5 text-white" />
            <span className="text-sm">Menu</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Jump to Category Modal */}
      <AnimatePresence>
        {isMenuModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-5"
            onClick={() => setIsMenuModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white  w-full max-w-sm rounded-[32px] p-6 mb-16 shadow-2xl origin-bottom"
            >
              <h3 className="font-bold text-xs uppercase text-slate-500 mb-4 tracking-wider text-center">
                Jump to Category
              </h3>
              <div className="flex flex-col max-h-[50vh] overflow-y-auto no-scrollbar pb-2">
                {categories.map((c) => {
                  const count =
                    c === "All"
                      ? menuItems.length
                      : menuItems.filter((m) => (m.category || "Other") === c)
                          .length;
                  return (
                    <button
                      key={c}
                      className={`flex justify-between items-center py-3.5 border-b border-slate-100  last:border-0 ${activeCategory === c ? "text-[#fc8019] font-bold" : "text-slate-800 "}`}
                      onClick={() => {
                        setActiveCategory(c);
                        setIsMenuModalOpen(false);
                      }}
                    >
                      <span
                        className={`text-[15px] ${activeCategory === c ? "font-bold" : "font-medium"}`}
                      >
                        {c}
                      </span>
                      <span
                        className={`text-sm ${activeCategory === c ? "font-bold text-[#fc8019]" : "font-medium opacity-50"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
