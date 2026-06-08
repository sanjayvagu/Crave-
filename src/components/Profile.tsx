import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, CreditCard, MapPin, Bell, LogOut, ChevronRight, Plus, MapPin as MapPinIcon, Check, Wallet, Smartphone, Landmark, Moon, Sun, ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ProfileProps {
  onBack: () => void;
  onViewOrders?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack, onViewOrders }) => {
  const [activeView, setActiveView] = useState<'main' | 'edit' | 'payment' | 'address' | 'wishlist'>('main');
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'orders', icon: ShoppingBag, label: 'My Orders', value: '3 Active, 12 Past', onClick: onViewOrders },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', value: '4 Restaurants, 12 Items' },
    { id: 'edit', icon: User, label: 'Edit Profile', value: 'Jane Doe' },
    { id: 'payment', icon: CreditCard, label: 'Payment Methods', value: '2 Cards' },
    { id: 'address', icon: MapPin, label: 'Saved Addresses', value: 'Home, Work' },
    { id: 'theme', icon: theme === 'dark' ? Sun : Moon, label: 'Dark Mode', value: theme === 'dark' ? 'On' : 'Off', onClick: toggleTheme },
    { id: null, icon: Bell, label: 'Notifications', value: 'On' },
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
        {activeView === 'main' && (
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
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Profile</h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              <div className="bg-white dark:bg-slate-900 p-6 shadow-sm border-b border-slate-100 dark:border-slate-800 flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shadow-md">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Jane Doe" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Jane Doe</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">jane.doe@example.com</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">+1 (555) 123-4567</p>
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
                        } else if (item.id && item.id !== 'theme') {
                          setActiveView(item.id as any);
                        }
                      }}
                      whileHover={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                      whileTap={{ backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }}
                      className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{item.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
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
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-red-100 shadow-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-12 py-10 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center shrink-0 mb-4 cursor-pointer group">
                  <div className="flex items-center">
                    <h1 className="text-4xl font-black tracking-tight lowercase text-slate-300 dark:text-slate-600 flex items-baseline group-hover:text-slate-800 dark:text-slate-100 transition-colors duration-500" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {"cra".split("").map((char, index) => (
                        <span key={index} className="inline-block">{char}</span>
                      ))}
                      <span className="text-slate-300 dark:text-slate-600 group-hover:text-[#fc8019] transition-colors duration-500">v</span>
                      <span className="inline-block">e</span>
                    </h1>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 self-end mb-2 ml-0.5 group-hover:bg-[#fc8019] transition-colors duration-500" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Developed by Sanjay vagu</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'edit' && (
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
                  onClick={() => setActiveView('main')}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Edit Profile</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32">
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer mb-2">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold shadow-sm">Change</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                  <input type="text" defaultValue="Jane Doe" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
                  <input type="email" defaultValue="jane.doe@example.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Phone Number</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#fc8019] transition-colors" />
                </div>
              </div>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('main')}
                className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeView === 'address' && (
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
                  onClick={() => setActiveView('main')}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Saved Addresses</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                     <MapPinIcon className="w-6 h-6 text-[#fc8019]" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Home</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">123 Design Avenue, Tech Park Building A, Floor 5, NY 10001</p>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                   <button className="text-sm font-bold text-[#fc8019]">Edit</button>
                   <button className="text-sm font-bold text-slate-400 dark:text-slate-500">Delete</button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                     <MapPinIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Office</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">456 Corporate Towers, Block C, NY 10002</p>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                   <button className="text-sm font-bold text-[#fc8019]">Edit</button>
                   <button className="text-sm font-bold text-slate-400 dark:text-slate-500">Delete</button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full bg-orange-50 border border-orange-200 text-[#fc8019] border-dashed font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeView === 'payment' && (
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
                  onClick={() => setActiveView('main')}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Payment Methods</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6">
              
              <div>
                 <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-3">Saved Cards</h2>
                 <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden mb-3 group">
                   <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                     <Check className="w-3.5 h-3.5" />
                   </div>
                   <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">•••• •••• •••• 4242</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Expires 12/25</p>
                      </div>
                   </div>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden mb-4 group">
                   <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-0.5">•••• •••• •••• 8899</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Expires 08/24</p>
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
                 <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-3">Other Methods</h2>
                 <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">Net Banking</span>
                   </div>
                   <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">UPI Apps</span>
                   </div>
                   <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                      <div className="w-10 h-10 bg-[#fc8019]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-[#fc8019]" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">Store Wallet ($45.50)</span>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'wishlist' && (
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
                  onClick={() => setActiveView('main')}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Wishlist</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-32 flex flex-col items-center justify-center">
               <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
               <p className="text-slate-500 dark:text-slate-400 font-medium">Your wishlist is currently empty.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

