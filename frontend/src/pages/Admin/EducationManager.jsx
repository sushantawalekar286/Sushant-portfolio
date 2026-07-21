import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGraduationCap } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const EducationManager = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/educations');
      if (response.data?.success && response.data.data) {
        setEducations(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load education history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const openAddModal = () => {
    setEditingEducation(null);
    reset({
      institute: '',
      degree: '',
      duration: '',
      cgpa: '',
      relevantCoursework: '',
      achievements: '',
      location: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEducation(edu);
    reset({
      institute: edu.institute,
      degree: edu.degree,
      duration: edu.duration,
      cgpa: edu.cgpa,
      relevantCoursework: edu.relevantCoursework.join(', '),
      achievements: edu.achievements ? edu.achievements.join(', ') : '',
      location: edu.location
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      const res = await axiosInstance.delete(`/educations/${id}`);
      if (res.data?.success) {
        toast.success('Education record deleted successfully');
        fetchEducations();
      }
    } catch (error) {
      toast.error('Failed to delete education.');
    }
  };

  const onSubmit = async (data) => {
    try {
      let res;
      if (editingEducation) {
        res = await axiosInstance.put(`/educations/${editingEducation._id}`, data);
      } else {
        res = await axiosInstance.post('/educations', data);
      }

      if (res.data?.success) {
        toast.success(editingEducation ? 'Education updated!' : 'Education created!');
        setIsModalOpen(false);
        fetchEducations();
      }
    } catch (err) {
      toast.error('Failed to save education record.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Education Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove educational history timeline records.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add Education
        </CustomButton>
      </div>

      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : educations.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No education history records found. Add one now!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Institute</th>
                  <th className="py-4 px-6">Degree</th>
                  <th className="py-4 px-6">GPA / Grade</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu) => (
                  <tr 
                    key={edu._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{edu.institute}</td>
                    <td className="py-4 px-6 font-semibold text-slate-650 dark:text-slate-350">{edu.degree}</td>
                    <td className="py-4 px-6 text-xs text-emerald-500 font-bold font-mono">{edu.cgpa || 'N/A'}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(edu)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(edu._id)}
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

      {/* EDUCATION ADD/EDIT DIALOG OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-lg bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingEducation ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850">
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-5">
                <Input label="Institute Name" placeholder="Stanford University" error={errors.institute?.message} {...register('institute', { required: 'Required' })} />
                <Input label="Degree / Major" placeholder="B.S. in Computer Science" error={errors.degree?.message} {...register('degree', { required: 'Required' })} />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <Input label="Timeline Duration" placeholder="2020 - 2024" error={errors.duration?.message} {...register('duration', { required: 'Required' })} />
                <Input label="CGPA / Grade" placeholder="9.0 / 10" {...register('cgpa')} />
                <Input label="Location (City)" placeholder="Pune / Pune" {...register('location')} />
              </div>

              <TextArea label="Relevant Coursework (comma-separated)" placeholder="Algorithms, Database Systems, Computer Networks" {...register('relevantCoursework')} />
              <TextArea label="Key Highlights & Achievements (comma-separated)" placeholder="Dean's List 2022, Coding Club Lead" {...register('achievements')} />

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end shrink-0">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingEducation ? 'Update Record' : 'Create Record'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default EducationManager;
