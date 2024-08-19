import mongoose from 'mongoose';

// Combine both tag description arrays
const combinedTags = [
  // Construction and Engineering (from tagDescriptions)
  'ARC', 'ASB', 'AV', 'CAB', 'CAR', 'CKE', 'CLE', 'CLG', 'CTP', 'CON', 'CUR', 
  'DB', 'DEM', 'DRY', 'DTCM', 'ELEC', 'ELEV', 'ENG', 'ENV', 'ENVC', 'EXC', 'FAC', 
  'FIN', 'FLR', 'FPS', 'FRM', 'GLS', 'GRD', 'HVAC', 'HIS', 'IEQ', 'INS', 'LND', 
  'LEAD', 'LOG', 'LMEQ', 'PNT', 'PLM', 'REN', 'REM', 'ROF', 'SEC', 'SID', 'SOL', 
  'SPC', 'SPEQ', 'STL', 'TLE', 'UTIL', 'WARE', 'WND', 'WTR', 'OTH',

  // Material Suppliers (from supplierTagDescriptions)
  'ACOUST', 'AGG', 'BRK', 'CABL', 'CAB', 'CKE', 'CMP', 'CNTN', 'CONV', 'CNVY', 
  'DRY', 'ELE', 'ENG', 'ENV', 'FAB', 'FRM', 'FURN', 'GLAS', 'GRDN', 'HRDW', 
  'HVACS', 'INSUL', 'LGT', 'LMEQ', 'LOG', 'LUM', 'MAR', 'MTL', 'PAIN', 'PLMB', 
  'PLST', 'RFMS', 'SAF', 'SAND', 'SEAL', 'SPEQ', 'STON', 'SURF', 'TAP', 'TEMP', 
  'TOOLS', 'WARE', 'WALL', 'WNDW', 'WTRS',
];

const reviewUpdateSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const businessReplySchema = new mongoose.Schema({
  businessRep: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ['Contractor', 'Subcontractor', 'Supplier', 'Agency'],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        enum: combinedTags,
        required: true,
      },
    ],
    updates: [reviewUpdateSchema],
    businessReplies: [businessReplySchema],
    isPro: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
