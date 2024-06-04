import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  address: {
    streetAddress: { type: String, required: true },
    secondaryAddress: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    ZIPCode: { type: String, required: true },
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
    required: true
  },
  email: {
    type: String,
    required: true
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
  isPro: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
