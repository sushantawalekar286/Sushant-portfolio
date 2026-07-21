import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaExternalLinkAlt, FaAward } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axiosInstance.get('/achievements');
        if (response.data?.success && response.data.data) {
          setAchievements(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Award':
        return <FaTrophy className="text-amber-500" />;
      case 'Hackathon':
        return <FaMedal className="text-purple-500" />;
      case 'Coding Profile':
        return <FaAward className="text-emerald-500" />;
      default:
        return <FaAward className="text-primary-500" />;
    }
  };

  return (
    <section id="achievements" className="py-24 bg-white dark:bg-dark-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Honors & <span className="text-gradient">Achievements</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1].map((i) => (
              <div key={i} className="h-44 bg-slate-200 dark:bg-dark-800 rounded-2xl" />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            Achievements details are currently being updated.
          </div>
        ) : (
          /* Grid container */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((ach, index) => (
              <GlassCard
                key={ach._id}
                delay={index * 0.05}
                hoverEffect={true}
                className="p-6 h-full flex flex-col justify-between"
              >
                <div>
                  
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-dark-800/80 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {ach.category}
                    </span>
                    <span className="text-xl shrink-0">
                      {getCategoryIcon(ach.category)}
                    </span>
                  </div>

                  {/* Info details */}
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">
                    {ach.date} {ach.event ? `| ${ach.event}` : ''}
                  </span>
                  
                  <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
                    {ach.title}
                  </h3>

                  {ach.ranking && (
                    <div className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                      Result: {ach.ranking}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">
                    {ach.description}
                  </p>
                </div>

                {ach.link && (
                  <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800">
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      View Details <FaExternalLinkAlt className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Achievements;
