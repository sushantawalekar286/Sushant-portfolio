import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaAward } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import CustomButton from '../CustomButton.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Certifications = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axiosInstance.get('/certificates');
        if (response.data?.success && response.data.data) {
          setCertificates(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="py-24 bg-slate-50 dark:bg-dark-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Licenses & <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-dark-800 rounded-2xl" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            Certifications details are currently being updated.
          </div>
        ) : (
          /* Grid list wrapper */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <GlassCard
                key={cert._id}
                delay={index * 0.05}
                hoverEffect={true}
                className="flex flex-col justify-between h-full p-5"
              >
                <div>
                  {/* Thumbnail / Issuer icon wrapper */}
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {cert.image && cert.image !== '/images/default-certificate.jpg' ? (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=400&auto=format&fit=crop' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-primary-500/80">
                        <FaCertificate className="w-12 h-12" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          {cert.issuer}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cert Info */}
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-500 font-mono">
                    {cert.issuer}
                  </span>
                  
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mt-1 leading-snug">
                    {cert.name}
                  </h3>
                  
                  <p className="text-xxs text-slate-450 dark:text-slate-400 mt-1 font-semibold flex items-center gap-1">
                    Issued: <span className="text-slate-600 dark:text-slate-300 font-medium">{cert.issueDate}</span>
                  </p>
                </div>

                {/* Actions bottom */}
                {cert.credentialLink && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <a
                      href={cert.credentialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <CustomButton
                        variant="secondary"
                        size="sm"
                        className="w-full text-xxs font-bold uppercase tracking-wider py-2"
                        icon={<FaExternalLinkAlt />}
                        iconPosition="right"
                      >
                        Verify Certificate
                      </CustomButton>
                    </a>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Certifications;
