import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true // e.g. "Jun 2023 - Present"
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    technologies: [
      {
        type: String,
        trim: true
      }
    ],
    certificate: {
      type: String,
      default: '',
      trim: true
    },
    link: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
