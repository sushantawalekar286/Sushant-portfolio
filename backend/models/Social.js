import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      unique: true,
      trim: true // e.g. "GitHub", "LinkedIn", "LeetCode"
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: '',
      trim: true // e.g., "FaGithub", "FaLinkedin"
    },
    isFooter: {
      type: Boolean,
      default: true
    },
    isHero: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Social = mongoose.model('Social', socialSchema);
export default Social;
