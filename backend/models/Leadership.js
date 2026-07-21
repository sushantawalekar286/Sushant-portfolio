import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
