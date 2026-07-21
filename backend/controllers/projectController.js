import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Get Projects (with Search, Filter, Sort, Pagination)
export const getProjects = async (req, res, next) => {
  const { search, category, sort, page = 1, limit = 9, featured } = req.query;

  try {
    const query = {};

    // 1. Searching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Filtering
    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // 3. Counting total matches
    const total = await Project.countDocuments(query);

    // 4. Sorting
    let sortOptions = { createdAt: -1 }; // default sorting
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'featured') {
      sortOptions = { featured: -1, createdAt: -1 };
    } else if (sort === 'alphabetical') {
      sortOptions = { title: 1 };
    }

    // 5. Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const projects = await Project.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    return sendSuccess(res, 'Projects retrieved successfully', {
      projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single project
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 'Project not found', null, 404);
    }
    return sendSuccess(res, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

// Create a project
export const createProject = async (req, res, next) => {
  const { title, description, skills, category, link, github, status, duration, role, achievements, featured } = req.body;

  try {
    let imagesList = [];

    // Handle Cloudinary upload if multiple files are provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer, 'portfolio/projects');
        imagesList.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });
      }
    } else {
      imagesList.push({
        url: '/images/default-project.jpg',
        publicId: ''
      });
    }

    // Parse array inputs
    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : skills 
        ? skills.split(',').map(s => s.trim()) 
        : [];
        
    const parsedAchievements = Array.isArray(achievements)
      ? achievements
      : achievements
        ? achievements.split(',').map(a => a.trim())
        : [];

    const newProject = await Project.create({
      title,
      description,
      skills: parsedSkills,
      category,
      link,
      github,
      status,
      duration,
      role,
      achievements: parsedAchievements,
      featured: featured === 'true' || featured === true,
      images: imagesList
    });

    return sendSuccess(res, 'Project created successfully', newProject, 201);
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, skills, category, link, github, status, duration, role, achievements, featured } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return sendError(res, 'Project not found', null, 404);
    }

    // Handle Cloudinary upload
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (project.images && project.images.length > 0) {
        for (const img of project.images) {
          if (img.publicId) {
            await deleteFromCloudinary(img.publicId);
          }
        }
      }

      let newImages = [];
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer, 'portfolio/projects');
        newImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });
      }
      project.images = newImages;
    }

    // Update basic fields
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (category !== undefined) project.category = category;
    if (link !== undefined) project.link = link;
    if (github !== undefined) project.github = github;
    if (status !== undefined) project.status = status;
    if (duration !== undefined) project.duration = duration;
    if (role !== undefined) project.role = role;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;

    // Parse array inputs if provided
    if (skills !== undefined) {
      project.skills = Array.isArray(skills) 
        ? skills 
        : skills 
          ? skills.split(',').map(s => s.trim()) 
          : [];
    }

    if (achievements !== undefined) {
      project.achievements = Array.isArray(achievements)
        ? achievements
        : achievements
          ? achievements.split(',').map(a => a.trim())
          : [];
    }

    await project.save();
    return sendSuccess(res, 'Project updated successfully', project);
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return sendError(res, 'Project not found', null, 404);
    }

    // Delete all images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Increment Project Views
export const viewProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!project) {
      return sendError(res, 'Project not found', null, 404);
    }
    return sendSuccess(res, 'Project views incremented successfully', { views: project.views });
  } catch (error) {
    next(error);
  }
};
