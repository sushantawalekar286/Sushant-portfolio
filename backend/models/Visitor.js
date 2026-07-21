import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    uniqueIPs: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

// Statics to increment counts easily
visitorSchema.statics.trackVisitor = async function (ip) {
  try {
    let visitor = await this.findOne();
    if (!visitor) {
      visitor = new this({ count: 0, totalViews: 0, uniqueIPs: [] });
    }
    
    visitor.totalViews += 1;
    if (ip && !visitor.uniqueIPs.includes(ip)) {
      visitor.uniqueIPs.push(ip);
      visitor.count += 1;
    }
    
    await visitor.save();
    return visitor;
  } catch (error) {
    console.error('Error tracking visitor in model:', error);
    throw error;
  }
};

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
