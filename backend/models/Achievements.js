import mongoose from 'mongoose';

const achievementsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    event: {
      type: String,
      default: '',
      trim: true // e.g. "Google Kickstart", "Smart India Hackathon"
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Award', 'Hackathon', 'Coding Profile', 'Leadership', 'Other'],
      default: 'Other'
    },
    date: {
      type: String,
      required: true,
      trim: true // e.g. "March 2024" or "2024"
    },
    image: {
      type: String,
      default: '',
      trim: true
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    ranking: {
      type: String,
      default: '',
      trim: true // e.g. "AIR 45", "Rank 1"
    },
    link: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

const Achievements = mongoose.model('Achievements', achievementsSchema);
export default Achievements;
