import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUsers } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const LeadershipManager = () => {
  const [leadershipList, setLeadershipList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchLeadershipList = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/leadership');
      if (response.data?.success && response.data.data) {
        setLeadershipList(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load leadership timeline records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadershipList();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    reset({
      organization: '',
      role: '',
      duration: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    reset({
      organization: item.organization,
      role: item.role,
      duration: item.duration,
      description: item.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leadership record?')) return;
    try {
      const res = await axiosInstance.delete(`/leadership/${id}`);
      if (res.data?.success) {
        toast.success('Leadership record deleted successfully');
        fetchLeadershipList();
      }
    } catch (error) {
      toast.error('Failed to delete leadership record.');
    }
  };

  const onSubmit = async (data) => {
    try {
      let res;
      if (editingItem) {
        res = await axiosInstance.put(`/leadership/${editingItem._id}`, data);
      } else {
        res = await axiosInstance.post('/leadership', data);
      }

      if (res.data?.success) {
        toast.success(editingItem ? 'Leadership record updated!' : 'Leadership record created!');
        setIsModalOpen(false);
        fetchLeadershipList();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Leadership Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove student organization leadership roles.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add Leadership
        </CustomButton>
      </div>

      {/* Grid of records */}
      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : leadershipList.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No leadership records found. Add one now!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Organization</th>
                  <th className="py-4 px-6">Role / Position</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadershipList.map((item) => (
                  <tr 
                    key={item._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{item.organization}</td>
                    <td className="py-4 px-6 font-semibold text-slate-650 dark:text-slate-350">{item.role}</td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">{item.duration}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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

      {/* LEADERSHIP ADD/EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-lg bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingItem ? 'Edit Leadership Role' : 'Add Leadership Role'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850">
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
              
              <Input 
                label="Organization" 
                placeholder="E.g., IEEE Student Chapter" 
                error={errors.organization?.message} 
                {...register('organization', { required: 'Organization is required' })} 
              />
              
              <Input 
                label="Role / Position" 
                placeholder="E.g., President / Coordinator" 
                error={errors.role?.message} 
                {...register('role', { required: 'Role is required' })} 
              />

              <Input 
                label="Duration Timeline" 
                placeholder="E.g., 2023 - 2024" 
                error={errors.duration?.message} 
                {...register('duration', { required: 'Duration is required' })} 
              />

              <TextArea 
                label="Description" 
                placeholder="Detail key responsibilities, hosted workshops, and student outreach numbers..." 
                error={errors.description?.message} 
                {...register('description', { required: 'Description is required' })} 
              />

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingItem ? 'Update Role' : 'Create Role'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default LeadershipManager;
