import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, MoreHorizontal, Search, Star, Plus, Minus } from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data';

interface MenuProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onUpdateCart: (item: MenuItem, delta: number) => void;
  onBack: () => void;
  onCheckout: () => void;
}

export const Menu: React.FC<MenuProps> = ({ restaurant, cart, onUpdateCart, onBack, onCheckout }) => {
  const menuItems = useMemo(() => MENU_ITEMS.filter(m => m.restaurantId === restaurant.id), [restaurant.id]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(menuItems.map(m => m.category || 'Other')))], [menuItems]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const filteredItems = useMemo(() => activeCategory === 'All' ? menuItems : menuItems.filter(m => (m.category || 'Other') === activeCategory), [menuItems, activeCategory]);
  
  const getItemQuantity = (itemId: string) => {
    return cart.find(c => c.id === itemId)?.quantity || 0;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%", zIndex: 10 }}
      animate={{ opacity: 1, x: 0, zIndex: 10 }}
      exit={{ opacity: 0, x: "100%", zIndex: 10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 overflow-hidden"
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
            <div className="flex justify-between items-center z-10 pt-2">
              <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Search className="w-5 h-5" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div className="pb-2">
              <motion.h1 layoutId={`restaurant-title-${restaurant.id}`} className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                {restaurant.name}
              </motion.h1>
              <div className="flex items-center gap-4 mt-2 text-white/90 text-sm font-medium drop-shadow-md">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white text-white" />
                  {restaurant.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {restaurant.deliveryTime}
                </div>
                <div>{restaurant.tags.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10 pt-8 px-5 min-h-screen">
          <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6 pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                  activeCategory === category
                    ? 'bg-slate-800 text-white shadow-slate-800/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-8 pb-12">
            <AnimatePresence mode="popLayout">
              {(activeCategory === 'All' ? categories.filter(c => c !== 'All') : [activeCategory]).map(category => {
                const categoryItems = filteredItems.filter(item => (item.category || 'Other') === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <motion.div layout key={category} className="mb-4">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{category}</h2>
                    <div className="flex flex-col gap-8">
                      {categoryItems.map((item) => {
                        const qty = getItemQuantity(item.id);
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            key={item.id} 
                            className="flex justify-between group"
                          >
                          <div className="flex-1 pr-4">
                            <div className="w-4 h-4 border border-slate-300 rounded flex items-center justify-center mb-1">
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h3>
                            <p className="font-bold text-slate-700 mt-1">${item.price.toFixed(2)}</p>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          
                          <div className="relative">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                              <AnimatePresence mode="popLayout">
                                {qty === 0 ? (
                                  <motion.button
                                    key="add"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onUpdateCart(item, 1)}
                                    className="bg-white text-[#fc8019] font-bold text-sm px-6 py-2 rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.1)] border border-[#fc8019]/20 flex items-center justify-center w-24 relative z-20"
                                  >
                                    ADD
                                  </motion.button>
                                ) : (
                                  <motion.div 
                                    key="qty"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="bg-white text-[#fc8019] font-bold shadow-[0_4px_15px_rgb(0,0,0,0.1)] border border-[#fc8019]/20 rounded-xl flex items-center justify-between w-24 h-[38px] px-2 relative z-20"
                                  >
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => onUpdateCart(item, -1)} className="p-1"><Minus className="w-4 h-4" /></motion.button>
                                    <motion.span 
                                      key={qty}
                                      initial={{ scale: 1.5, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="text-slate-800"
                                    >
                                      {qty}
                                    </motion.span>
                                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => onUpdateCart(item, 1)} className="p-1"><Plus className="w-4 h-4" /></motion.button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar (Glassmorphic) */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-5 right-5 z-50"
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
                  {totalCartItems} ITEM{totalCartItems > 1 && 'S'}
                </motion.div>
                <motion.div
                  key={totalCartValue}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-bold text-lg leading-tight mt-0.5"
                >
                  ${totalCartValue.toFixed(2)}
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
    </motion.div>
  );
};
