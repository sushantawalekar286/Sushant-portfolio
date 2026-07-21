import mongoose from 'mongoose';

const otherSocialSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: '' }
});

const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Sushant Awalekar'
    },
    titles: {
      type: [String],
      default: ['Full Stack Developer', 'Software Engineer', 'Coding Enthusiast']
    },
    typingEffectSpeed: {
      type: Number,
      default: 100 // ms
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    githubLink: {
      type: String,
      default: 'https://github.com'
    },
    linkedinLink: {
      type: String,
      default: 'https://linkedin.com'
    },
    leetcodeLink: {
      type: String,
      default: 'https://leetcode.com'
    },
    otherSocials: [otherSocialSchema],
    mainText: {
      type: String,
      default: 'Building scalable web applications and solving complex algorithmic challenges.'
    },
    subtitle: {
      type: String,
      default: 'Welcome to my portfolio'
    },
    backgroundAnimation: {
      type: String,
      default: 'particles' // particles, network, mesh, gradient, none
    },
    scrollIndicator: {
      type: Boolean,
      default: true
    },
    animatedName: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;
