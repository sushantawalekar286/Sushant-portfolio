import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard.jsx';
import { SkillSkeleton } from '../Skeleton.jsx';
import { getSkillIcon } from '../../utils/icons.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Skills = () => {
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get('/skills?groupBy=category');
        if (response.data?.success && response.data.data) {
          setGroupedSkills(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = [
    'Programming Languages',
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Cloud',
    'Tools',
    'Soft Skills'
  ];

  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-dark-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          /* Skeletons Loader State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GlassCard key={i} hoverEffect={false} animate={false}>
                <div className="w-1/2 h-6 bg-slate-200 dark:bg-dark-800 animate-pulse rounded-md mb-6" />
                <div className="space-y-4">
                  <SkillSkeleton />
                  <SkillSkeleton />
                  <SkillSkeleton />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          /* Skill Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const skills = groupedSkills[category] || [];
              if (skills.length === 0) return null;

              return (
                <GlassCard 
                  key={category} 
                  delay={index * 0.05}
                  hoverEffect={true}
                  className="p-6 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Category Title */}
                    <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">
                      {category}
                    </h3>

                    {/* Skill Bars List */}
                    <div className="space-y-5">
                      {skills.map((skill) => (
                        <div key={skill._id} className="space-y-1.5">
                          
                          {/* Skill Info Row */}
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                              <span className="text-base text-primary-500 shrink-0">
                                {getSkillIcon(skill.logo)}
                              </span>
                              <span>{skill.name}</span>
                              {skill.experience && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  ({skill.experience})
                                </span>
                              )}
                            </div>
                            <span className="text-primary-500 dark:text-primary-400 font-mono">
                              {skill.proficiency}%
                            </span>
                          </div>

                          {/* Skill Progress Bar wrapper */}
                          <div className="w-full h-2.5 bg-slate-200 dark:bg-dark-800/80 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default Skills;
