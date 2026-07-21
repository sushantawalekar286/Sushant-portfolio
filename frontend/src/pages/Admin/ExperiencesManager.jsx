import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBriefcase } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const ExperiencesManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/experiences');
      if (response.data?.success && response.data.data) {
        setExperiences(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load experiences list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExperience(null);
    reset({
      company: '',
      position: '',
      location: 'Remote',
      duration: '',
      description: '',
      technologies: '',
      link: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExperience(exp);
    reset({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      duration: exp.duration,
      description: exp.description,
      technologies: exp.technologies.join(', '),
      link: exp.link
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience record?')) return;
    try {
      const res = await axiosInstance.delete(`/experiences/${id}`);
      if (res.data?.success) {
        toast.success('Experience record deleted successfully');
        fetchExperiences();
      }
    } catch (error) {
      toast.error('Failed to delete experience.');
    }
  };

  const onSubmit = async (data) => {
    try {
      let res;
      if (editingExperience) {
        res = await axiosInstance.put(`/experiences/${editingExperience._id}`, data);
      } else {
        res = await axiosInstance.post('/experiences', data);
      }

      if (res.data?.success) {
        toast.success(editingExperience ? 'Experience updated!' : 'Experience created!');
        setIsModalOpen(false);
        fetchExperiences();
      }
    } catch (err) {
      toast.error('Failed to save experience record.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Experiences Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove professional work history timeline records.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add Experience
        </CustomButton>
      </div>

      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : experiences.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No experience timeline records found. Add one now!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-855 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Position / Title</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr 
                    key={exp._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{exp.company}</td>
                    <td className="py-4 px-6 font-semibold text-slate-650 dark:text-slate-350">{exp.position}</td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">{exp.duration}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
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

      {/* EXPERIENCES ADD/EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-lg bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingExperience ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850">
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-5">
                <Input label="Company Name" placeholder="Google" error={errors.company?.message} {...register('company', { required: 'Required' })} />
                <Input label="Position / Title" placeholder="Software Engineer" error={errors.position?.message} {...register('position', { required: 'Required' })} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input label="Duration Timeline" placeholder="Jan 2024 - Present" error={errors.duration?.message} {...register('duration', { required: 'Required' })} />
                <Input label="Location (City / Remote)" placeholder="Pune / Remote" {...register('location')} />
              </div>

              <TextArea label="Work Description" placeholder="Detailed achievements, technologies deployed, and system optimizations..." error={errors.description?.message} {...register('description', { required: 'Required' })} />
              <Input label="Technologies Used (comma-separated)" placeholder="React, Node.js, Express, MongoDB" {...register('technologies')} />
              <Input label="Credential Reference Link" placeholder="https://verify.company.com" {...register('link')} />

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end shrink-0">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingExperience ? 'Update Record' : 'Create Record'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ExperiencesManager;
