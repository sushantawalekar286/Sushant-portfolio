import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input } from '../../components/Input.jsx';
import { getSkillIcon } from '../../utils/icons.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/skills');
      if (response.data?.success && response.data.data) {
        setSkills(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load skills list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setImageFile(null);
    reset({
      name: '',
      category: 'Frontend',
      proficiency: 80,
      experience: '1 year',
      logo: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setImageFile(null);
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      experience: skill.experience,
      logo: skill.logo
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await axiosInstance.delete(`/skills/${id}`);
      if (res.data?.success) {
        toast.success('Skill deleted successfully');
        fetchSkills();
      }
    } catch (error) {
      toast.error('Failed to delete skill.');
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('proficiency', data.proficiency);
    formData.append('experience', data.experience);
    formData.append('logo', data.logo);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let res;
      if (editingSkill) {
        res = await axiosInstance.put(`/skills/${editingSkill._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axiosInstance.post('/skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data?.success) {
        toast.success(editingSkill ? 'Skill updated!' : 'Skill created!');
        setIsModalOpen(false);
        fetchSkills();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request.');
    }
  };

  const handleMoveSkill = async (index, direction) => {
    const newSkills = [...skills];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSkills.length) return;
    
    // Swap in local state
    [newSkills[index], newSkills[targetIndex]] = [newSkills[targetIndex], newSkills[index]];
    setSkills(newSkills);
    
    // Build ordered array and send to backend
    const orderedIds = newSkills.map((s, i) => ({ id: s._id, displayOrder: i }));
    try {
      await axiosInstance.put('/skills/reorder', { skills: orderedIds });
      toast.success('Skill order updated!');
    } catch (err) {
      toast.error('Failed to save order. Refreshing...');
      fetchSkills();
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Skills Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove technical skills.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add New Skill
        </CustomButton>
      </div>

      {/* Grid of skills */}
      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : skills.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No skills found. Add your first skill!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-4 w-20 text-center">Order</th>
                  <th className="py-4 px-6">Icon</th>
                  <th className="py-4 px-6">Skill Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Proficiency</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, index) => (
                  <tr 
                    key={skill._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    {/* Order controls */}
                    <td className="py-4 px-4 w-20">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMoveSkill(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-slate-400 hover:text-primary-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                          title="Move Up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center">{index + 1}</span>
                        <button
                          onClick={() => handleMoveSkill(index, 'down')}
                          disabled={index === skills.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-primary-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                          title="Move Down"
                        >
                          <FaArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    {/* Icon */}
                    <td className="py-4 px-6 w-16 text-lg text-primary-500">
                      {getSkillIcon(skill.logo)}
                    </td>
                    {/* Name */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">
                        {skill.name}
                      </p>
                      {skill.experience && (
                        <p className="text-xxs text-slate-400 font-semibold mt-1">
                          Experience: {skill.experience}
                        </p>
                      )}
                    </td>
                    {/* Category */}
                    <td className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {skill.category}
                    </td>
                    {/* Proficiency progress bar */}
                    <td className="py-4 px-6 w-44">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-650 dark:text-slate-300 w-8">
                          {skill.proficiency}%
                        </span>
                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-dark-800 rounded-full overflow-hidden shrink-0">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-purple-650 rounded-full" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          title="Edit Skill"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Skill"
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

      {/* SKILLS ADD/EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-md bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-850 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              
              <Input
                label="Skill Name"
                placeholder="E.g., React.js"
                error={errors.name?.message}
                {...register('name', { required: 'Skill name is required' })}
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-dark-900/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Tools">Tools</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Proficiency (0-100 %)"
                  type="number"
                  placeholder="85"
                  error={errors.proficiency?.message}
                  {...register('proficiency', { 
                    required: 'Required',
                    min: { value: 0, message: 'Min 0' },
                    max: { value: 100, message: 'Max 100' }
                  })}
                />
                
                <Input
                  label="Experience (e.g. 2 years)"
                  placeholder="2 years"
                  {...register('experience')}
                />
              </div>

              <Input
                label="FontAwesome Icon name (E.g. FaReact)"
                placeholder="FaReact"
                {...register('logo')}
              />

              {/* Image upload (alternative to text icon) */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Or Upload Custom Logo file</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 hover:bg-slate-100 dark:hover:bg-dark-850 cursor-pointer text-xs font-bold transition-all">
                    <FaImage className="text-primary-500" />
                    <span>Choose Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <span className="text-xxs text-primary-500 font-bold truncate max-w-xs bg-primary-500/10 px-2.5 py-1 rounded-lg">
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 justify-end">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default SkillsManager;
