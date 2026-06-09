import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, PanInfo } from "motion/react";
import { Splash } from "./components/Splash";
import { Welcome } from "./components/Welcome";
import { Home } from "./components/Home";
import { Menu } from "./components/Menu";
import { Cart } from "./components/Cart";
import { OrderHistory } from "./components/OrderHistory";
import { Tracking } from "./components/Tracking";
import { Profile } from "./components/Profile";
import { GroceryCategoriesScreen } from "./components/GroceryCategoriesScreen";
import { SearchScreen } from "./components/SearchScreen";
import { BottomNav } from "./components/BottomNav";
import { Restaurant, CartItem, MenuItem, Order, Address, City } from "./types";
import { RESTAURANTS, MENU_ITEMS, CITIES } from "./data";

export type Screen =
  | "splash"
  | "welcome"
  | "home"
  | "menu"
  | "cart"
  | "history"
  | "tracking"
  | "profile"
  | "search";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", label: "Home", value: "123 Design Avenue" },
    { id: "2", label: "Work", value: "456 Creative Boulevard" },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
  const [selectedCityId, setSelectedCityId] = useState<string>(CITIES[0].id);
  const [serviceType, setServiceType] = useState<"food" | "grocery">("food");

  const [searchQuery, setSearchQuery] = useState("");

  const selectedCity = CITIES.find(c => c.id === selectedCityId) || CITIES[0];

  let bgClassLight = "bg-slate-50";
  let bgClassDark = "dark:bg-slate-950";
  let themeColor = "#ffffff"; // default light

  const isDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  if (currentScreen === "splash") {
    themeColor = "#fc8019";
    bgClassLight = "bg-[#fc8019]";
    bgClassDark = "dark:bg-[#fc8019]";
  } else if (currentScreen === "home") {
    if (serviceType === "food") {
      themeColor = isDark ? "#e06d10" : "#fc8019";
      bgClassLight = "bg-[#fc8019]"; 
      bgClassDark = "dark:bg-[#e06d10]";
    } else {
      themeColor = isDark ? "#2e0b44" : "#380e52";
      bgClassLight = "bg-[#380e52]";
      bgClassDark = "dark:bg-[#2e0b44]";
    }
  } else if (currentScreen === "menu") {
    themeColor = "#000000"; // dark image gradient
    bgClassLight = "bg-slate-50";
    bgClassDark = "dark:bg-slate-950";
  } else if (currentScreen === "welcome") {
    themeColor = isDark ? "#0f172a" : "#ffffff";
    bgClassLight = "bg-slate-50";
    bgClassDark = "dark:bg-slate-950";
  } else {
    themeColor = isDark ? "#0f172a" : "#ffffff"; // cart, profile, search, history, etc headers are bg-white dark:bg-slate-900
    bgClassLight = "bg-slate-50";
    bgClassDark = "dark:bg-slate-950";
  }

  useEffect(() => {
    // Update theme-color meta tag
    let metaThemeColor = document.getElementById('theme-color-meta');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.id = "theme-color-meta";
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", themeColor);

    // clear the old dynamically created ones to be safe
    document.querySelectorAll('meta[name="theme-color"]:not(#theme-color-meta)').forEach(el => el.remove());

    // Update body class for overscroll color
    document.body.className = `sm:bg-slate-900 sm:dark:bg-slate-900 transition-colors duration-500 ${bgClassLight} ${bgClassDark}`;

  }, [currentScreen, serviceType, isDark, themeColor, bgClassLight, bgClassDark]);

  const handleToggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // If cart has items from another restaurant, we should ideally clear it,
    // but for this model we will just navigate to menu.
    setCurrentScreen("menu");
  };

  const handleUpdateCart = (item: MenuItem, delta: number) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        const nextQuantity = existing.quantity + delta;
        if (nextQuantity <= 0) {
          return prev.filter((c) => c.id !== item.id);
        }
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: nextQuantity } : c,
        );
      } else if (delta > 0) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleUpdateInstructions = (itemId: string, instructions: string) => {
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, instructions } : c)),
    );
  };

  const handleCheckoutComplete = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setCart([]);
    setCurrentScreen("tracking");
  };

  const handleReorder = (order: Order) => {
    const restaurant = RESTAURANTS.find((r) => r.name === order.restaurantName);
    if (!restaurant) return;

    const newCart: CartItem[] = [];
    for (const item of order.items) {
      const menuItem = MENU_ITEMS.find(
        (m) => m.restaurantId === restaurant.id && m.name === item.name,
      );
      if (menuItem) {
        newCart.push({ ...menuItem, quantity: item.quantity });
      }
    }

    setSelectedRestaurant(restaurant);
    setCart(newCart);
    setCurrentScreen("cart");
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showBottomNav = ["home", "cart", "profile", "search"].includes(
    currentScreen,
  );

  return (
    <div className={`fixed inset-0 sm:static sm:min-h-screen sm:h-auto sm:bg-slate-900 sm:dark:bg-slate-900 flex items-center justify-center p-0 sm:p-8 font-sans transition-colors duration-500 ${bgClassLight} ${bgClassDark}`}>
      {/* Simulated Mobile Device Frame */}
      <div className={`w-full h-full sm:flex-none sm:h-[844px] sm:w-[390px] relative overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 flex flex-col transition-colors duration-500 ${bgClassLight} ${bgClassDark}`}>
        {/* Dynamic Island / Top Notch Hardware Simulation (Desktop only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-3xl z-[100] hidden sm:block"></div>

        <motion.div
          className="flex-1 overflow-hidden relative touch-pan-y"
          onPanEnd={(e, info) => {
            const TABS: Screen[] = ["home", "cart", "profile"];
            const SWIPE_THRESHOLD = 50;
            const currentIdx = TABS.indexOf(currentScreen);

            if (currentIdx === -1) return;

            if (Math.abs(info.offset.x) > Math.abs(info.offset.y) * 1.5) {
              if (
                info.offset.x < -SWIPE_THRESHOLD &&
                currentIdx < TABS.length - 1
              ) {
                if (typeof window !== "undefined" && navigator.vibrate)
                  navigator.vibrate(50);
                setCurrentScreen(TABS[currentIdx + 1]);
              } else if (info.offset.x > SWIPE_THRESHOLD && currentIdx > 0) {
                if (typeof window !== "undefined" && navigator.vibrate)
                  navigator.vibrate(50);
                setCurrentScreen(TABS[currentIdx - 1]);
              }
            }
          }}
        >
          <AnimatePresence>
            {currentScreen === "splash" && (
              <Splash
                key="splash"
                onComplete={() => setCurrentScreen("welcome")}
              />
            )}

            {currentScreen === "welcome" && (
              <Welcome key="welcome" onStart={() => setCurrentScreen("home")} />
            )}

            {currentScreen === "home" && (
              <Home
                key="home"
                serviceType={serviceType}
                onServiceTypeChange={setServiceType}
                favorites={favorites}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCityId}
                activeAddress={addresses.find(
                  (a) => a.id === selectedAddressId,
                )}
                onToggleFavorite={handleToggleFavorite}
                onSelectRestaurant={handleSelectRestaurant}
                onViewHistory={() => setCurrentScreen("history")}
                onViewProfile={() => setCurrentScreen("profile")}
                onOpenSearch={(query) => {
                  setSearchQuery(typeof query === "string" ? query : "");
                  setCurrentScreen("search");
                }}
                onUpdateCart={handleUpdateCart}
              />
            )}

            {currentScreen === "menu" && selectedRestaurant && (
              <Menu
                key="menu"
                restaurant={selectedRestaurant}
                cart={cart}
                onUpdateCart={handleUpdateCart}
                onBack={() => setCurrentScreen("home")}
                onCheckout={() => setCurrentScreen("cart")}
              />
            )}

            {currentScreen === "cart" && (
              <Cart
                key="cart"
                cart={cart}
                onUpdateCart={handleUpdateCart}
                onUpdateInstructions={handleUpdateInstructions}
                onBack={() => setCurrentScreen("home")}
                onCheckoutComplete={handleCheckoutComplete}
              />
            )}

            {currentScreen === "history" && (
              <OrderHistory
                key="history"
                onBack={() => setCurrentScreen("home")}
                onTrackOrder={() => setCurrentScreen("tracking")}
                onReorder={handleReorder}
              />
            )}

            {currentScreen === "tracking" && (
              <Tracking
                key="tracking"
                onGoHome={() => setCurrentScreen("home")}
              />
            )}

            {currentScreen === "profile" && (
              <Profile
                key="profile"
                favorites={favorites}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSetAddresses={setAddresses}
                onSelectAddressId={setSelectedAddressId}
                onToggleFavorite={handleToggleFavorite}
                onBack={() => setCurrentScreen("home")}
                onViewOrders={() => setCurrentScreen("history")}
                onSelectRestaurant={handleSelectRestaurant}
              />
            )}

            {currentScreen === "search" && serviceType === "food" && (
              <SearchScreen
                key="search"
                initialQuery={searchQuery}
                selectedCityId={selectedCityId}
                onSelectRestaurant={handleSelectRestaurant}
                onBack={() => setCurrentScreen("home")}
              />
            )}

            {currentScreen === "search" && serviceType === "grocery" && (
              <GroceryCategoriesScreen
                key="grocery_categories"
                onBack={() => setCurrentScreen("home")}
                onUpdateCart={handleUpdateCart}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            cartItemCount={cartItemCount}
            serviceType={serviceType}
          />
        )}

        {/* Home Indicator Hardware Simulation */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full z-[100] hidden sm:block" />
      </div>
    </div>
  );
}
