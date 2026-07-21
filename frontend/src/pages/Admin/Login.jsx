import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserLock, FaUser, FaLock } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore.js';
import CustomButton from '../../components/CustomButton.jsx';
import { Input } from '../../components/Input.jsx';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle.jsx';

const Login = () => {
  const { login, isAuthenticated, isLoading, error } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    const result = await login(data.username, data.password);
    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-grid-pattern px-6 relative">
      
      {/* Top right theme switch */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Floating glowing dot */}
      <div className="absolute w-80 h-80 bg-primary-500/10 rounded-full blur-3xl top-1/4 left-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20 mb-4">
            <FaUserLock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gradient">Admin Center</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          
          <Input
            label="Username"
            placeholder="Enter username"
            error={errors.username?.message}
            {...register('username', { required: 'Username is required' })}
            id="username-login"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
            id="password-login"
          />

          <div className="pt-2">
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </CustomButton>
          </div>

          <div className="text-center mt-4">
            <Link to="/admin/register" className="text-xs text-primary-500 hover:underline">
              Temporary Register Account Link
            </Link>
          </div>

        </form>

        <p className="text-[10px] text-slate-400 text-center mt-6">
          Authorized personnel only. Sessions are monitored.
        </p>

      </motion.div>
    </div>
  );
};

export default Login;
