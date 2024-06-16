import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String,
    required: false,
    default: 'SSLogo.png'
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
  ratings: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    enum: [
      'GEN', 'FLR', 'CTP', 'CAB', 'CON', 'STL', 'FRM', 'ROF', 'SID', 'WND',
      'LND', 'DRY', 'PNT', 'INS', 'CLG', 'HVAC', 'PLM', 'ELEC', 'EXC', 'DEM',
      'GRD', 'FPS', 'SEC', 'AV', 'ELEV', 'SOL', 'UTIL', 'FIN', 'CAR', 'TLE',
      'GLS', 'SPC', 'REN', 'HIS', 'REM', 'WTR', 'ENV', 'ASB', 'LEAD', 'ENVC',
      'DB', 'ARC', 'ENG', 'LOG', 'WARE', 'IEQ', 'SPEQ', 'CKE', 'LMEQ', 'FAC',
      'CUR', 'OTH'
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

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
