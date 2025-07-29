const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  date: {
    type: String,
    default: new Date().getFullYear().toString(),
    trim: true
  },
  image: {
    type: String,
    default: '/images/default-award.jpg',
    trim: true
  },
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
achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema); 