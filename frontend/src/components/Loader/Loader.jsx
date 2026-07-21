import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false, text = 'Loading...' }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: 'linear'
      }
    }
  };

  const containerClass = fullPage 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-8 w-full min-h-[200px]';

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-primary-500/10 dark:border-primary-500/5 animate-pulse" />
        
        {/* Spinning gradient ring */}
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-t-primary-500 border-r-purple-500 border-b-transparent border-l-transparent"
          variants={spinnerVariants}
          animate="animate"
        />
      </div>
      
      {text && (
        <motion.p
          className="mt-4 text-sm font-medium tracking-wider text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
