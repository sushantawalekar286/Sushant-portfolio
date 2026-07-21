import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaExternalLinkAlt, FaAward } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axiosInstance.get('/experiences');
        if (response.data?.success && response.data.data) {
          setExperiences(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load experiences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 bg-slate-50 dark:bg-dark-950 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-200 dark:before:bg-dark-800">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col md:flex-row items-stretch gap-6 relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-dark-800 animate-pulse absolute left-0 md:left-1/2 -translate-x-1/2" />
                <div className="w-full md:w-1/2 pl-10 md:pl-0 md:pr-10 text-left md:text-right" />
                <div className="w-full md:w-1/2 pl-10" />
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            Experience details are currently being updated.
          </div>
        ) : (
          /* Timeline loop wrapper */
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-0 md:border-l-0 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:w-px md:before:bg-slate-200 md:before:dark:bg-slate-800/80 space-y-12">
            
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={exp._id}
                  className={`relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Timeline node dot */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-6 w-7 h-7 rounded-full bg-white dark:bg-dark-900 border-4 border-primary-500 shadow-md flex items-center justify-center z-10 shrink-0">
                    <FaBriefcase className="w-2.5 h-2.5 text-primary-500" />
                  </div>

                  {/* Date marker for desktop (shows on opposite side of card) */}
                  <div className={`hidden md:block w-1/2 self-center px-8 text-xs font-black uppercase tracking-widest text-slate-400 ${
                    isEven ? 'text-right' : 'text-left'
                  }`}>
                    {exp.duration}
                  </div>

                  {/* Card Content container */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <GlassCard 
                      delay={index * 0.1}
                      hoverEffect={true}
                      className="p-6 text-left"
                    >
                      <span className="md:hidden text-xxs font-black uppercase tracking-widest text-primary-500 block mb-2 font-mono">
                        {exp.duration}
                      </span>
                      
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                        {exp.position}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        <span className="text-primary-500 font-bold">{exp.company}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt /> {exp.location}</span>
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {exp.description}
                        </p>
                      )}

                      {/* Technologies stack tags */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-5">
                          {exp.technologies.map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-0.5 rounded bg-primary-500/10 text-[9px] font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400 border border-primary-500/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* External links */}
                      {exp.link && (
                        <a 
                          href={exp.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400 hover:text-primary-400 mt-4"
                        >
                          Verify Employment <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </GlassCard>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default Experience;
