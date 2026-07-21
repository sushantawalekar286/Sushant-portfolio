import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import CodingProfiles from '../components/CodingProfiles.jsx';
import Skills from '../components/Skills/Skills.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Experience from '../components/Experience/Experience.jsx';
import Education from '../components/Education/Education.jsx';
import Certifications from '../components/Certifications/Certifications.jsx';
import Achievements from '../components/Achievements/Achievements.jsx';
import Leadership from '../components/Leadership/Leadership.jsx';
import Contact from '../components/Contact/Contact.jsx';

const Home = () => {
  useEffect(() => {
    // Set descriptive title for SEO
    document.title = 'Sushant Awalekar | Full Stack Developer & SDE Portfolio';
  }, []);

  return (
    <div className="relative">
      {/* 1. Hero banner */}
      <Hero />
      
      {/* 2. About section */}
      <About />
      
      {/* 3. LeetCode and Github Stats display */}
      <CodingProfiles />
      
      {/* 4. Skills Category breakdown */}
      <Skills />
      
      {/* 5. Projects filterable panel */}
      <Projects />
      
      {/* 6. Professional Work timeline */}
      <Experience />
      
      {/* 7. Academic timeline */}
      <Education />
      
      {/* 8. Certifications showcase */}
      <Certifications />
      
      {/* 9. Achievements honors */}
      <Achievements />
      
      {/* 10. Leadership roles */}
      <Leadership />
      
      {/* 11. Contact validated forms & fallback maps */}
      <Contact />
    </div>
  );
};

export default Home;
