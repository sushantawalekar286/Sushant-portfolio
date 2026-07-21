import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Spinner for Lazy Loading
import Loader from '../components/Loader/Loader.jsx';

// Lazy Loaded Pages
const Home = lazy(() => import('../pages/Home.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));
const Login = lazy(() => import('../pages/Admin/Login.jsx'));

// Admin Subpages
const Dashboard = lazy(() => import('../pages/Admin/Dashboard.jsx'));
const ProjectsManager = lazy(() => import('../pages/Admin/ProjectsManager.jsx'));
const SkillsManager = lazy(() => import('../pages/Admin/SkillsManager.jsx'));
const ExperiencesManager = lazy(() => import('../pages/Admin/ExperiencesManager.jsx'));
const EducationManager = lazy(() => import('../pages/Admin/EducationManager.jsx'));
const CertificatesManager = lazy(() => import('../pages/Admin/CertificatesManager.jsx'));
const AchievementsManager = lazy(() => import('../pages/Admin/AchievementsManager.jsx'));
const Messages = lazy(() => import('../pages/Admin/Messages.jsx'));
const SettingsManager = lazy(() => import('../pages/Admin/SettingsManager.jsx'));
const LeadershipManager = lazy(() => import('../pages/Admin/LeadershipManager.jsx'));

const router = createBrowserRouter([
  // Public Paths
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader fullPage text="Assembling Page Sections..." />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loader fullPage text="Retrieving 404 Panel..." />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  },
  // Admin Authentication Path
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<Loader fullPage text="Opening Admin Login..." />}>
        <Login />
      </Suspense>
    )
  },
  // Protected Admin Paths
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader text="Loading Dashboard stats..." />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<Loader text="Loading Projects panel..." />}>
            <ProjectsManager />
          </Suspense>
        )
      },
      {
        path: 'skills',
        element: (
          <Suspense fallback={<Loader text="Loading Skills panel..." />}>
            <SkillsManager />
          </Suspense>
        )
      },
      {
        path: 'experiences',
        element: (
          <Suspense fallback={<Loader text="Loading Experiences panel..." />}>
            <ExperiencesManager />
          </Suspense>
        )
      },
      {
        path: 'education',
        element: (
          <Suspense fallback={<Loader text="Loading Education panel..." />}>
            <EducationManager />
          </Suspense>
        )
      },
      {
        path: 'certificates',
        element: (
          <Suspense fallback={<Loader text="Loading Certificates panel..." />}>
            <CertificatesManager />
          </Suspense>
        )
      },
      {
        path: 'achievements',
        element: (
          <Suspense fallback={<Loader text="Loading Achievements panel..." />}>
            <AchievementsManager />
          </Suspense>
        )
      },
      {
        path: 'leadership',
        element: (
          <Suspense fallback={<Loader text="Loading Leadership panel..." />}>
            <LeadershipManager />
          </Suspense>
        )
      },
      {
        path: 'resumes',
        // Resumes are managed inside settings tabs but let's point it to Settings Tab as a shortcut!
        element: (
          <Suspense fallback={<Loader text="Opening Resume Manager..." />}>
            <SettingsManager />
          </Suspense>
        )
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<Loader text="Retrieving messages inbox..." />}>
            <Messages />
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<Loader text="Opening Configuration settings..." />}>
            <SettingsManager />
          </Suspense>
        )
      }
    ]
  }
]);

export default router;
