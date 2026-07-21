import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserLock } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect to change nav background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'About', target: 'about' },
    { label: 'Skills', target: 'skills' },
    { label: 'Projects', target: 'projects' },
    { label: 'Experience', target: 'experience' },
    { label: 'Certificates', target: 'certificates' },
    { label: 'Achievements', target: 'achievements' },
    { label: 'Contact', target: 'contact' }
  ];

  // Helper to scroll to section
  const handleScrollTo = (targetId) => {
    setIsOpen(false);
    
    // Check if we are on the Home page, otherwise navigate home first
    if (location.pathname !== '/') {
      window.location.href = `/#${targetId}`;
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'glass-nav py-3.5 shadow-md shadow-slate-900/5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand logo */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-black text-lg transition-transform group-hover:scale-105">
            S
          </div>
          <span className="font-extrabold text-lg tracking-wider text-slate-800 dark:text-white leading-none">
            Sushant<span className="text-primary-500">.</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScrollTo(link.target)}
              className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus:outline-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side utilities (Theme and Admin entry) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link 
            to="/admin" 
            className="p-2.5 rounded-xl bg-white/40 dark:bg-dark-900/40 border border-slate-200 dark:border-slate-800 hover:text-primary-500 hover:border-primary-500/30 transition-all"
            title="Admin Login"
          >
            <FaUserLock className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-0 top-[65px] bottom-0 bg-white/95 dark:bg-dark-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-start py-8 px-6 gap-6 border-t border-slate-200/50 dark:border-slate-800/40 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col items-center gap-5 w-full">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleScrollTo(link.target)}
                  className="text-base font-bold uppercase tracking-widest text-slate-800 dark:text-slate-100 hover:text-primary-500 py-1"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800/60 max-w-xs my-2" />
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-900 text-sm font-semibold w-full max-w-xs"
            >
              <FaUserLock />
              Admin Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
