import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    introduction: {
      type: String,
      default: 'I am a passionate software developer dedicated to building impactful digital solutions.'
    },
    profileImage: {
      type: String,
      default: '/images/default-avatar.jpg'
    },
    profileImagePublicId: {
      type: String,
      default: ''
    },
    careerObjective: {
      type: String,
      default: 'Seeking to leverage my full stack engineering skills to develop high-performance software.'
    },
    personalInfo: {
      email: { type: String, default: 'sushant@example.com' },
      phone: { type: String, default: '' },
      location: { type: String, default: 'Maharashtra, India' },
      languages: { type: [String], default: ['English', 'Hindi', 'Marathi'] }
    },
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      dsaProblemsSolved: { type: Number, default: 0 },
      internshipsCount: { type: Number, default: 0 },
      hackathonsWon: { type: Number, default: 0 },
      awardsCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const About = mongoose.model('About', aboutSchema);
export default About;
