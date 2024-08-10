import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: false,
  },
  picture: {
    type: String,
    required: false,
    default: 'SSLogo.webp',
  },
  operatingStates: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.every(state => /^[A-Z]{2}$/.test(state)); // Ensure each state is a 2-letter abbreviation
      },
      message: props => `${props.value} is not a valid state abbreviation!`,
    },
  },
  address: {
    streetAddress: { type: String },
    secondaryAddress: String,
    city: { type: String },
    state: { type: String },
    ZIPCode: { type: String },
    ZIPPlus4: String,
    urbanization: String,
    firstName: String,
    lastName: String,
    firm: String,
    phone: String,
    email: String,
    ignoreBadAddress: Boolean,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  website: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
