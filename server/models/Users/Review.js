import mongoose from 'mongoose';

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
        enum: [
          // Construction and Engineering
          'GEN', 'ARC', 'ENG', 'DB', 'CON', 'EXC', 'GRD', 'STL', 'FRM', 'DRY', 'FLR',
          'ROF', 'SID', 'INS', 'WTR', 'REN', 'REM', 'DEM', 'FIN', 'FAC', 'HIS', 
          'LND', 'CAB', 'CTP', 'CUR', 'TLE', 'GLS', 'ELEC', 'HVAC', 'PLM', 'AV',
          'SEC', 'ELEV', 'UTIL', 'SOL', 'SPC', 'SPEQ', 'CLG', 'IEQ', 'LOG', 'WND',
          'WARE',
          // Environmental and Safety
          'ENV', 'ENVC', 'ASB', 'LEAD', 'FPS', 'SAF',
          // Specialized Services
          'CKE', 'LMEQ', 'DTCM', 'IEQ',
          // Material Suppliers
          'ACOUST', 'AGG', 'BRK', 'CAB', 'CMP', 'CNTN', 'CONV', 'CNVY', 'DRY', 'ELE',
          'ENG', 'ENV', 'FAB', 'FRM', 'FURN', 'GLAS', 'GRDN', 'HRDW', 'HVACS', 
          'INSUL', 'LGT', 'LUM', 'MAR', 'MTL', 'PAIN', 'PLMB', 'PLST', 'RFMS', 
          'SAND', 'SEAL', 'STON', 'SURF', 'TAP', 'TEMP', 'TOOLS', 'WTRS',
          // Other
          'OTH',
        ],
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
