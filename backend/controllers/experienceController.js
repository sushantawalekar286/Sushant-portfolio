import Experience from '../models/Experience.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Experiences retrieved successfully', experiences);
  } catch (error) {
    next(error);
  }
};

export const getExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return sendError(res, 'Experience record not found', null, 404);
    }
    return sendSuccess(res, 'Experience retrieved successfully', exp);
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  const { company, position, location, duration, description, technologies, certificate, link } = req.body;

  try {
    const parsedTech = Array.isArray(technologies)
      ? technologies
      : technologies
        ? technologies.split(',').map(t => t.trim())
        : [];

    const exp = await Experience.create({
      company,
      position,
      location,
      duration,
      description,
      technologies: parsedTech,
      certificate,
      link
    });

    return sendSuccess(res, 'Experience record created successfully', exp, 201);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  const { id } = req.params;
  const { company, position, location, duration, description, technologies, certificate, link } = req.body;

  try {
    const exp = await Experience.findById(id);
    if (!exp) {
      return sendError(res, 'Experience record not found', null, 404);
    }

    if (company !== undefined) exp.company = company;
    if (position !== undefined) exp.position = position;
    if (location !== undefined) exp.location = location;
    if (duration !== undefined) exp.duration = duration;
    if (description !== undefined) exp.description = description;
    if (certificate !== undefined) exp.certificate = certificate;
    if (link !== undefined) exp.link = link;

    if (technologies !== undefined) {
      exp.technologies = Array.isArray(technologies)
        ? technologies
        : technologies
          ? technologies.split(',').map(t => t.trim())
          : [];
    }

    await exp.save();
    return sendSuccess(res, 'Experience record updated successfully', exp);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return sendError(res, 'Experience record not found', null, 404);
    }

    await Experience.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Experience record deleted successfully');
  } catch (error) {
    next(error);
  }
};
