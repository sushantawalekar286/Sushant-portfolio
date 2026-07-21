import Leadership from '../models/Leadership.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET ALL LEADERSHIP RECORDS
export const getLeadershipList = async (req, res, next) => {
  try {
    const list = await Leadership.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Leadership records retrieved successfully', list);
  } catch (error) {
    next(error);
  }
};

// CREATE NEW LEADERSHIP RECORD
export const createLeadership = async (req, res, next) => {
  const { organization, role, duration, description } = req.body;
  try {
    const item = await Leadership.create({
      organization,
      role,
      duration,
      description
    });
    return sendSuccess(res, 'Leadership record created successfully', item, 201);
  } catch (error) {
    next(error);
  }
};

// UPDATE EXISTING LEADERSHIP RECORD
export const updateLeadership = async (req, res, next) => {
  const { id } = req.params;
  const { organization, role, duration, description } = req.body;
  try {
    const item = await Leadership.findById(id);
    if (!item) {
      return sendError(res, 'Leadership record not found', null, 404);
    }

    if (organization !== undefined) item.organization = organization;
    if (role !== undefined) item.role = role;
    if (duration !== undefined) item.duration = duration;
    if (description !== undefined) item.description = description;

    await item.save();
    return sendSuccess(res, 'Leadership record updated successfully', item);
  } catch (error) {
    next(error);
  }
};

// DELETE LEADERSHIP RECORD
export const deleteLeadership = async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await Leadership.findById(id);
    if (!item) {
      return sendError(res, 'Leadership record not found', null, 404);
    }
    await Leadership.findByIdAndDelete(id);
    return sendSuccess(res, 'Leadership record deleted successfully');
  } catch (error) {
    next(error);
  }
};
