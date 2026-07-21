import Skill from '../models/Skill.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Get Skills (optional grouping)
export const getSkills = async (req, res, next) => {
  const { groupBy } = req.query;

  try {
    const skills = await Skill.find().sort({ displayOrder: 1, name: 1 });

    if (groupBy === 'category') {
      const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});
      return sendSuccess(res, 'Skills retrieved and grouped successfully', grouped);
    }

    return sendSuccess(res, 'Skills retrieved successfully', skills);
  } catch (error) {
    next(error);
  }
};

// Get single skill
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return sendError(res, 'Skill not found', null, 404);
    }
    return sendSuccess(res, 'Skill retrieved successfully', skill);
  } catch (error) {
    next(error);
  }
};

// Create a skill
export const createSkill = async (req, res, next) => {
  const { name, category, proficiency, experience, logo, displayOrder } = req.body;

  try {
    let logoUrl = logo || '';
    let logoPublicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/skills');
      logoUrl = uploadResult.secure_url;
      logoPublicId = uploadResult.public_id;
    }

    const newSkill = await Skill.create({
      name,
      category,
      proficiency: parseInt(proficiency || '80'),
      experience,
      logo: logoUrl,
      logoPublicId,
      displayOrder: parseInt(displayOrder || '0')
    });

    return sendSuccess(res, 'Skill created successfully', newSkill, 201);
  } catch (error) {
    next(error);
  }
};

// Update skill
export const updateSkill = async (req, res, next) => {
  const { id } = req.params;
  const { name, category, proficiency, experience, logo, displayOrder } = req.body;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return sendError(res, 'Skill not found', null, 404);
    }

    if (req.file) {
      if (skill.logoPublicId) {
        await deleteFromCloudinary(skill.logoPublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/skills');
      skill.logo = uploadResult.secure_url;
      skill.logoPublicId = uploadResult.public_id;
    } else if (logo !== undefined) {
      skill.logo = logo;
    }

    if (name !== undefined) skill.name = name;
    if (category !== undefined) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = parseInt(proficiency);
    if (experience !== undefined) skill.experience = experience;
    if (displayOrder !== undefined) skill.displayOrder = parseInt(displayOrder);

    await skill.save();
    return sendSuccess(res, 'Skill updated successfully', skill);
  } catch (error) {
    next(error);
  }
};

// Delete skill
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return sendError(res, 'Skill not found', null, 404);
    }

    if (skill.logoPublicId) {
      await deleteFromCloudinary(skill.logoPublicId);
    }

    await Skill.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Skill deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Reorder Skills (bulk Write displayOrder values)
export const reorderSkills = async (req, res, next) => {
  const { orders } = req.body; // array: [ { id: String, displayOrder: Number } ]
  try {
    if (!Array.isArray(orders)) {
      return sendError(res, 'Orders list must be an array', null, 400);
    }

    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { displayOrder: parseInt(item.displayOrder) } }
      }
    }));

    await Skill.bulkWrite(bulkOps);
    return sendSuccess(res, 'Skills reordered successfully');
  } catch (error) {
    next(error);
  }
};
