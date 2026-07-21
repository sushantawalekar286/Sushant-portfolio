import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import { ListRowSkeleton } from '../../components/Skeleton.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/projects?limit=100');
      if (response.data?.success && response.data.data) {
        setProjects(response.data.data.projects);
      }
    } catch (err) {
      toast.error('Failed to load projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setImageFiles([]);
    reset({
      title: '',
      description: '',
      skills: '',
      category: 'Web Development',
      link: '#',
      github: '#',
      status: 'Completed',
      duration: '',
      role: 'Developer',
      achievements: '',
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setImageFiles([]);
    reset({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      category: project.category,
      link: project.link,
      github: project.github,
      status: project.status,
      duration: project.duration,
      role: project.role,
      achievements: project.achievements ? project.achievements.join(', ') : '',
      featured: project.featured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await axiosInstance.delete(`/projects/${id}`);
      if (res.data?.success) {
        toast.success('Project deleted successfully');
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to delete project.');
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('link', data.link);
    formData.append('github', data.github);
    formData.append('status', data.status);
    formData.append('duration', data.duration);
    formData.append('role', data.role);
    formData.append('featured', data.featured);
    
    // Pass raw strings to be parsed as arrays by the backend
    formData.append('skills', data.skills);
    formData.append('achievements', data.achievements);

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
    }

    try {
      let res;
      if (editingProject) {
        res = await axiosInstance.put(`/projects/${editingProject._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axiosInstance.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data?.success) {
        toast.success(editingProject ? 'Project updated!' : 'Project created!');
        setIsModalOpen(false);
        fetchProjects();
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
            Projects Manager
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Display, add, modify, or remove portfolio projects.
          </p>
        </div>
        <CustomButton variant="primary" icon={<FaPlus />} onClick={openAddModal}>
          Add New Project
        </CustomButton>
      </div>

      {/* Grid of project rows */}
      {loading ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-sm">
          No projects found. Add your first project!
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 dark:border-slate-850 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr 
                    key={project._id}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/20 dark:hover:bg-dark-800/20"
                  >
                    {/* Project thumbnail */}
                    <td className="py-4 px-6 w-24">
                      <img 
                        src={project.images && project.images.length > 0 ? project.images[0].url : '/images/default-project.jpg'} 
                        alt={project.title} 
                        className="w-16 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop' }}
                      />
                    </td>
                    {/* Project title */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">
                        {project.title}
                      </p>
                      <p className="text-xxs text-slate-400 font-semibold mt-1">
                        Status: <span className="text-primary-500 font-bold">{project.status}</span>
                      </p>
                    </td>
                    {/* Project category */}
                    <td className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {project.category}
                    </td>
                    {/* Featured status indicator */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        project.featured 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 animate-pulse'
                          : 'bg-slate-150 text-slate-400 dark:bg-dark-800'
                      }`}>
                        {project.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    {/* Actions button group */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          title="Edit Project"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Project"
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

      {/* PROJECTS ADD/EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="glass-panel w-[90%] max-w-2xl bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl relative z-10 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-850 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Project Title"
                  placeholder="E.g., DevChat Realtime App"
                  error={errors.title?.message}
                  {...register('title', { required: 'Project title is required' })}
                />
                
                <Input
                  label="Category"
                  placeholder="E.g., Web Development"
                  error={errors.category?.message}
                  {...register('category', { required: 'Category is required' })}
                />
              </div>

              <TextArea
                label="Description"
                placeholder="Brief summary detailing application features and purposes..."
                error={errors.description?.message}
                {...register('description', { required: 'Description is required' })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Live URL Link"
                  placeholder="https://example.com"
                  {...register('link')}
                />
                <Input
                  label="GitHub Repository Link"
                  placeholder="https://github.com/username/project"
                  {...register('github')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input
                  label="Role (e.g. Lead Dev)"
                  placeholder="Lead Developer"
                  {...register('role')}
                />
                <Input
                  label="Duration (e.g. 2 months)"
                  placeholder="2 Months"
                  {...register('duration')}
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-dark-900/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <Input
                label="Tech Stack (comma-separated strings)"
                placeholder="React, Node.js, Express, Socket.io"
                {...register('skills')}
              />

              <TextArea
                label="Achievements (comma-separated bullet accomplishments)"
                placeholder="Optimized DB queries, Scaled server to 100 concurrent sockets"
                rows={2}
                {...register('achievements')}
              />

              {/* Image upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Images (Multiple)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 hover:bg-slate-100 dark:hover:bg-dark-850 cursor-pointer text-xs font-bold transition-all shadow-sm">
                    <FaImage className="text-primary-500" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFiles(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>
                  {imageFiles && imageFiles.length > 0 && (
                    <span className="text-xxs text-primary-500 font-bold truncate max-w-xs bg-primary-500/10 px-3 py-1 rounded-lg">
                      {imageFiles.length} files selected
                    </span>
                  )}
                  {editingProject && imageFiles.length === 0 && (
                    <span className="text-[10px] text-slate-400 font-semibold italic">
                      Leave blank to preserve current images.
                    </span>
                  )}
                </div>
              </div>

              {/* Featured toggle checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  {...register('featured')}
                  className="w-4 h-4 text-primary-600 border-slate-350 dark:border-slate-800 rounded focus:ring-primary-500"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Feature this project on landing page
                </label>
              </div>

              {/* Action buttons footer inside modal */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex gap-4 justify-end">
                <CustomButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </CustomButton>
                <CustomButton type="submit" variant="primary">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </CustomButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsManager;
