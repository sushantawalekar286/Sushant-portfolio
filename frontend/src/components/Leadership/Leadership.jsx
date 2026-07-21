import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Leadership = () => {
  const [leadershipList, setLeadershipList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const response = await axiosInstance.get('/leadership');
        if (response.data?.success && response.data.data) {
          setLeadershipList(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load leadership data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadership();
  }, []);

  // Don't render section if no data after loading
  if (!loading && leadershipList.length === 0) return null;

  return (
    <section id="leadership" className="py-24 bg-white dark:bg-dark-900 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Student <span className="text-gradient">Leadership</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto">
            Roles and responsibilities across student organizations and technical communities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse space-y-3">
                <div className="h-4 w-40 bg-slate-200 dark:bg-dark-800 rounded" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-dark-800 rounded" />
                <div className="h-3 w-full bg-slate-200 dark:bg-dark-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadershipList.map((item, index) => (
              <GlassCard
                key={item._id}
                delay={index * 0.08}
                hoverEffect={true}
                className="p-6 text-left relative overflow-hidden"
              >
                {/* Accent top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-600" />
                
                {/* Icon badge */}
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <FaUsers className="text-primary-500 text-lg" />
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                  {item.role}
                </h3>
                <p className="text-xs font-semibold text-primary-500 mt-1">
                  {item.organization}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3">
                  <FaCalendarAlt className="w-2.5 h-2.5" />
                  {item.duration}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-4 font-medium">
                    {item.description}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Leadership;
