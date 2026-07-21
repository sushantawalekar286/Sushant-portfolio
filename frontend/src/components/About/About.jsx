import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaLanguage, FaLaptopCode } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const About = () => {
  const [aboutData, setAboutData] = useState({
    introduction: 'I am a Software Development Engineer with a strong foundation in MERN stack development and Data Structures & Algorithms. I enjoy writing clean, maintainable, and scalable code.',
    careerObjective: 'To work in an innovative environment where I can leverage my programming and system design skills to solve complex problems.',
    profileImage: '/images/default-avatar.jpg',
    personalInfo: {
      email: 'sushant@example.com',
      phone: '',
      location: 'Maharashtra, India',
      languages: ['English', 'Hindi', 'Marathi']
    },
    stats: {
      projectsCompleted: 0,
      dsaProblemsSolved: 0,
      internshipsCount: 0,
      hackathonsWon: 0,
      awardsCount: 0
    }
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axiosInstance.get('/settings/about');
        if (response.data?.success && response.data.data) {
          setAboutData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load about configurations:', error);
      }
    };
    fetchAboutData();
  }, []);

  const infoItems = [
    { icon: <FaEnvelope className="text-primary-500" />, label: 'Email', value: aboutData.personalInfo?.email || 'sushant@example.com' },
    { icon: <FaMapMarkerAlt className="text-primary-500" />, label: 'Location', value: aboutData.personalInfo?.location || 'Maharashtra, India' },
    { icon: <FaLanguage className="text-primary-500" />, label: 'Languages', value: Array.isArray(aboutData.personalInfo?.languages) ? aboutData.personalInfo.languages.join(', ') : 'English, Hindi' }
  ];

  const statsItems = [
    { value: aboutData.stats?.projectsCompleted || 0, label: 'Projects Completed' },
    { value: aboutData.stats?.dsaProblemsSolved || 0, label: 'DSA Solved' },
    { value: aboutData.stats?.internshipsCount || 0, label: 'Internships' },
    { value: aboutData.stats?.hackathonsWon || 0, label: 'Hackathons' },
    { value: aboutData.stats?.awardsCount || 0, label: 'Awards' }
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-dark-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Image Wrapper */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              className="relative w-64 h-64 sm:w-72 sm:h-72"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Outer rotating decorative border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-500 to-purple-600 animate-spin-slow opacity-70 blur-xs" />
              
              {/* Actual Image Panel */}
              <div className="absolute inset-1.5 rounded-3xl overflow-hidden bg-slate-100 dark:bg-dark-800 border-4 border-white dark:border-dark-900 z-10">
                <img
                  src={aboutData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bio text & personal details */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <FaUser className="text-primary-500 w-5 h-5" /> Who am I?
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {aboutData.introduction}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <FaLaptopCode className="text-primary-500 w-5 h-5" /> Career Objective
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {aboutData.careerObjective}
              </p>
            </motion.div>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {infoItems.map((item, index) => (
                <GlassCard
                  key={item.label}
                  hoverEffect={false}
                  delay={index * 0.1}
                  className="p-4 flex items-center gap-4 !bg-slate-50/50 dark:!bg-dark-800/20"
                >
                  <div className="p-3 rounded-xl bg-white dark:bg-dark-900 shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 break-all">
                      {item.value}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Numeric stats section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-20">
          {statsItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/20 dark:border-slate-800/40 relative group overflow-hidden"
            >
              {/* Soft underlying hover radial glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <h4 className="text-3xl sm:text-4xl font-black text-gradient">
                {item.value}+
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
