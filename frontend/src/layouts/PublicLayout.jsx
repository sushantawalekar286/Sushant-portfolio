import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { useThemeStore } from '../store/useThemeStore.js';

const PublicLayout = () => {
  const { initTheme } = useThemeStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Page Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position to show Back-to-Top
  useEffect(() => {
    initTheme();
    
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initTheme]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-600 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating Glowing Dots for modern aesthetic */}
      <div className="glow-dot-primary w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] top-20 left-0 sm:left-10 pointer-events-none opacity-60" />
      <div className="glow-dot-secondary w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] top-[600px] right-0 sm:right-10 pointer-events-none opacity-60" />
      <div className="glow-dot-primary w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bottom-40 left-0 sm:left-[20%] pointer-events-none opacity-60" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Back to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-primary-500/30 transition-all border border-white/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to Top"
        >
          <FaArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default PublicLayout;
