import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: false
  },
  picture: {
    type: String,
    required: false,
    default: 'SSLogo.webp'
  },
  operatingStates: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.every(state => /^[A-Z]{2}$/.test(state)); // Ensure each state is a 2-letter abbreviation
      },
      message: props => `${props.value} is not a valid state abbreviation!`
    }
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
    ignoreBadAddress: Boolean
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  website: {
    type: String
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    enum: [
      'CAB', 'CKE', 'LMEQ', 'LOG', 'SPEQ', 'WARE', 'ACOUST', 'AGG', 'BRK', 'CMP', 'DRY', 'ELE', 'ENG', 'FRM', 'GLAS', 'HRDW', 'INSUL', 'LUM', 'MTL', 'PAIN', 'PLMB', 'RFMS', 'SAF', 'SAND', 'STON', 'SURF', 'TOOLS', 'WALL', 'WNDW', 'HVACS', 'PLST', 'ENV', 'LGT', 'CABL', 'FURN', 'CONV', 'GRDN', 'MAR', 'SEAL', 'TAP', 'TEMP', 'WTRS', 'CNTN', 'CNVY', 'FAB'
    ],
    required: true
  }],
  isClaimed: {
    type: Boolean,
    default: false
  },
  isPro: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
