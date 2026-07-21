import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useThemeStore } from '../../store/useThemeStore.js';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-primary-500/50 transition-all focus:outline-none shadow-md border border-white/20 dark:border-slate-700/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        key={theme}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <FaSun className="w-5 h-5 text-amber-400 hover:text-amber-300" />
        ) : (
          <FaMoon className="w-5 h-5 text-slate-600 hover:text-slate-800" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
