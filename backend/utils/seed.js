import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certificate from '../models/Certificate.js';
import Achievements from '../models/Achievements.js';
import Visitor from '../models/Visitor.js';
import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Social from '../models/Social.js';
import Leadership from '../models/Leadership.js';

export const seedDatabase = async () => {
  try {
    console.log('Checking database collections for seeding...');

    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminUser = process.env.INITIAL_ADMIN_USER || 'admin';
      const adminPass = process.env.INITIAL_ADMIN_PASS || 'admin123';
      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@example.com';

      await Admin.create({
        username: adminUser,
        email: adminEmail,
        password: adminPass, // Will be hashed automatically by pre('save') middleware
        role: 'superadmin'
      });
      console.log(`+ Admin account seeded. User: '${adminUser}', Password: '${adminPass}' (Update this in production!)`);
    }

    // 2. Seed Hero Section Config
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      await Hero.create({
        name: 'Sushant Awalekar',
        titles: ['Full Stack Developer', 'Software Engineer', 'DSA Enthusiast'],
        mainText: 'Building robust backend architectures and dynamic user experiences.',
        subtitle: 'Welcome to my portfolio',
        githubLink: 'https://github.com',
        linkedinLink: 'https://linkedin.com',
        leetcodeLink: 'https://leetcode.com',
        scrollIndicator: true,
        animatedName: true,
        backgroundAnimation: 'particles'
      });
      console.log('+ Hero section config seeded.');
    }

    // 3. Seed About Section Config
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create({
        introduction: 'I am a Software Development Engineer with a strong foundation in MERN stack development and Data Structures & Algorithms. I enjoy writing clean, maintainable, and scalable code.',
        careerObjective: 'To work in an innovative environment where I can leverage my programming and system design skills to solve complex problems.',
        personalInfo: {
          email: 'sushant@example.com',
          phone: '+91 9876543210',
          location: 'Maharashtra, India',
          languages: ['English', 'Hindi', 'Marathi']
        },
        stats: {
          projectsCompleted: 15,
          dsaProblemsSolved: 450,
          internshipsCount: 1,
          hackathonsWon: 2,
          awardsCount: 3
        }
      });
      console.log('+ About section config seeded.');
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: 'Full Stack E-Commerce Platform',
          description: 'A modern e-commerce platform with a React frontend, Node Express backend, Stripe payment gateway, and dashboard.',
          skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Stripe'],
          category: 'Web Development',
          link: 'https://github.com',
          github: 'https://github.com',
          status: 'Completed',
          duration: '3 Months',
          role: 'Lead Developer',
          featured: true,
          achievements: ['Integrated Stripe API', 'Achieved 95+ Lighthouse Performance Score'],
          images: [{ url: '/images/default-project.jpg', publicId: '' }]
        },
        {
          title: 'DevChat - Realtime Collaboration App',
          description: 'A Slack-like application for developers supporting group chats, channels, file sharing, and video calling.',
          skills: ['React', 'Socket.io', 'Node.js', 'WebRTC', 'Chakra UI'],
          category: 'Web Application',
          link: 'https://github.com',
          github: 'https://github.com',
          status: 'Completed',
          duration: '2 Months',
          role: 'Full Stack Engineer',
          featured: true,
          achievements: ['Scaled to 100 concurrent websocket connections', 'Implemented WebRTC peer connections'],
          images: [{ url: '/images/default-project.jpg', publicId: '' }]
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log('+ Projects seeded.');
    }

    // 5. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        { name: 'JavaScript (ES6+)', category: 'Programming Languages', proficiency: 90, experience: '3 years', logo: 'FaJs' },
        { name: 'Python', category: 'Programming Languages', proficiency: 80, experience: '2 years', logo: 'FaPython' },
        { name: 'React', category: 'Frontend', proficiency: 92, experience: '2 years', logo: 'FaReact' },
        { name: 'Node.js', category: 'Backend', proficiency: 85, experience: '2 years', logo: 'FaNodeJs' },
        { name: 'Express.js', category: 'Backend', proficiency: 88, experience: '2 years', logo: 'FaNodeJs' },
        { name: 'MongoDB', category: 'Database', proficiency: 85, experience: '2 years', logo: 'FaDatabase' },
        { name: 'Docker', category: 'DevOps', proficiency: 75, experience: '1 year', logo: 'FaDocker' },
        { name: 'AWS Services', category: 'Cloud', proficiency: 70, experience: '1 year', logo: 'FaAws' },
        { name: 'Git & GitHub', category: 'Tools', proficiency: 90, experience: '3 years', logo: 'FaGithub' },
        { name: 'Problem Solving', category: 'Soft Skills', proficiency: 95, experience: '3 years', logo: 'FaBrain' }
      ];
      await Skill.insertMany(defaultSkills);
      console.log('+ Skills seeded.');
    }

    // 6. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      await Education.create({
        institute: 'Technical University',
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        duration: '2020 - 2024',
        cgpa: '8.9 / 10',
        relevantCoursework: ['Data Structures', 'Database Management Systems', 'Software Engineering', 'Computer Networks'],
        achievements: ['Dean\'s list for academic excellence', 'Hackathon winner'],
        location: 'Pune, Maharashtra'
      });
      console.log('+ Education history seeded.');
    }

    // 7. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      await Experience.create({
        company: 'Innovate Tech Labs',
        position: 'Software Engineer Intern',
        location: 'Hybrid',
        duration: 'Jan 2024 - June 2024',
        description: 'Developed responsive components in React, improving render speeds by 15%, built RESTful API services in Node.js, and worked with Agile scrum methodologies during weekly standups.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Git'],
        link: 'https://company.com'
      });
      console.log('+ Experience timeline seeded.');
    }

    // 8. Seed Certificates
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.create({
        name: 'React Developer Certification',
        issuer: 'Meta / Coursera',
        issueDate: 'October 2023',
        credentialLink: 'https://coursera.org',
        verifyButton: true
      });
      console.log('+ Certificates seeded.');
    }

    // 9. Seed Achievements
    const achCount = await Achievements.countDocuments();
    if (achCount === 0) {
      await Achievements.create({
        title: 'Smart India Hackathon Finalist',
        event: 'Ministry of Education',
        description: 'Developed a prototype web application for monitoring clean water systems.',
        category: 'Hackathon',
        date: '2023',
        ranking: 'Top 10 National Finalists'
      });
      console.log('+ Achievements seeded.');
    }

    // 10. Seed Social Links
    const socialCount = await Social.countDocuments();
    if (socialCount === 0) {
      const defaultSocials = [
        { platform: 'GitHub', url: 'https://github.com', icon: 'FaGithub', isFooter: true, isHero: true },
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'FaLinkedin', isFooter: true, isHero: true },
        { platform: 'LeetCode', url: 'https://leetcode.com', icon: 'FaCode', isFooter: true, isHero: true }
      ];
      await Social.insertMany(defaultSocials);
      console.log('+ Social links seeded.');
    }

    // 11. Seed Leadership
    const leadershipCount = await Leadership.countDocuments();
    if (leadershipCount === 0) {
      await Leadership.create({
        organization: 'ACM Student Chapter',
        role: 'Chairman',
        duration: '2022 - 2023',
        description: 'Led a team of 15 committee members to host national-level coding events and technical workshops for 300+ student attendees.'
      });
      console.log('+ Leadership seeded.');
    }

    // 12. Seed Visitor tracking object
    const visitorCount = await Visitor.countDocuments();
    if (visitorCount === 0) {
      await Visitor.create({ count: 0, totalViews: 0 });
      console.log('+ Visitor counts seeded.');
    }

    console.log('Database checking and seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database default configurations:', error);
  }
};
