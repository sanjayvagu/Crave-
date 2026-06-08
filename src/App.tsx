import React, { useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'motion/react';
import { Splash } from './components/Splash';
import { Welcome } from './components/Welcome';
import { Home } from './components/Home';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { OrderHistory } from './components/OrderHistory';
import { Tracking } from './components/Tracking';
import { Profile } from './components/Profile';
import { SearchScreen } from './components/SearchScreen';
import { BottomNav } from './components/BottomNav';
import { Restaurant, CartItem, MenuItem } from './types';

export type Screen = 'splash' | 'welcome' | 'home' | 'menu' | 'cart' | 'history' | 'tracking' | 'profile' | 'search';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // If cart has items from another restaurant, we should ideally clear it, 
    // but for this model we will just navigate to menu.
    setCurrentScreen('menu');
  };

  const handleUpdateCart = (item: MenuItem, delta: number) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        const nextQuantity = existing.quantity + delta;
        if (nextQuantity <= 0) {
          return prev.filter(c => c.id !== item.id);
        }
        return prev.map(c => c.id === item.id ? { ...c, quantity: nextQuantity } : c);
      } else if (delta > 0) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleCheckoutComplete = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setCart([]);
    setCurrentScreen('tracking');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showBottomNav = ['home', 'cart', 'profile', 'search'].includes(currentScreen);

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-slate-50 dark:bg-slate-950 sm:bg-slate-900 sm:dark:bg-slate-900 flex items-center justify-center p-0 sm:p-8 font-sans">
      {/* Simulated Mobile Device Frame */}
      <div className="w-full flex-1 sm:flex-none h-[100dvh] sm:h-[844px] sm:w-[390px] bg-slate-50 dark:bg-slate-950 relative overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 flex flex-col">
        
        {/* Dynamic Island / Top Notch Hardware Simulation (Desktop only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-3xl z-[100] hidden sm:block"></div>

        <motion.div 
          className="flex-1 overflow-hidden relative touch-pan-y"
          onPanEnd={(e, info) => {
            const TABS: Screen[] = ['home', 'cart', 'profile'];
            const SWIPE_THRESHOLD = 50;
            const currentIdx = TABS.indexOf(currentScreen);
            
            if (currentIdx === -1) return;
            
            if (Math.abs(info.offset.x) > Math.abs(info.offset.y) * 1.5) {
              if (info.offset.x < -SWIPE_THRESHOLD && currentIdx < TABS.length - 1) {
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                setCurrentScreen(TABS[currentIdx + 1]);
              } else if (info.offset.x > SWIPE_THRESHOLD && currentIdx > 0) {
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                setCurrentScreen(TABS[currentIdx - 1]);
              }
            }
          }}
        >
          <AnimatePresence>
            {currentScreen === 'splash' && (
              <Splash 
                key="splash" 
                onComplete={() => setCurrentScreen('welcome')} 
              />
            )}

            {currentScreen === 'welcome' && (
              <Welcome 
                key="welcome" 
                onStart={() => setCurrentScreen('home')} 
              />
            )}

            {currentScreen === 'home' && (
              <Home 
                key="home" 
                onSelectRestaurant={handleSelectRestaurant} 
                onViewHistory={() => setCurrentScreen('history')}
                onViewProfile={() => setCurrentScreen('profile')}
                onOpenSearch={() => setCurrentScreen('search')}
              />
            )}
            
            {currentScreen === 'menu' && selectedRestaurant && (
              <Menu 
                key="menu"
                restaurant={selectedRestaurant}
                cart={cart}
                onUpdateCart={handleUpdateCart}
                onBack={() => setCurrentScreen('home')}
                onCheckout={() => setCurrentScreen('cart')}
              />
            )}

            {currentScreen === 'cart' && (
              <Cart 
                key="cart"
                cart={cart}
                onUpdateCart={handleUpdateCart}
                onBack={() => setCurrentScreen('home')}
                onCheckoutComplete={handleCheckoutComplete}
              />
            )}

            {currentScreen === 'history' && (
              <OrderHistory 
                key="history"
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'tracking' && (
              <Tracking 
                key="tracking"
                onGoHome={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'profile' && (
              <Profile 
                key="profile"
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'search' && (
              <SearchScreen 
                key="search"
                onSelectRestaurant={handleSelectRestaurant}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {showBottomNav && (
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen} 
            cartItemCount={cartItemCount} 
          />
        )}

        {/* Home Indicator Hardware Simulation */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full z-[100] hidden sm:block" />
      </div>
    </div>
  );
}
