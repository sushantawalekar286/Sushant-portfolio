import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      default: 'Home'
    },
    views: {
      type: Number,
      default: 0
    },
    ipList: [
      {
        type: String
      }
    ],
    dateString: {
      type: String,
      required: true // YYYY-MM-DD format for easy daily analytics mapping
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per page per day
analyticsSchema.index({ pageName: 1, dateString: 1 }, { unique: true });

analyticsSchema.statics.logView = async function (pageName, ip) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Find or create daily record for pageName
    const analytics = await this.findOneAndUpdate(
      { pageName, dateString: todayStr },
      {
        $inc: { views: 1 },
        $addToSet: { ipList: ip || 'unknown' }
      },
      { new: true, upsert: true }
    );
    
    return analytics;
  } catch (error) {
    console.error('Error logging page view in model:', error);
    throw error;
  }
};

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
