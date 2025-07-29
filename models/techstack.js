const mongoose = require('mongoose');

const techItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '/images/default-tech.svg',
    trim: true
  }
});

const techCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🛠️',
    trim: true
  },
  items: [techItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
techCategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TechCategory', techCategorySchema); 