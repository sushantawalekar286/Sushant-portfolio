const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one visitor record exists
visitorSchema.statics.getVisitorCount = async function() {
  let visitor = await this.findOne();
  if (!visitor) {
    visitor = new this({ count: 0 });
    await visitor.save();
  }
  return visitor;
};

visitorSchema.statics.incrementCount = async function() {
  const visitor = await this.getVisitorCount();
  visitor.count += 1;
  visitor.lastUpdated = new Date();
  await visitor.save();
  return visitor.count;
};

module.exports = mongoose.model('Visitor', visitorSchema); 