import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Social from '../models/Social.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Message from '../models/Message.js';
import Visitor from '../models/Visitor.js';
import Analytics from '../models/Analytics.js';
import Certificate from '../models/Certificate.js';
import Resume from '../models/Resume.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

// HERO SETTINGS
export const getHero = async (req, res, next) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    return sendSuccess(res, 'Hero configuration retrieved successfully', hero);
  } catch (error) {
    next(error);
  }
};

export const updateHero = async (req, res, next) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({});
    }

    const {
      name,
      titles,
      typingEffectSpeed,
      resumeUrl,
      githubLink,
      linkedinLink,
      leetcodeLink,
      otherSocials,
      mainText,
      subtitle,
      backgroundAnimation,
      scrollIndicator,
      animatedName
    } = req.body;

    if (name !== undefined) hero.name = name;
    if (typingEffectSpeed !== undefined) hero.typingEffectSpeed = parseInt(typingEffectSpeed);
    if (resumeUrl !== undefined) hero.resumeUrl = resumeUrl;
    if (githubLink !== undefined) hero.githubLink = githubLink;
    if (linkedinLink !== undefined) hero.linkedinLink = linkedinLink;
    if (leetcodeLink !== undefined) hero.leetcodeLink = leetcodeLink;
    if (mainText !== undefined) hero.mainText = mainText;
    if (subtitle !== undefined) hero.subtitle = subtitle;
    if (backgroundAnimation !== undefined) hero.backgroundAnimation = backgroundAnimation;
    if (scrollIndicator !== undefined) hero.scrollIndicator = scrollIndicator === 'true' || scrollIndicator === true;
    if (animatedName !== undefined) hero.animatedName = animatedName === 'true' || animatedName === true;

    if (titles !== undefined) {
      hero.titles = Array.isArray(titles) ? titles : titles.split(',').map((t) => t.trim());
    }

    if (otherSocials !== undefined) {
      hero.otherSocials = typeof otherSocials === 'string' ? JSON.parse(otherSocials) : otherSocials;
    }

    await hero.save();
    return sendSuccess(res, 'Hero configuration updated successfully', hero);
  } catch (error) {
    next(error);
  }
};

// ABOUT SETTINGS
export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    return sendSuccess(res, 'About configuration retrieved successfully', about);
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({});
    }

    const {
      introduction,
      careerObjective,
      email,
      phone,
      location,
      languages,
      projectsCompleted,
      dsaProblemsSolved,
      internshipsCount,
      hackathonsWon,
      awardsCount
    } = req.body;

    if (introduction !== undefined) about.introduction = introduction;
    if (careerObjective !== undefined) about.careerObjective = careerObjective;

    if (!about.personalInfo) about.personalInfo = {};
    if (email !== undefined) about.personalInfo.email = email;
    if (phone !== undefined) about.personalInfo.phone = phone;
    if (location !== undefined) about.personalInfo.location = location;

    if (languages !== undefined) {
      about.personalInfo.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((l) => l.trim());
    }

    if (!about.stats) about.stats = {};
    if (projectsCompleted !== undefined) about.stats.projectsCompleted = parseInt(projectsCompleted);
    if (dsaProblemsSolved !== undefined) about.stats.dsaProblemsSolved = parseInt(dsaProblemsSolved);
    if (internshipsCount !== undefined) about.stats.internshipsCount = parseInt(internshipsCount);
    if (hackathonsWon !== undefined) about.stats.hackathonsWon = parseInt(hackathonsWon);
    if (awardsCount !== undefined) about.stats.awardsCount = parseInt(awardsCount);

    if (req.file) {
      if (about.profileImagePublicId) {
        await deleteFromCloudinary(about.profileImagePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/about');
      about.profileImage = uploadResult.secure_url;
      about.profileImagePublicId = uploadResult.public_id;
    }

    await about.save();
    return sendSuccess(res, 'About configuration updated successfully', about);
  } catch (error) {
    next(error);
  }
};

// SOCIAL LINKS CRUD
export const getSocials = async (req, res, next) => {
  try {
    const socials = await Social.find().sort({ createdAt: 1 });
    return sendSuccess(res, 'Social links retrieved successfully', socials);
  } catch (error) {
    next(error);
  }
};

export const createSocial = async (req, res, next) => {
  const { platform, url, icon, isFooter, isHero } = req.body;
  try {
    const social = await Social.create({
      platform,
      url,
      icon,
      isFooter: isFooter === 'true' || isFooter === true,
      isHero: isHero === 'true' || isHero === true
    });
    return sendSuccess(res, 'Social link created successfully', social, 201);
  } catch (error) {
    next(error);
  }
};

export const updateSocial = async (req, res, next) => {
  const { id } = req.params;
  const { platform, url, icon, isFooter, isHero } = req.body;
  try {
    const social = await Social.findById(id);
    if (!social) {
      return sendError(res, 'Social link not found', null, 404);
    }
    if (platform !== undefined) social.platform = platform;
    if (url !== undefined) social.url = url;
    if (icon !== undefined) social.icon = icon;
    if (isFooter !== undefined) social.isFooter = isFooter === 'true' || isFooter === true;
    if (isHero !== undefined) social.isHero = isHero === 'true' || isHero === true;

    await social.save();
    return sendSuccess(res, 'Social link updated successfully', social);
  } catch (error) {
    next(error);
  }
};

export const deleteSocial = async (req, res, next) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return sendError(res, 'Social link not found', null, 404);
    }
    await Social.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Social link deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ANALYTICS & DASHBOARD STATS
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });

    // 1. Visitor counter (Total Visitors)
    let visitorObj = await Visitor.findOne();
    if (!visitorObj) {
      visitorObj = { count: 0, totalViews: 0 };
    }

    // 2. Today's unique visitors
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAnalytics = await Analytics.findOne({ dateString: todayStr });
    const todaysVisitors = todayAnalytics ? todayAnalytics.ipList.length : 0;

    // 3. Monthly unique visitors (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyAnalytics = await Analytics.find({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const uniqueMonthlyIPs = new Set();
    monthlyAnalytics.forEach(entry => {
      if (entry.ipList) {
        entry.ipList.forEach(ip => uniqueMonthlyIPs.add(ip));
      }
    });
    const monthlyVisitors = uniqueMonthlyIPs.size || visitorObj.count;

    // 4. Total Resume Downloads
    const resumes = await Resume.find();
    const totalDownloads = resumes.reduce((acc, r) => acc + (r.downloads || 0), 0);

    // 5. Most Viewed Project
    const mostViewedProjectObj = await Project.findOne().sort({ views: -1 });
    const mostViewedProject = mostViewedProjectObj ? mostViewedProjectObj.title : 'None';

    // 6. Daily page view charts data (last 30 days)
    const analyticsList = await Analytics.find()
      .sort({ dateString: -1 })
      .limit(30);

    // 7. Recent messages
    const recentMessages = await Message.find().sort({ date: -1 }).limit(5);

    // 8. Latest activities
    const latestActivities = [
      { id: '1', action: 'System Loaded', details: 'Express server initialized', time: new Date() }
    ];
    
    const project = await Project.findOne().sort({ updatedAt: -1 });
    if (project) {
      latestActivities.push({ id: '2', action: 'Project Update', details: `Modified project '${project.title}'`, time: project.updatedAt });
    }
    
    const skill = await Skill.findOne().sort({ updatedAt: -1 });
    if (skill) {
      latestActivities.push({ id: '3', action: 'Skill Update', details: `Modified skill '${skill.name}'`, time: skill.updatedAt });
    }

    return sendSuccess(res, 'Dashboard analytics retrieved successfully', {
      stats: {
        projects: totalProjects,
        skills: totalSkills,
        certificates: totalCertificates,
        messages: totalMessages,
        unreadMessages,
        visitors: visitorObj.count,
        totalViews: visitorObj.totalViews,
        todaysVisitors,
        monthlyVisitors,
        downloads: totalDownloads,
        mostViewedProject
      },
      recentMessages,
      analytics: analyticsList.reverse(),
      latestActivities: latestActivities.sort((a, b) => b.time - a.time)
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicVisitorCount = async (req, res, next) => {
  try {
    let visitorObj = await Visitor.findOne();
    if (!visitorObj) {
      visitorObj = { count: 0, totalViews: 0 };
    }
    return sendSuccess(res, 'Visitor count retrieved successfully', {
      count: visitorObj.count,
      totalViews: visitorObj.totalViews
    });
  } catch (error) {
    next(error);
  }
};
