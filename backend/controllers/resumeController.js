import Resume from '../models/Resume.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Resumes retrieved successfully', resumes);
  } catch (error) {
    next(error);
  }
};

export const getActiveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) {
      return sendError(res, 'No active resume found', null, 404);
    }
    return sendSuccess(res, 'Active resume retrieved successfully', resume);
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  const { label } = req.body;

  try {
    if (!req.file) {
      return sendError(res, 'Please provide a PDF or Word document file to upload.', null, 400);
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/resumes');

    // Check if it is the first resume; if so, make it active
    const resumeCount = await Resume.countDocuments();
    const shouldBeActive = resumeCount === 0;

    const resume = await Resume.create({
      label: label || 'Primary Resume',
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      isActive: shouldBeActive
    });

    return sendSuccess(res, 'Resume uploaded successfully', resume, 201);
  } catch (error) {
    next(error);
  }
};

export const setActiveResume = async (req, res, next) => {
  const { id } = req.params;

  try {
    const resume = await Resume.findById(id);
    if (!resume) {
      return sendError(res, 'Resume record not found', null, 404);
    }

    // Set all other resumes to inactive
    await Resume.updateMany({}, { isActive: false });

    // Set target resume to active
    resume.isActive = true;
    await resume.save();

    return sendSuccess(res, 'Active resume updated successfully', resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume record not found', null, 404);
    }

    // Delete file from Cloudinary
    if (resume.publicId) {
      await deleteFromCloudinary(resume.publicId);
    }

    await Resume.findByIdAndDelete(req.params.id);

    // If deleted resume was active, set another one active if possible
    if (resume.isActive) {
      const another = await Resume.findOne();
      if (another) {
        another.isActive = true;
        await another.save();
      }
    }

    return sendSuccess(res, 'Resume deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Increment Resume Downloads
export const downloadResume = async (req, res, next) => {
  const { id } = req.params;
  try {
    const resume = await Resume.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
    if (!resume) {
      return sendError(res, 'Resume record not found', null, 404);
    }
    return sendSuccess(res, 'Resume download count incremented successfully', { downloads: resume.downloads });
  } catch (error) {
    next(error);
  }
};
