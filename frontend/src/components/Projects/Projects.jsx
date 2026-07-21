import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaGithub, FaExternalLinkAlt, FaTimes, FaCode, FaCalendarAlt, FaUser, FaAward, FaSlidersH } from 'react-icons/fa';
import GlassCard from '../GlassCard.jsx';
import { ProjectCardSkeleton } from '../Skeleton.jsx';
import CustomButton from '../CustomButton.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const Projects = () => {
  // Query States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  
  // Data States
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const handleOpenDetails = async (project) => {
    setSelectedProject(project);
    setActiveImgIndex(0);
    try {
      await axiosInstance.post(`/projects/${project._id}/view`);
    } catch (err) {
      console.error('Failed to log project view count:', err);
    }
  };

  // Load all unique project categories to filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/projects?limit=100');
        if (response.data?.success && response.data.data) {
          const list = response.data.data.projects.map((p) => p.category);
          const unique = ['All', ...new Set(list.filter(Boolean))];
          setCategories(unique);
        }
      } catch (err) {
        console.error('Failed to load project categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Projects based on query changes
  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 6,
          sort
        });
        
        if (search) queryParams.append('search', search);
        if (category && category !== 'All') queryParams.append('category', category);
        
        const response = await axiosInstance.get(`/projects?${queryParams.toString()}`);
        if (response.data?.success && response.data.data) {
          setProjects(response.data.data.projects);
          setPagination(response.data.data.pagination);
        }
      } catch (error) {
        console.error('Failed to load projects list:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search typing
    const delayDebounceFn = setTimeout(() => {
      fetchProjectsData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort, page]);

  // Reset page to 1 when filters modify
  const handleFilterChange = (catName) => {
    setCategory(catName);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <section id="projects" className="py-24 bg-white dark:bg-dark-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            My <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Search, Filter & Sort Controls Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          
          {/* Search Input Box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search project title, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 text-sm"
            />
          </div>

          {/* Category Filter buttons scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap border transition-all ${
                  category === cat
                    ? 'bg-primary-500 text-white border-transparent shadow-md shadow-primary-500/10'
                    : 'bg-slate-50 dark:bg-dark-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort drop down list */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaSlidersH /> Sort:
            </span>
            <select
              value={sort}
              onChange={handleSortChange}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/30 text-xs font-semibold"
            >
              <option value="newest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="featured">Featured First</option>
              <option value="alphabetical">A - Z</option>
            </select>
          </div>

        </div>

        {/* Projects Cards List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm font-medium">No projects matched your criteria. Try adjustments!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <GlassCard
                key={project._id}
                delay={index * 0.05}
                hoverEffect={true}
                className="flex flex-col justify-between h-full group"
              >
                <div>
                  {/* Card Banner Image */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-dark-800 border border-slate-100 dark:border-slate-800">
                    <img
                      src={project.images && project.images.length > 0 ? project.images[0].url : '/images/default-project.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop' }}
                    />
                    
                    {/* Featured project badge */}
                    {project.featured && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider shadow-md">
                        Featured
                      </span>
                    )}

                    {/* Status Badge */}
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-dark-950/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>

                  {/* Info */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 font-mono">
                    {project.category}
                  </span>
                  
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 group-hover:text-primary-500 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800/80 text-[10px] font-semibold text-slate-600 dark:text-slate-350"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-bold self-center ml-1">
                        +{project.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenDetails(project)}
                      className="text-xs font-bold text-primary-500 dark:text-primary-400 hover:text-primary-400 flex items-center gap-1"
                    >
                      View Details &rarr;
                    </button>
                    <div className="flex gap-2">
                      {project.github && project.github !== '#' && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-150 hover:bg-primary-500/10 text-slate-500 hover:text-primary-500 transition-all dark:bg-dark-800"
                          title="View Source"
                        >
                          <FaGithub className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-150 hover:bg-primary-500/10 text-slate-500 hover:text-primary-500 transition-all dark:bg-dark-800"
                          title="Live Demo"
                        >
                          <FaExternalLinkAlt className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Pagination controls wrapper */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <CustomButton
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </CustomButton>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              Page {page} of {pagination.pages}
            </span>
            <CustomButton
              variant="secondary"
              size="sm"
              disabled={page === pagination.pages}
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
            >
              Next
            </CustomButton>
          </div>
        )}

      </div>

      {/* PROJECT DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Modal backdrop */}
            <motion.div
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Container */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-2xl z-50 bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              
              {/* Header Image banner / carousel */}
              <div className="relative w-full h-56 md:h-64 bg-slate-100 dark:bg-dark-800 shrink-0">
                <img
                  src={selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images[activeImgIndex]?.url : '/images/default-project.jpg'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop' }}
                />

                {/* Slider arrows control */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex(prev => (prev === 0 ? selectedProject.images.length - 1 : prev - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all font-bold text-xs"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex(prev => (prev === selectedProject.images.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all font-bold text-xs"
                    >
                      &rarr;
                    </button>
                    
                    {/* Dots indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/35 px-2.5 py-1 rounded-full">
                      {selectedProject.images.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            activeImgIndex === i ? 'bg-white scale-125' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Dismiss button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all focus:outline-none z-10"
                  aria-label="Dismiss Modal"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Scrollable details content */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                
                {/* Header row */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 font-mono">
                      {selectedProject.category}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {selectedProject.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                    {selectedProject.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>

                {/* Info parameters row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100 dark:border-slate-800/80">
                  {selectedProject.duration && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary-500 text-sm" />
                      <div className="leading-tight text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{selectedProject.duration}</p>
                      </div>
                    </div>
                  )}
                  {selectedProject.role && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary-500 text-sm" />
                      <div className="leading-tight text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{selectedProject.role}</p>
                      </div>
                    </div>
                  )}
                  {selectedProject.skills && (
                    <div className="flex items-center gap-2">
                      <FaCode className="text-primary-500 text-sm" />
                      <div className="leading-tight text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{selectedProject.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills tags list */}
                {selectedProject.skills && (
                  <div className="space-y-2 text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Achievements list */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div className="space-y-2.5 text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Accomplishments</h4>
                    <ul className="space-y-2">
                      {selectedProject.achievements.map((achievement) => (
                        <li key={achievement} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                          <FaAward className="text-primary-500 shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Action buttons footer */}
              <div className="p-6 bg-slate-50 dark:bg-dark-950 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-4 justify-end">
                {selectedProject.github && selectedProject.github !== '#' && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                    <CustomButton variant="secondary" icon={<FaGithub />}>
                      GitHub Repository
                    </CustomButton>
                  </a>
                )}
                {selectedProject.link && selectedProject.link !== '#' && (
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                    <CustomButton variant="primary" icon={<FaExternalLinkAlt />}>
                      Visit Website
                    </CustomButton>
                  </a>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
