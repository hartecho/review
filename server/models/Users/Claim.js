import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessAddress: {
    type: String,
    required: true
  },
  businessPhone: {
    type: String,
    required: true
  },
  businessWebsite: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  yearsInBusiness: {
    type: Number,
    required: true
  },
  additionalComments: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
