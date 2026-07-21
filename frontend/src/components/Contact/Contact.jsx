import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaUserCircle, FaInfoCircle, FaSmile } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import CustomButton from '../CustomButton.jsx';
import { Input, TextArea } from '../Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await axiosInstance.post('/messages', data);
      if (response.data?.success) {
        toast.success(response.data.message || 'Message sent! I will get back to you soon.');
        reset();
      } else {
        toast.error('Failed to submit message. Please try again.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error submitting message. Please try again.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-dark-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Fallback Map Widget */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                Let's discuss something <span className="text-primary-500 font-bold">creative!</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                I am open to discuss web application building, freelance developer gigs, software engineer employment opportunities, or competitive programming topics. Feel free to drop a line!
              </p>

              <div className="space-y-4 pt-4">
                {/* Email detail */}
                <div className="flex gap-4 items-center">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-primary-500 shadow-sm">
                    <FaEnvelope />
                  </div>
                  <div className="leading-tight text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <a href="mailto:sushant@example.com" className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 hover:underline">
                      sushant@example.com
                    </a>
                  </div>
                </div>

                {/* Location detail */}
                <div className="flex gap-4 items-center">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-primary-500 shadow-sm">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="leading-tight text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residence Location</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                      Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Fallback Map Widget */}
            <div className="w-full h-56 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative bg-slate-200 dark:bg-dark-900 shrink-0">
              
              {/* Styled Vector Map Grid background mock */}
              <div className="absolute inset-0 bg-grid-pattern bg-[size:25px_25px] opacity-40" />
              
              {/* Radial gradient representing city/location coordinates locator */}
              <div className="absolute inset-0 bg-radial-glow flex flex-col justify-center items-center p-6 text-center z-10 gap-2">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500 flex items-center justify-center animate-pulse">
                  <span className="w-3.5 h-3.5 rounded-full bg-primary-500" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  Maharashtra, India
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold max-w-[200px]">
                  Coordinates resolved dynamically. Open to onsite/remote opportunities.
                </p>
              </div>

            </div>
          </div>

          {/* Contact Input Form Card */}
          <div className="lg:col-span-7">
            <GlassCard hoverEffect={false} className="p-6 md:p-8">
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="Collaborative Project Inquiry"
                  error={errors.subject?.message}
                  {...register('subject', { required: 'Subject is required' })}
                />

                <TextArea
                  label="Your Message"
                  placeholder="Hello Sushant, I would like to discuss..."
                  error={errors.message?.message}
                  {...register('message', { 
                    required: 'Message content is required',
                    minLength: {
                      value: 10,
                      message: 'Message must contain at least 10 characters'
                    }
                  })}
                />

                <div className="pt-2 flex justify-end">
                  <CustomButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    icon={<FaPaperPlane className="w-3.5 h-3.5" />}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                  </CustomButton>
                </div>

              </form>

            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
