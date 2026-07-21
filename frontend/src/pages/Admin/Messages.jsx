import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCalendarAlt, FaUser, FaInfoCircle } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/messages');
      if (response.data?.success && response.data.data) {
        setMessages(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load message log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (msg) => {
    if (msg.read) return;
    try {
      const response = await axiosInstance.put(`/messages/${msg._id}/read`);
      if (response.data?.success) {
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
        if (activeMessage && activeMessage._id === msg._id) {
          setActiveMessage(prev => ({ ...prev, read: true }));
        }
      }
    } catch (error) {
      toast.error('Failed to update message status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await axiosInstance.delete(`/messages/${id}`);
      if (res.data?.success) {
        toast.success('Message deleted successfully');
        setMessages(prev => prev.filter(m => m._id !== id));
        if (activeMessage && activeMessage._id === id) {
          setActiveMessage(null);
        }
      }
    } catch (error) {
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
          Client Messages
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Review inquiries, requests, and feedback submitted via the portfolio contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left side list of messages */}
        <div className="lg:col-span-6 glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden max-h-[70vh] flex flex-col">
          <div className="p-4 bg-slate-50/50 dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inbox ({messages.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
            {loading ? (
              <div className="p-4 space-y-4">
                <ListRowSkeleton />
                <ListRowSkeleton />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold text-xs">
                No contact form submissions found.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setActiveMessage(msg);
                    handleMarkRead(msg);
                  }}
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    activeMessage?._id === msg._id
                      ? 'bg-primary-500/10 dark:bg-primary-500/5 border-l-4 border-primary-500'
                      : msg.read 
                        ? 'hover:bg-slate-200/30 dark:hover:bg-dark-800/20'
                        : 'bg-amber-500/5 dark:bg-amber-500/2 border-l-4 border-amber-500 hover:bg-amber-500/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {msg.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono shrink-0 mt-0.5">
                      {new Date(msg.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-650 dark:text-slate-300 mt-1 truncate">
                    {msg.subject}
                  </h4>
                  <p className="text-xxs text-slate-450 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side message reader details */}
        <div className="lg:col-span-6">
          {activeMessage ? (
            <GlassCard hoverEffect={false} className="p-6 space-y-6 text-left relative overflow-hidden">
              {/* Glow circle */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-500/5 rounded-full blur-xl pointer-events-none" />

              {/* Message Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      activeMessage.read
                        ? 'bg-slate-100 dark:bg-dark-800 text-slate-400'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {activeMessage.read ? 'Opened' : 'Unread'}
                    </span>
                    <span className="text-xxs text-slate-400 font-bold font-mono flex items-center gap-1">
                      <FaCalendarAlt /> {new Date(activeMessage.date).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight pt-1">
                    {activeMessage.subject}
                  </h2>
                </div>

                <button
                  onClick={() => handleDelete(activeMessage._id)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all focus:outline-none"
                  title="Delete message"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sender Details */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-dark-950/40 border border-slate-100 dark:border-slate-850 flex items-center gap-3">
                <FaUser className="text-slate-400 w-8 h-8 rounded-full border p-1 bg-white dark:bg-dark-900" />
                <div className="leading-tight text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{activeMessage.name}</p>
                  <a href={`mailto:${activeMessage.email}`} className="text-xxs text-primary-500 hover:underline">{activeMessage.email}</a>
                </div>
              </div>

              {/* Message Body Content */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message content</h4>
                <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-850 bg-white/40 dark:bg-dark-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium min-h-[150px] whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

            </GlassCard>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3 min-h-[300px] justify-center">
              <FaInfoCircle className="text-2xl text-primary-500/40" />
              <p className="text-xs font-semibold">Select a message from the inbox list to read its contents.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
