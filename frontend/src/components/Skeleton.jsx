import React from 'react';

// Basic skeleton shape
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const shapeClass = variant === 'circle' 
    ? 'rounded-full' 
    : variant === 'rect' 
      ? 'rounded-lg' 
      : 'rounded-md';

  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-dark-800 ${shapeClass} ${className}`} />
  );
};

// Project card placeholder skeleton
export const ProjectCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 dark:border-slate-800/20 shadow-lg min-h-[380px] flex flex-col justify-between">
      <div>
        <Skeleton variant="rect" className="w-full h-48 mb-4" />
        <Skeleton variant="text" className="w-1/3 h-5 mb-2" />
        <Skeleton variant="text" className="w-3/4 h-7 mb-3" />
        <Skeleton variant="text" className="w-full h-4 mb-2" />
        <Skeleton variant="text" className="w-5/6 h-4 mb-4" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rect" className="w-16 h-6" />
        <Skeleton variant="rect" className="w-16 h-6" />
        <Skeleton variant="rect" className="w-16 h-6" />
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Skeleton variant="text" className="w-24 h-5" />
        <Skeleton variant="circle" className="w-8 h-8" />
      </div>
    </div>
  );
};

// Skill bar placeholder skeleton
export const SkillSkeleton = () => {
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between">
        <Skeleton variant="text" className="w-24 h-5" />
        <Skeleton variant="text" className="w-12 h-5" />
      </div>
      <Skeleton variant="rect" className="w-full h-3" />
    </div>
  );
};

// Dashboard analytics card placeholder
export const AnalyticsCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 dark:border-slate-800/20 shadow-lg flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-20 h-4" />
        <Skeleton variant="text" className="w-12 h-8" />
        <Skeleton variant="text" className="w-28 h-3" />
      </div>
      <Skeleton variant="circle" className="w-12 h-12" />
    </div>
  );
};

// Generic list row placeholder for admin tables
export const ListRowSkeleton = ({ cols = 4 }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-2/5 h-5" />
          <Skeleton variant="text" className="w-1/4 h-3.5" />
        </div>
      </div>
      <div className="hidden sm:flex flex-1 gap-2">
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
      <div className="flex gap-2 justify-end shrink-0">
        <Skeleton variant="rect" className="w-16 h-8" />
        <Skeleton variant="rect" className="w-16 h-8" />
      </div>
    </div>
  );
};
