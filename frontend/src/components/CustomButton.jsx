import React from 'react';
import { motion } from 'framer-motion';

const CustomButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 border border-transparent',
    secondary: 'bg-white/10 dark:bg-dark-800/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-dark-800',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent',
    glass: 'bg-white/20 dark:bg-dark-900/30 text-primary-600 dark:text-primary-400 backdrop-blur-md border border-white/20 dark:border-slate-800/50 hover:bg-white/30 dark:hover:bg-dark-900/50'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2 text-base shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2 text-base shrink-0">{icon}</span>}
    </>
  );

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default CustomButton;
