import Education from '../models/Education.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getEducations = async (req, res, next) => {
  try {
    const educations = await Education.find().sort({ duration: -1 });
    return sendSuccess(res, 'Education history retrieved successfully', educations);
  } catch (error) {
    next(error);
  }
};

export const getEducation = async (req, res, next) => {
  try {
    const edu = await Education.findById(req.params.id);
    if (!edu) {
      return sendError(res, 'Education record not found', null, 404);
    }
    return sendSuccess(res, 'Education record retrieved successfully', edu);
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (req, res, next) => {
  const { institute, degree, duration, cgpa, relevantCoursework, achievements, location } = req.body;

  try {
    const parsedCoursework = Array.isArray(relevantCoursework)
      ? relevantCoursework
      : relevantCoursework
        ? relevantCoursework.split(',').map(c => c.trim())
        : [];
        
    const parsedAchievements = Array.isArray(achievements)
      ? achievements
      : achievements
        ? achievements.split(',').map(a => a.trim())
        : [];

    const edu = await Education.create({
      institute,
      degree,
      duration,
      cgpa,
      relevantCoursework: parsedCoursework,
      achievements: parsedAchievements,
      location
    });

    return sendSuccess(res, 'Education record created successfully', edu, 201);
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  const { id } = req.params;
  const { institute, degree, duration, cgpa, relevantCoursework, achievements, location } = req.body;

  try {
    const edu = await Education.findById(id);
    if (!edu) {
      return sendError(res, 'Education record not found', null, 404);
    }

    if (institute !== undefined) edu.institute = institute;
    if (degree !== undefined) edu.degree = degree;
    if (duration !== undefined) edu.duration = duration;
    if (cgpa !== undefined) edu.cgpa = cgpa;
    if (location !== undefined) edu.location = location;

    if (relevantCoursework !== undefined) {
      edu.relevantCoursework = Array.isArray(relevantCoursework)
        ? relevantCoursework
        : relevantCoursework
          ? relevantCoursework.split(',').map(c => c.trim())
          : [];
    }

    if (achievements !== undefined) {
      edu.achievements = Array.isArray(achievements)
        ? achievements
        : achievements
          ? achievements.split(',').map(a => a.trim())
          : [];
    }

    await edu.save();
    return sendSuccess(res, 'Education record updated successfully', edu);
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const edu = await Education.findById(req.params.id);
    if (!edu) {
      return sendError(res, 'Education record not found', null, 404);
    }

    await Education.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Education record deleted successfully');
  } catch (error) {
    next(error);
  }
};
