import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    category: {
      type: String,
      default: 'Web Development',
      trim: true
    },
    link: {
      type: String,
      default: '#',
      trim: true
    },
    github: {
      type: String,
      default: '#',
      trim: true
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' }
      }
    ],
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planned'],
      default: 'Completed'
    },
    duration: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      trim: true,
      default: 'Developer'
    },
    achievements: [
      {
        type: String,
        trim: true
      }
    ],
    featured: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
