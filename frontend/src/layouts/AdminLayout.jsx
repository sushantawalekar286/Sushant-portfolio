import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, FaProjectDiagram, FaBriefcase, FaGraduationCap, 
  FaCertificate, FaTrophy, FaEnvelope, FaFilePdf, FaCog, 
  FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaLaptopCode, FaUsers
} from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore.js';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle.jsx';

const AdminLayout = () => {
  const { isAuthenticated, user, checkAuth, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400 tracking-wider">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram /> },
    { name: 'Skills', path: '/admin/skills', icon: <FaLaptopCode /> },
    { name: 'Experiences', path: '/admin/experiences', icon: <FaBriefcase /> },
    { name: 'Education', path: '/admin/education', icon: <FaGraduationCap /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <FaCertificate /> },
    { name: 'Achievements', path: '/admin/achievements', icon: <FaTrophy /> },
    { name: 'Leadership', path: '/admin/leadership', icon: <FaUsers /> },
    { name: 'Resumes', path: '/admin/resumes', icon: <FaFilePdf /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelope /> },
    { name: 'Config Settings', path: '/admin/settings', icon: <FaCog /> }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/10 dark:border-slate-800/40 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight text-gradient">Admin Center</h2>
            <p className="text-xxs text-slate-400">Developer Portfolio</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600/10 to-purple-600/10 text-primary-500 border border-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-dark-800/30'
                }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all focus:outline-none"
          >
            <FaSignOutAlt className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 glass-panel border-b border-white/10 dark:border-slate-800/40 flex items-center justify-between px-6 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-xl p-2 rounded-lg bg-slate-200/50 dark:hover:bg-dark-800/50 focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="hidden sm:block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Role: <span className="text-primary-500">{user?.role || 'Admin'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <FaUserCircle className="w-6 h-6 text-slate-400" />
              <div className="hidden md:block leading-none text-left">
                <p className="text-xs font-semibold">{user?.username}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content body wrapper */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed top-0 bottom-0 left-0 w-64 z-40 bg-white dark:bg-dark-900 shadow-2xl flex flex-col lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <h2 className="font-bold text-sm leading-tight text-gradient">Admin Center</h2>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600/10 to-purple-600/10 text-primary-500 border border-primary-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800/30'
                      }`}
                    >
                      <span className="text-lg shrink-0">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all focus:outline-none"
                >
                  <FaSignOutAlt className="text-lg" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
