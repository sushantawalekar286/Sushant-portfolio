import Achievements from '../models/Achievements.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAchievements = async (req, res, next) => {
  const { category } = req.query;
  try {
    const query = {};
    if (category) {
      query.category = category;
    }
    const achievements = await Achievements.find(query).sort({ date: -1 });
    return sendSuccess(res, 'Achievements retrieved successfully', achievements);
  } catch (error) {
    next(error);
  }
};

export const getAchievement = async (req, res, next) => {
  try {
    const ach = await Achievements.findById(req.params.id);
    if (!ach) {
      return sendError(res, 'Achievement not found', null, 404);
    }
    return sendSuccess(res, 'Achievement retrieved successfully', ach);
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  const { title, event, description, category, date, ranking, link } = req.body;

  try {
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/achievements');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const ach = await Achievements.create({
      title,
      event,
      description,
      category,
      date,
      ranking,
      link,
      image: imageUrl,
      imagePublicId
    });

    return sendSuccess(res, 'Achievement created successfully', ach, 201);
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req, res, next) => {
  const { id } = req.params;
  const { title, event, description, category, date, ranking, link } = req.body;

  try {
    const ach = await Achievements.findById(id);
    if (!ach) {
      return sendError(res, 'Achievement not found', null, 404);
    }

    if (req.file) {
      if (ach.imagePublicId) {
        await deleteFromCloudinary(ach.imagePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/achievements');
      ach.image = uploadResult.secure_url;
      ach.imagePublicId = uploadResult.public_id;
    }

    if (title !== undefined) ach.title = title;
    if (event !== undefined) ach.event = event;
    if (description !== undefined) ach.description = description;
    if (category !== undefined) ach.category = category;
    if (date !== undefined) ach.date = date;
    if (ranking !== undefined) ach.ranking = ranking;
    if (link !== undefined) ach.link = link;

    await ach.save();
    return sendSuccess(res, 'Achievement updated successfully', ach);
  } catch (error) {
    next(error);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const ach = await Achievements.findById(req.params.id);
    if (!ach) {
      return sendError(res, 'Achievement not found', null, 404);
    }

    if (ach.imagePublicId) {
      await deleteFromCloudinary(ach.imagePublicId);
    }

    await Achievements.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Achievement deleted successfully');
  } catch (error) {
    next(error);
  }
};
