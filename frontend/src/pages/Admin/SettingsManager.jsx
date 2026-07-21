import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  FaCog, FaUser, FaLink, FaFilePdf, FaImage, FaPlus, 
  FaTrash, FaCheck, FaExclamationTriangle, FaEdit, FaTimes 
} from 'react-icons/fa';
import GlassCard from '../../components/GlassCard.jsx';
import CustomButton from '../../components/CustomButton.jsx';
import { Input, TextArea } from '../../components/Input.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);

  // States for sub-objects
  const [socials, setSocials] = useState([]);
  const [resumes, setResumes] = useState([]);
  
  // Custom files upload
  const [pfpFile, setPfpFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [newPdfLabel, setNewPdfLabel] = useState('');

  // Modals for Socials
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);

  // Forms
  const { register: regHero, handleSubmit: subHero, reset: resHero } = useForm();
  const { register: regAbout, handleSubmit: subAbout, reset: resAbout } = useForm();
  const { register: regSocial, handleSubmit: subSocial, reset: resSocial } = useForm();

  // Load configs
  const loadHeroConfig = async () => {
    try {
      const response = await axiosInstance.get('/settings/hero');
      if (response.data?.success && response.data.data) {
        const data = response.data.data;
        resHero({
          name: data.name,
          titles: data.titles.join(', '),
          mainText: data.mainText,
          subtitle: data.subtitle,
          githubLink: data.githubLink,
          linkedinLink: data.linkedinLink,
          leetcodeLink: data.leetcodeLink
        });
      }
    } catch (e) {
      toast.error('Failed to load Hero settings.');
    }
  };

  const loadAboutConfig = async () => {
    try {
      const response = await axiosInstance.get('/settings/about');
      if (response.data?.success && response.data.data) {
        const data = response.data.data;
        resAbout({
          introduction: data.introduction,
          careerObjective: data.careerObjective,
          email: data.personalInfo?.email || '',
          location: data.personalInfo?.location || '',
          languages: data.personalInfo?.languages?.join(', ') || '',
          projectsCompleted: data.stats?.projectsCompleted || 0,
          dsaProblemsSolved: data.stats?.dsaProblemsSolved || 0,
          internshipsCount: data.stats?.internshipsCount || 0,
          hackathonsWon: data.stats?.hackathonsWon || 0,
          awardsCount: data.stats?.awardsCount || 0
        });
      }
    } catch (e) {
      toast.error('Failed to load About settings.');
    }
  };

  const loadSocials = async () => {
    try {
      const res = await axiosInstance.get('/settings/socials');
      if (res.data?.success) setSocials(res.data.data);
    } catch (e) {}
  };

  const loadResumes = async () => {
    try {
      const res = await axiosInstance.get('/resumes');
      if (res.data?.success) setResumes(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    loadHeroConfig();
    loadAboutConfig();
    loadSocials();
    loadResumes();
  }, []);

  // Update Hero Submit
  const onHeroSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put('/settings/hero', data);
      if (res.data?.success) {
        toast.success('Hero configuration saved!');
      }
    } catch (err) {
      toast.error('Failed to update Hero settings.');
    } finally {
      setLoading(false);
    }
  };

  // Update About Submit (handles image multipart)
  const onAboutSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('introduction', data.introduction);
    formData.append('careerObjective', data.careerObjective);
    formData.append('email', data.email);
    formData.append('location', data.location);
    formData.append('languages', data.languages);
    formData.append('projectsCompleted', data.projectsCompleted);
    formData.append('dsaProblemsSolved', data.dsaProblemsSolved);
    formData.append('internshipsCount', data.internshipsCount);
    formData.append('hackathonsWon', data.hackathonsWon);
    formData.append('awardsCount', data.awardsCount);

    if (pfpFile) {
      formData.append('image', pfpFile);
    }

    try {
      const res = await axiosInstance.put('/settings/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        toast.success('About bio & profile image updated!');
        setPfpFile(null);
      }
    } catch (err) {
      toast.error('Failed to update About details.');
    } finally {
      setLoading(false);
    }
  };

  // Social Links management
  const handleOpenSocialModal = (social = null) => {
    setEditingSocial(social);
    if (social) {
      resSocial({
        platform: social.platform,
        url: social.url,
        icon: social.icon
      });
    } else {
      resSocial({ platform: '', url: '', icon: '' });
    }
    setIsSocialModalOpen(true);
  };

  const onSocialSubmit = async (data) => {
    try {
      let res;
      if (editingSocial) {
        res = await axiosInstance.put(`/settings/socials/${editingSocial._id}`, data);
      } else {
        res = await axiosInstance.post('/settings/socials', data);
      }
      if (res.data?.success) {
        toast.success(editingSocial ? 'Social link updated!' : 'Social link created!');
        setIsSocialModalOpen(false);
        loadSocials();
      }
    } catch (err) {
      toast.error('Error saving social link.');
    }
  };

  const handleDeleteSocial = async (id) => {
    if (!window.confirm('Delete this social link?')) return;
    try {
      const res = await axiosInstance.delete(`/settings/socials/${id}`);
      if (res.data?.success) {
        toast.success('Social link deleted.');
        loadSocials();
      }
    } catch (e) {
      toast.error('Failed to delete social link.');
    }
  };

  // Resume PDF uploading
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      return toast.warning('Please select a PDF file first.');
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('label', newPdfLabel || 'Software Engineer Resume');
    formData.append('file', pdfFile);

    try {
      const res = await axiosInstance.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        toast.success('New resume version uploaded successfully!');
        setPdfFile(null);
        setNewPdfLabel('');
        loadResumes();
      }
    } catch (error) {
      toast.error('Failed to upload resume file.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetResumeActive = async (id) => {
    try {
      const res = await axiosInstance.put(`/resumes/${id}/active`);
      if (res.data?.success) {
        toast.success('Active resume toggled!');
        loadResumes();
      }
    } catch (e) {
      toast.error('Failed to toggle active resume.');
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Delete this resume copy permanently?')) return;
    try {
      const res = await axiosInstance.delete(`/resumes/${id}`);
      if (res.data?.success) {
        toast.success('Resume deleted successfully.');
        loadResumes();
      }
    } catch (e) {
      toast.error('Failed to delete resume.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
          Configuration Settings
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Adjust landing values, manage social networks, bio details, and files.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-px">
        {[
          { id: 'hero', label: 'Hero Section', icon: <FaCog /> },
          { id: 'about', label: 'About & Stats', icon: <FaUser /> },
          { id: 'socials', label: 'Social Networks', icon: <FaLink /> },
          { id: 'resumes', label: 'Resumes Manager', icon: <FaFilePdf /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-widest transition-all focus:outline-none ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content panel switch */}
      <div className="pt-4">
        {activeTab === 'hero' && (
          <GlassCard hoverEffect={false} className="p-6 md:p-8">
            <form onSubmit={subHero(onHeroSubmit)} className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Edit Hero Attributes</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Animated Name" {...regHero('name')} />
                <Input label="Subtitle label badge" {...regHero('subtitle')} />
              </div>

              <Input label="Job Titles (comma-separated)" placeholder="SDE Intern, Full Stack Developer" {...regHero('titles')} />

              <TextArea label="Intro main pitch statement" rows={3} {...regHero('mainText')} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input label="GitHub Anchor URL" {...regHero('githubLink')} />
                <Input label="LinkedIn Anchor URL" {...regHero('linkedinLink')} />
                <Input label="LeetCode Anchor URL" {...regHero('leetcodeLink')} />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <CustomButton type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </CustomButton>
              </div>
            </form>
          </GlassCard>
        )}

        {activeTab === 'about' && (
          <GlassCard hoverEffect={false} className="p-6 md:p-8">
            <form onSubmit={subAbout(onAboutSubmit)} className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Edit Bio details & Statistics</h3>
              
              <TextArea label="Biographical Paragraph" rows={3} {...regAbout('introduction')} />
              <TextArea label="Career Objective Text" rows={2} {...regAbout('careerObjective')} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Input label="Email address display" {...regAbout('email')} />
                <Input label="Location string" {...regAbout('location')} />
                <Input label="Languages spoken (comma-separated)" {...regAbout('languages')} />
              </div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
                Interactive Statistics Count
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
                <Input label="Projects Completed" type="number" {...regAbout('projectsCompleted')} />
                <Input label="DSA Solved" type="number" {...regAbout('dsaProblemsSolved')} />
                <Input label="Internships Count" type="number" {...regAbout('internshipsCount')} />
                <Input label="Hackathons Won" type="number" {...regAbout('hackathonsWon')} />
                <Input label="Awards Received" type="number" {...regAbout('awardsCount')} />
              </div>

              {/* Avatar file upload */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avatar Profile Picture</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-950 hover:bg-slate-100 dark:hover:bg-dark-850 cursor-pointer text-xs font-bold transition-all shadow-sm">
                    <FaImage className="text-primary-500" />
                    <span>Choose Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPfpFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {pfpFile && (
                    <span className="text-xxs text-primary-500 font-bold bg-primary-500/10 px-2.5 py-1 rounded-lg">
                      {pfpFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                <CustomButton type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Save Settings'}
                </CustomButton>
              </div>
            </form>
          </GlassCard>
        )}

        {activeTab === 'socials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Anchor URLs</h3>
              <CustomButton variant="primary" size="sm" icon={<FaPlus />} onClick={() => handleOpenSocialModal(null)}>
                Add Link
              </CustomButton>
            </div>

            {socials.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-400 font-medium text-xs rounded-2xl">
                No custom social links seeded.
              </div>
            ) : (
              <div className="glass-panel rounded-2xl border border-white/10 dark:border-slate-850 overflow-hidden shadow-lg">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-250 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-3 px-6">Platform</th>
                      <th className="py-3 px-6">Target link</th>
                      <th className="py-3 px-6">Icon Key</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socials.map((social) => (
                      <tr key={social._id} className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-200/25">
                        <td className="py-3 px-6 font-bold text-slate-700 dark:text-slate-200">{social.platform}</td>
                        <td className="py-3 px-6 text-xs text-slate-450 dark:text-slate-400 break-all">{social.url}</td>
                        <td className="py-3 px-6 text-xs font-mono text-primary-500">{social.icon}</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenSocialModal(social)} className="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteSocial(social._id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resumes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Upload form */}
            <div className="lg:col-span-4">
              <GlassCard hoverEffect={false} className="p-6 text-left space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Upload Resume version</h3>
                <form onSubmit={handleUploadResume} className="space-y-4">
                  <Input 
                    label="Resume Version Label" 
                    placeholder="E.g., Software Engineer PDF" 
                    value={newPdfLabel}
                    onChange={(e) => setNewPdfLabel(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">PDF Document</label>
                    <label className="flex items-center gap-2 justify-center w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-dark-850 rounded-2xl cursor-pointer text-xs font-bold transition-all">
                      <FaFilePdf className="text-red-500 text-lg" />
                      <span>Select PDF file</span>
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className="hidden" 
                      />
                    </label>
                    {pdfFile && (
                      <span className="text-xxs font-bold text-red-500 truncate block bg-red-500/10 px-2 py-1 rounded-md mt-2">
                        {pdfFile.name}
                      </span>
                    )}
                  </div>
                  <CustomButton type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Uploading File...' : 'Upload Document'}
                  </CustomButton>
                </form>
              </GlassCard>
            </div>

            {/* List of Resumes */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Uploaded documents</h3>
              {resumes.length === 0 ? (
                <div className="glass-panel p-12 text-center text-slate-400 font-semibold text-xs rounded-2xl">
                  No resume documents uploaded.
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div 
                      key={resume._id} 
                      className={`glass-panel p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                        resume.isActive 
                          ? 'border-emerald-500/35 bg-emerald-500/5' 
                          : 'border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 text-2xl shrink-0" />
                        <div className="leading-tight text-left">
                          <p className="font-bold text-xs">{resume.label}</p>
                          <a 
                            href={resume.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xxs text-primary-500 hover:underline break-all mt-1 block"
                          >
                            Download Resume Link
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {!resume.isActive ? (
                          <button
                            onClick={() => handleSetResumeActive(resume._id)}
                            className="px-3 py-1.5 text-xxs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                            title="Set Active resume link"
                          >
                            Set Active
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 text-xxs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg flex items-center gap-1">
                            <FaCheck /> Active
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteResume(resume._id)}
                          className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                          title="Delete copy"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* SOCIAL LINK ADD/EDIT DIALOG OVERLAY */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsSocialModalOpen(false)} />
          <div className="glass-panel w-[90%] max-w-sm bg-white dark:bg-dark-900 border border-white/20 dark:border-slate-800 rounded-3xl z-10 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {editingSocial ? 'Edit Link' : 'Add Social Link'}
            </h3>
            <form onSubmit={subSocial(onSocialSubmit)} className="space-y-4">
              <Input label="Platform Name" placeholder="GitHub" {...regSocial('platform', { required: true })} />
              <Input label="Profile URL" placeholder="https://github.com/yourusername" {...regSocial('url', { required: true })} />
              <Input label="ReactIcon Key (FaGithub, FaLinkedin, FaCode)" placeholder="FaGithub" {...regSocial('icon')} />
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
                <CustomButton variant="secondary" onClick={() => setIsSocialModalOpen(false)}>Cancel</CustomButton>
                <CustomButton type="submit" variant="primary">Save Link</CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsManager;
