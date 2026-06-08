import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#fc8019] flex items-center justify-center z-50 flex-col"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="flex items-center justify-center flex-col"
      >
        <h1 className="text-6xl font-black text-white tracking-widest lowercase" style={{ fontFamily: 'Outfit, sans-serif' }}>
          crave
        </h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="h-1 bg-white dark:bg-slate-900 mt-4 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};
