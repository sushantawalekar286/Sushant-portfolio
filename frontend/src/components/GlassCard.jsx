import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  animate = true,
  delay = 0,
  ...props 
}) => {
  const CardContent = (
    <div 
      className={`glass-card rounded-2xl p-6 shadow-lg overflow-hidden relative ${className}`}
      {...props}
    >
      {/* Gloss reflection light gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );

  if (!animate) {
    return CardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { 
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      className="h-full"
    >
      {CardContent}
    </motion.div>
  );
};

export default GlassCard;
