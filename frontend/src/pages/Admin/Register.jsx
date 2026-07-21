import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import CustomButton from '../../components/CustomButton.jsx';
import { Input } from '../../components/Input.jsx';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle.jsx';
import axiosInstance from '../../api/axiosInstance.js';
import { useAuthStore } from '../../store/useAuthStore.js';

const Register = () => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password
      });

      if (response.data?.success) {
        toast.success('Admin registered successfully! You can now log in.');
        navigate('/admin/login');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
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
            <FaUserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gradient">Create Admin</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">Register the superadmin user account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          
          <Input
            label="Username"
            placeholder="Enter username"
            error={errors.username?.message}
            {...register('username', { 
              required: 'Username is required',
              minLength: { value: 4, message: 'Username must be at least 4 characters' }
            })}
            id="username-register"
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Must be a valid email address' }
            })}
            id="email-register"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            id="password-register"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', { 
              required: 'Confirm password is required',
              validate: value => value === password || 'Passwords do not match'
            })}
            id="confirmPassword-register"
          />

          <div className="pt-2">
            <CustomButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider"
            >
              {loading ? 'Creating Account...' : 'Register Admin'}
            </CustomButton>
          </div>

          <div className="text-center mt-4">
            <Link to="/admin/login" className="text-xs text-primary-500 hover:underline">
              Back to Sign In
            </Link>
          </div>

        </form>

        <p className="text-[10px] text-slate-400 text-center mt-6">
          Authorized seeding. This page should be removed after registration.
        </p>

      </motion.div>
    </div>
  );
};

export default Register;
