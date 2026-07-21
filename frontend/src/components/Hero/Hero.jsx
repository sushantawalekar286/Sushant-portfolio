import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaCode, FaChevronDown, FaDownload, FaTelegramPlane } from 'react-icons/fa';
import CustomButton from '../CustomButton.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    name: 'Sushant Awalekar',
    titles: ['Software Engineer', 'Full Stack Developer', 'DSA Specialist'],
    mainText: 'I build high-performance web applications and solve complex computational challenges with clean, scalable code.',
    subtitle: 'Hello, my name is',
    githubLink: 'https://github.com',
    linkedinLink: 'https://linkedin.com',
    leetcodeLink: 'https://leetcode.com',
    resumeUrl: '',
    resumeId: null
  });

  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Hero configs from backend
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axiosInstance.get('/settings/hero');
        if (response.data?.success && response.data.data) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load hero configurations:', error);
      }
    };
    fetchHeroData();
  }, []);

  // Fetch Active Resume if empty
  useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const res = await axiosInstance.get('/resumes/active');
        if (res.data?.success && res.data.data) {
          setHeroData(prev => ({ ...prev, resumeUrl: res.data.data.url, resumeId: res.data.data._id }));
        }
      } catch (err) {}
    };
    fetchActiveResume();
  }, []);

  const handleResumeDownload = async () => {
    if (heroData.resumeId) {
      try {
        await axiosInstance.post(`/resumes/${heroData.resumeId}/download`);
      } catch (err) {
        console.error('Failed to log resume download:', err);
      }
    }
  };

  const titles = heroData.titles || ['Full Stack Developer'];

  // Typing Effect Loop
  useEffect(() => {
    if (!titles.length) return;
    const currentTitle = titles[titleIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      }, 100);
    }

    if (!isDeleting && displayText === currentTitle) {
      timer = setTimeout(() => setIsDeleting(true), 2000); // pause at end
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, titles]);

  const handleScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
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
    <section 
      id="hero" 
      className="min-h-screen relative flex items-center justify-center pt-24 pb-16 overflow-hidden bg-grid-pattern"
    >
      {/* Decorative blurred rings */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary-600/10 dark:bg-primary-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Animated Subtitle badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400"
        >
          {heroData.subtitle}
        </motion.div>

        {/* Animated Big Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-800 dark:text-white px-2"
        >
          <span className="text-gradient leading-tight">{heroData.name}</span>
        </motion.h1>

        {/* Dynamic Typing Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-12 sm:h-14 mt-4 flex items-center justify-center px-2 text-center"
        >
          <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-slate-600 dark:text-slate-300">
            I am a <span className="text-primary-500 font-mono">{displayText}</span>
            <span className="animate-pulse text-primary-500 font-normal">|</span>
          </h2>
        </motion.div>

        {/* Main description text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xs sm:text-base md:text-lg max-w-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-4"
        >
          {heroData.mainText}
        </motion.p>

        {/* Core CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none"
        >
          <CustomButton 
            variant="primary" 
            size="lg"
            icon={<FaTelegramPlane />}
            onClick={() => handleScrollTo('contact')}
            className="w-full sm:w-auto"
          >
            Hire Me
          </CustomButton>
          
          {heroData.resumeUrl && (
            <a 
              href={heroData.resumeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              download
              onClick={handleResumeDownload}
              className="w-full sm:w-auto"
            >
              <CustomButton 
                variant="secondary" 
                size="lg"
                icon={<FaDownload />}
                className="w-full sm:w-auto"
              >
                Download Resume
              </CustomButton>
            </a>
          )}
        </motion.div>

        {/* Floating Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex gap-4"
        >
          {heroData.githubLink && (
            <a
              href={heroData.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/50 dark:bg-dark-900/50 hover:bg-primary-500/10 hover:text-primary-500 border border-slate-200 dark:border-slate-800 transition-all shadow-md"
              title="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          )}
          {heroData.linkedinLink && (
            <a
              href={heroData.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/50 dark:bg-dark-900/50 hover:bg-primary-500/10 hover:text-primary-500 border border-slate-200 dark:border-slate-800 transition-all shadow-md"
              title="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          )}
          {heroData.leetcodeLink && (
            <a
              href={heroData.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/50 dark:bg-dark-900/50 hover:bg-primary-500/10 hover:text-primary-500 border border-slate-200 dark:border-slate-800 transition-all shadow-md"
              title="LeetCode"
            >
              <FaCode className="w-5 h-5" />
            </a>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          onClick={() => handleScrollTo('about')}
          className="absolute bottom-8 cursor-pointer flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scroll Down</span>
          <FaChevronDown className="w-4 h-4 text-primary-500 animate-bounce mt-1" />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
