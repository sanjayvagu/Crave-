import React, { useState, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = "",
}) => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const controls = useAnimation();

  // Threshold to trigger refresh
  const pullThreshold = 80;
  const maxPull = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;

    if (scrollRef.current && scrollRef.current.scrollTop > 0) {
      // If user scrolled down organically mid-pull, cancel pull
      setPulling(false);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      // e.preventDefault(); // can't easily do this in React touch events due to passive listeners
      if (distance < maxPull) {
        setPullDistance(distance);
        controls.set({ y: Math.pow(distance, 0.8) });
      }
    } else {
      setPulling(false);
      controls.set({ y: 0 });
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling) return;
    setPulling(false);

    if (pullDistance > pullThreshold) {
      setRefreshing(true);
      controls.start({
        y: 50,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });

      await onRefresh();

      setRefreshing(false);
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    } else {
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
    setPullDistance(0);
  };

  return (
    <div
      className={`relative flex flex-col h-full w-full overflow-hidden ${className}`}
    >
      {/* Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center items-center z-40 pointer-events-none"
        style={{ height: pullThreshold, top: -pullThreshold }}
        animate={controls}
      >
        <div
          className={`p-2 rounded-full bg-white  shadow-md transform transition-transform ${refreshing ? "animate-spin" : ""}`}
        >
          <RefreshCw
            className="w-5 h-5 text-[#fc8019]"
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
          />
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <motion.div
        ref={scrollRef}
        animate={controls}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto no-scrollbar h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
