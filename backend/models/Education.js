import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institute: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true // e.g. "2020 - 2024"
    },
    cgpa: {
      type: String,
      default: '',
      trim: true
    },
    relevantCoursework: [
      {
        type: String,
        trim: true
      }
    ],
    achievements: [
      {
        type: String,
        trim: true
      }
    ],
    location: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
