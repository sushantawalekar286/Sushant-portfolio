import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import CustomButton from '../components/CustomButton.jsx';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-grid-pattern px-6">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-white/20 dark:border-slate-800/60 shadow-2xl relative overflow-hidden">
        
        {/* Glow dots decoration */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-primary-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 space-y-6"
        >
          <div className="flex justify-center text-red-500 text-5xl">
            <FaExclamationTriangle className="animate-bounce" />
          </div>
          
          <h1 className="text-6xl font-black tracking-tight text-gradient">
            404
          </h1>
          
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">
            Page Not Found
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="pt-4 flex justify-center">
            <Link to="/">
              <CustomButton variant="primary" icon={<FaHome />}>
                Back to Home
              </CustomButton>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;
