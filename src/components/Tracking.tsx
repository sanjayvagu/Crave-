import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  Navigation,
  Phone,
  X,
  Share2,
} from "lucide-react";

interface TrackingProps {
  onGoHome: () => void;
}

const STATUSES = [
  {
    id: "accepted",
    label: "Order Placed",
    icon: CheckCircle2,
    delay: 0,
    subtext: "Restaurant has received your order",
  },
  {
    id: "preparing",
    label: "Preparing",
    icon: ChefHat,
    delay: 2000,
    subtext: "Your food is being prepared",
  },
  {
    id: "ontheway",
    label: "Out for Delivery",
    icon: Bike,
    delay: 5000,
    subtext: "Delivery partner has picked up your order",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: MapPin,
    delay: 9000,
    subtext: "Enjoy your food!",
  },
];

export const Tracking: React.FC<TrackingProps> = ({ onGoHome }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.floor(Math.random() * (30 * 60 - 20 * 60 + 1) + 20 * 60),
  );
  const [showDialer, setShowDialer] = useState(false);

  const handleCallDriver = () => {
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      try {
        window.navigator.vibrate(40);
      } catch (e) {
        // Ignore
      }
    }
    setShowDialer(true);
  };

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];

    STATUSES.forEach((status, index) => {
      if (index === 0) return;
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, status.delay);
      timers.push(timer);
    });

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentStep / (STATUSES.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 z-50 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => alert("Location link shared with friends!")}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs font-bold mr-1">Share</span>
        </motion.button>
      </div>

      {/* Map Placeholder Area */}
      <div className="h-2/5 w-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
        {/* Simulated Map Background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Route line simulation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-full h-full text-slate-400 dark:text-slate-500"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 20 80 Q 40 20, 80 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Home Location */}
        <div className="absolute top-1/4 right-1/4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#fc8019]/20 rounded-full animate-ping absolute -inset-2"></div>
            <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center relative z-10 text-[#fc8019]">
              <Home className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Courier Location (animates along route) */}
        <AnimatePresence>
          {currentStep >= 2 && currentStep < 3 && (
            <motion.div
              initial={{ x: -100, y: 100, opacity: 0 }}
              animate={{ x: "-10%", y: "-10%", opacity: 1 }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute top-[40%] left-[40%]"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-slate-800 rounded-full shadow-xl flex items-center justify-center relative z-10 text-white">
                  <Bike className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onGoHome}
          className="absolute left-5 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm"
          style={{ top: "max(1.25rem, env(safe-area-inset-top))" }}
        >
          <Home className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Tracking Info Card */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl -mt-6 relative z-20 shadow-[0_-10px_40px_rgb(0,0,0,0.08)] p-6 flex flex-col">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1">
            {currentStep === 3
              ? "Arrived!"
              : `Arriving in ${formatTime(timeLeft)}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            {currentStep === 3
              ? "Your order has been delivered."
              : "Your order is on the way."}
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8 relative mt-2 px-2">
          {/* Background Track */}
          <div className="absolute top-5 left-10 right-10 h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full"></div>

          {/* Animated Fill Track */}
          <div className="absolute top-5 left-10 right-10 h-[3px] rounded-full overflow-visible">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#60b246] to-[#7be45a] rounded-full flex items-center justify-end"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStep / (STATUSES.length - 1)) * 100}%`,
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 60,
                damping: 15,
              }}
            >
              <AnimatePresence>
                {currentStep > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-3 h-3 bg-white rounded-full border-[2.5px] border-[#60b246] shadow-[0_0_15px_rgba(96,178,70,0.8)] z-20 absolute -right-1.5 flex items-center justify-center shrink-0"
                  >
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-1 h-1 bg-[#60b246] rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex justify-between relative z-10">
            {STATUSES.map((status, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              const Icon = status.icon;

              return (
                <div
                  key={status.id}
                  className="flex flex-col items-center relative"
                >
                  <motion.div
                    layout
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      backgroundColor: isCompleted ? "#60b246" : "#f8fafc",
                      color: isCompleted ? "#ffffff" : "#94a3b8",
                      borderColor: isCurrent
                        ? "#60b246"
                        : isCompleted
                          ? "#60b246"
                          : "#e2e8f0",
                      boxShadow: isCurrent
                        ? "0 10px 25px -5px rgba(96, 178, 70, 0.4)"
                        : "none",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-3 bg-white dark:bg-slate-900`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <p
                    className={`text-[10px] font-bold text-center w-16 leading-tight transition-colors duration-300 ${isCurrent ? "text-slate-800 dark:text-slate-100" : isCompleted ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}
                  >
                    {status.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Details */}
        <motion.div
          layout
          className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex-1 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 h-full"
            >
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: currentStep === 2 ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-[#60b246]"
                >
                  {React.createElement(STATUSES[currentStep].icon, {
                    className: "w-7 h-7",
                  })}
                </motion.div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-0.5">
                  {STATUSES[currentStep].label}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {STATUSES[currentStep].subtext}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Call Driver Button */}
      <AnimatePresence>
        {!showDialer && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCallDriver}
            className="absolute right-6 bg-[#fc8019] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(252,128,25,0.4)] z-30 flex items-center gap-2"
            style={{ bottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            <Phone className="w-5 h-5 fill-current" />
            <span className="font-bold text-sm pr-1">Call Driver</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mock Dialer Dialog */}
      <AnimatePresence>
        {showDialer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-slate-900 w-full rounded-t-3xl shadow-2xl p-6 pb-12 flex flex-col items-center relative"
            >
              <button
                onClick={() => setShowDialer(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Driver`}
                  alt="Driver"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                Alex (Driver)
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                +1 (555) 019-8372
              </p>

              <div className="flex gap-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                  onClick={() => setShowDialer(false)}
                >
                  <Phone className="w-7 h-7 fill-current transform rotate-[135deg]" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
