import React, { useEffect, useState } from 'react';
import { FaHeart, FaGithub, FaLinkedin, FaCode } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance.js';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axiosInstance.get('/settings/visitor-count');
        if (res.data?.data?.count !== undefined) {
          setVisitorCount(res.data.data.count);
        }
      } catch (err) {
        console.error('Failed to load visitor count:', err);
      }
    };
    fetchCount();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-100 dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800/40 py-12 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        
        {/* Left copyright section */}
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            &copy; {new Date().getFullYear()} SUSHANT AWALEKAR. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xxs text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-1">
            Made with <FaHeart className="text-red-500 animate-pulse" /> using React 19 & Tailwind CSS
          </p>
        </div>

        {/* Dynamic Visitor Counter */}
        <div className="flex flex-col items-center">
          <div className="px-4 py-1.5 rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xxs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visitor Counter:
            </span>
            <span className="text-xs font-black text-primary-500 dark:text-primary-400">
              {visitorCount || '104+'}
            </span>
          </div>
        </div>

        {/* Right social media links */}
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 shadow-sm transition-all"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 shadow-sm transition-all"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 shadow-sm transition-all"
            aria-label="LeetCode"
          >
            <FaCode className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
