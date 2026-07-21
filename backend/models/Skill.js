import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Frontend',
        'Backend',
        'Database',
        'Programming Languages',
        'DevOps',
        'Cloud',
        'Tools',
        'Soft Skills'
      ],
      trim: true
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    experience: {
      type: String,
      default: '1 year',
      trim: true
    },
    logo: {
      type: String,
      default: '',
      trim: true
    },
    logoPublicId: {
      type: String,
      default: ''
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
