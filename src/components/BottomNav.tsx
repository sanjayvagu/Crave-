import React, { useRef } from "react";
import { motion, PanInfo } from "motion/react";
import { Home, ShoppingCart, User, Search } from "lucide-react";
import { Screen } from "../App";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartItemCount: number;
}

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "profile", label: "Profile", icon: User },
] as const;

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  cartItemCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = () => {
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      try {
        window.navigator.vibrate(40);
      } catch (e) {
        console.warn("Vibration not supported or blocked");
      }
    }
  };

  const handleGlide = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (clientY < rect.top - 40 || clientY > rect.bottom + 40) return;

    const x = clientX - rect.left;
    const width = rect.width;
    const index = Math.floor((x / width) * TABS.length);
    const clampedIndex = Math.max(0, Math.min(TABS.length - 1, index));
    const targetTab = TABS[clampedIndex].id as Screen;

    if (targetTab !== currentScreen && TABS.some((t) => t.id === targetTab)) {
      triggerHaptic();
      onNavigate(targetTab);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleGlide(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.buttons === 1) {
      handleGlide(e.clientX, e.clientY);
    }
  };

  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-center gap-3 px-5 z-[90]"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <motion.div
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onPointerMove={handlePointerMove}
        className="flex-1 flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_32px_rgb(0,0,0,0.08)] rounded-full p-1 items-center relative touch-none"
      >
        {TABS.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id as Screen)}
              className="relative flex-1 flex flex-col items-center justify-center h-[56px] rounded-full z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-slate-200/80 dark:bg-slate-800/80 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div
                  key={tab.id === "cart" ? `cart-${cartItemCount}` : tab.id}
                  initial={
                    tab.id === "cart" && cartItemCount > 0
                      ? { scale: 1.2 }
                      : { scale: 1 }
                  }
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className={`mb-0.5 transition-colors duration-300 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      fill: isActive ? "currentColor" : "none",
                      strokeWidth: isActive ? 2 : 2.5,
                    }}
                  />
                  {tab.id === "cart" && cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#fc8019] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`text-[11px] font-bold tracking-tight transition-colors duration-300 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </motion.div>

      <button
        onClick={() => onNavigate("search")}
        className={`w-[64px] h-[64px] shrink-0 rounded-full flex flex-col items-center justify-center shadow-[0_8px_32px_rgb(0,0,0,0.08)] border border-white/60 dark:border-slate-700/60 backdrop-blur-2xl transition-colors duration-300 ${currentScreen === "search" ? "bg-slate-200/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400" : "bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400"}`}
      >
        <Search
          className="w-6 h-6"
          style={{
            fill: currentScreen === "search" ? "currentColor" : "none",
            strokeWidth: currentScreen === "search" ? 3 : 2.5,
          }}
        />
      </button>
    </div>
  );
};
