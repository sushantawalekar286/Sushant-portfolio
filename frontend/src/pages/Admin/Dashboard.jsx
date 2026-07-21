import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaProjectDiagram, FaLaptopCode, FaEnvelope, FaEye, 
  FaUserFriends, FaHistory, FaPlus, FaExternalLinkAlt, FaFolderOpen, FaFilePdf 
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsCardSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/settings/stats');
      if (response.data?.success && response.data.data) {
        setStats(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleMarkRead = async (msgId) => {
    try {
      const response = await axiosInstance.put(`/messages/${msgId}/read`);
      if (response.data?.success) {
        toast.success('Message marked as read');
        fetchStats(); // reload stats
      }
    } catch (error) {
      toast.error('Failed to update message status.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-left">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <AnalyticsCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const { stats: summary, recentMessages = [], analytics = [], latestActivities = [] } = stats || {};

  // Formatted data for chart fallback if database list is empty
  const chartData = analytics.length > 0 
    ? analytics.map(a => ({ name: a.dateString.slice(5), Views: a.views, Visitors: a.ipList.length }))
    : [
        { name: 'Mon', Views: 12, Visitors: 4 },
        { name: 'Tue', Views: 19, Visitors: 7 },
        { name: 'Wed', Views: 32, Visitors: 11 },
        { name: 'Thu', Views: 25, Visitors: 9 },
        { name: 'Fri', Views: 45, Visitors: 18 },
        { name: 'Sat', Views: 55, Visitors: 22 },
        { name: 'Sun', Views: 60, Visitors: 30 }
      ];

  const statCards = [
    { label: 'Total Visitors', value: summary?.visitors || 0, icon: <FaUserFriends />, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { label: "Today's Visitors", value: summary?.todaysVisitors || 0, icon: <FaUserFriends />, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    { label: "Monthly Visitors", value: summary?.monthlyVisitors || 0, icon: <FaUserFriends />, color: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    { label: 'Resume Downloads', value: summary?.downloads || 0, icon: <FaFilePdf />, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    { label: 'Most Viewed Project', value: summary?.mostViewedProject || 'None', icon: <FaProjectDiagram />, color: 'bg-primary-500/10 text-primary-500 border-primary-500/20' },
    { label: 'Unread Messages', value: `${summary?.unreadMessages || 0} / ${summary?.messages || 0}`, icon: <FaEnvelope />, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Realtime metrics, traffic aggregates, and recent alerts.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link to="/" target="_blank">
            <CustomButton variant="secondary" icon={<FaExternalLinkAlt />}>
              View Live Website
            </CustomButton>
          </Link>
          <Link to="/admin/projects">
            <CustomButton variant="primary" icon={<FaPlus />}>
              Add Project
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* Grid metrics summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div 
            key={card.label} 
            className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-slate-800/40 shadow-lg flex items-center justify-between"
          >
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {card.label}
              </p>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white font-mono">
                {card.value}
              </h2>
            </div>
            <div className={`p-4 rounded-2xl border text-xl shrink-0 ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visitor Traffic Line Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaEye className="text-primary-500" /> Visitor Traffic (Last 7 days)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Hits: {summary?.totalViews || 0}
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-dark-800" />
                <XAxis dataKey="name" className="text-xxs font-bold fill-slate-400" />
                <YAxis className="text-xxs font-bold fill-slate-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'sans-serif'
                  }} 
                />
                <Line type="monotone" dataKey="Views" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Visitors" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / System Activity Logs */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FaHistory className="text-primary-500" /> Recent Activities
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {latestActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs leading-normal">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5 animate-pulse" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 dark:text-white">{act.action}</p>
                    <p className="text-[10px] text-slate-450 mt-0.5">{act.details}</p>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">
                      {new Date(act.time).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link to="/admin/messages">
              <CustomButton variant="secondary" className="w-full justify-center">
                Review Client Messages ({summary?.unreadMessages || 0})
              </CustomButton>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Client messages table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <FaEnvelope className="text-primary-500" /> Recent Contact Messages
        </h3>

        {recentMessages.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-xs">
            No client messages received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3 px-4">From</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr 
                    key={msg._id} 
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20 font-medium"
                  >
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-700 dark:text-slate-200">{msg.name}</p>
                      <a href={`mailto:${msg.email}`} className="text-xxs text-primary-500 hover:underline">{msg.email}</a>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold">{msg.subject}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {msg.message}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        msg.read
                          ? 'bg-slate-100 dark:bg-dark-800 text-slate-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10'
                      }`}>
                        {msg.read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="px-3 py-1 text-xxs font-bold uppercase tracking-wider bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
