import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true // e.g. "Software Engineer", "Full Stack Developer"
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    publicId: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    },
    downloads: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
