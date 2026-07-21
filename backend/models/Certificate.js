import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: String,
      required: true,
      trim: true // e.g. "January 2024"
    },
    credentialLink: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: '/images/default-certificate.jpg',
      trim: true
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    verifyButton: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
