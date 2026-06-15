import React, { useEffect, useState } from "react";
import { WifiOff, Signal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const StatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isWeak, setIsWeak] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const checkConnection = () => {
      // @ts-expect-error - Network Information API is not fully typed
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        if (
          connection.effectiveType === "2g" ||
          connection.effectiveType === "slow-2g" ||
          connection.saveData
        ) {
          setIsWeak(true);
        } else {
          setIsWeak(false);
        }
      }
    };

    checkConnection();

    // @ts-expect-error - Network Information API is not fully typed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener("change", checkConnection);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", checkConnection);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || isWeak) && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-full z-[90]"
        >
          <div
            className={`w-full flex items-center justify-center py-2 px-4 shadow-md text-xs font-bold text-white sm:pt-8 ${
              !isOnline
                ? "bg-red-500/95 backdrop-blur-md"
                : "bg-orange-500/95 backdrop-blur-md"
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span>No Internet Connection</span>
              </>
            ) : (
              <>
                <Signal className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span>Slow Connection Detected</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
