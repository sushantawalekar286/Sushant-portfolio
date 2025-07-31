const mongoose = require('mongoose');

const extracurricularSchema = new mongoose.Schema({
  title: {
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
    required: true,
    trim: true,
    enum: ['College Clubs', 'Events & Competitions', 'Tech Communities', 'Leadership', 'Other']
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/images/default-activity.jpg',
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: 'Participant'
  },
  duration: {
    type: String,
    trim: true,
    default: 'Ongoing'
  },
  technologies: {
    type: [String],
    default: []
  },
  achievements: {
    type: [String],
    default: []
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
extracurricularSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Extracurricular', extracurricularSchema); 