import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaTrophy } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/achievements');
      if (response.data?.success && response.data.data) {
        setAchievements(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openAddModal = () => {
    setEditingAchievement(null);
    reset({
      title: '',
      event: '',
      description: '',
      category: 'Award',
      date: '',
      ranking: '',
      link: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ach) => {
    setEditingAchievement(ach);
    reset({
      title: ach.title,
      event: ach.event,
      description: ach.description,
      category: ach.category,
      date: ach.date,
      ranking: ach.ranking,
      link: ach.link
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement record?')) return;
    try {
      const res = await axiosInstance.delete(`/achievements/${id}`);
      if (res.data?.success) {
        toast.success('Achievement record deleted successfully');
        fetchAchievements();
      }
    } catch (error) {
      toast.error('Failed to delete achievement.');
    }
  };

  const onSubmit = async (data) => {
    try {
      let res;
      if (editingAchievement) {
        res = await axiosInstance.put(`/achievements/${editingAchievement._id}`, data);
      } else {
        res = await axiosInstance.post('/achievements', data);
      }

      if (res.data?.success) {
        toast.success(editingAchievement ? 'Achievement updated!' : 'Achievement created!');
        setIsModalOpen(false);
        fetchAchievements();
      }
    } catch (err) {
      toast.error('Failed to save achievement record.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Achievements Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove honors, competitions, hackathons, or rankings.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add Achievement
        </CustomButton>
      </div>

      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
        </div>
      ) : achievements.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No achievements found. Add your first achievement!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Event / Org</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach) => (
                  <tr 
                    key={ach._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{ach.title}</td>
                    <td className="py-4 px-6 font-semibold text-slate-650 dark:text-slate-350">{ach.event || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-500 text-xxs font-bold uppercase tracking-wider">
                        {ach.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ach)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ach._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS ADD/EDIT DIALOG OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-lg bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850">
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <Input label="Achievement Title" placeholder="E.g., Smart India Hackathon Winner" error={errors.title?.message} {...register('title', { required: 'Required' })} />
              
              <div className="grid grid-cols-2 gap-5">
                <Input label="Event / Organization" placeholder="Ministry of Education" {...register('event')} />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-dark-900/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                  >
                    <option value="Award">Award</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Coding Profile">Coding Profile</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input label="Timeline Date" placeholder="November 2023" error={errors.date?.message} {...register('date', { required: 'Required' })} />
                <Input label="Result / Ranking (E.g. AIR 45)" placeholder="Rank 1 / Winner" {...register('ranking')} />
              </div>

              <TextArea label="Accomplishment Description" placeholder="Detailed bullet points outlining challenge size and solution developed..." error={errors.description?.message} {...register('description', { required: 'Required' })} />
              <Input label="Reference Link URL" placeholder="https://hackathon.org/results" {...register('link')} />

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end shrink-0">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingAchievement ? 'Update Record' : 'Create Record'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AchievementsManager;
