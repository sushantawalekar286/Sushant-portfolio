import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaBook, FaAward } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const response = await axiosInstance.get('/educations');
        if (response.data?.success && response.data.data) {
          setEducations(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load education history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  return (
    <section id="education" className="py-24 bg-white dark:bg-dark-900 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Academic <span className="text-gradient">Education</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-200 dark:before:bg-dark-800 animate-pulse">
            {[1].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-dark-800 absolute left-0 md:left-1/2 -translate-x-1/2" />
                <div className="w-full md:w-1/2" />
              </div>
            ))}
          </div>
        ) : educations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            Education details are currently being updated.
          </div>
        ) : (
          /* Timeline loop */
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-0 md:border-l-0 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:w-px md:before:bg-slate-200 md:before:dark:bg-slate-800/80 space-y-12">
            
            {educations.map((edu, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={edu._id}
                  className={`relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Timeline icon node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-6 w-7 h-7 rounded-full bg-white dark:bg-dark-900 border-4 border-primary-500 shadow-md flex items-center justify-center z-10 shrink-0">
                    <FaGraduationCap className="w-2.5 h-2.5 text-primary-500" />
                  </div>

                  {/* Date for desktop */}
                  <div className={`hidden md:block w-1/2 self-center px-8 text-xs font-black uppercase tracking-widest text-slate-400 ${
                    isEven ? 'text-right' : 'text-left'
                  }`}>
                    {edu.duration}
                  </div>

                  {/* Card Content container */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <GlassCard 
                      delay={index * 0.1}
                      hoverEffect={true}
                      className="p-6 text-left"
                    >
                      <span className="md:hidden text-xxs font-black uppercase tracking-widest text-primary-500 block mb-2 font-mono">
                        {edu.duration}
                      </span>
                      
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                        {edu.degree}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        <span className="text-primary-500 font-bold">{edu.institute}</span>
                        {edu.location && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-0.5"><FaMapMarkerAlt /> {edu.location}</span>
                          </>
                        )}
                      </div>

                      {/* Grade GPA info */}
                      {edu.cgpa && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/10">
                          Grade: {edu.cgpa}
                        </div>
                      )}

                      {/* Relevant coursework */}
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                            <FaBook /> Relevant Coursework
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.relevantCoursework.map((course) => (
                              <span 
                                key={course}
                                className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-dark-800/80 text-[10px] font-semibold text-slate-600 dark:text-slate-350"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                            <FaAward /> Highlights
                          </p>
                          <ul className="space-y-1">
                            {edu.achievements.map((ach, i) => (
                              <li key={i} className="text-xxs font-medium text-slate-650 dark:text-slate-405 leading-relaxed flex gap-1.5 items-start">
                                <span className="text-primary-500 mt-0.5">&bull;</span>
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
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

export default Education;
