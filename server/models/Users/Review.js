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
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
          'GEN',
          'FLR',
          'CTP',
          'CAB',
          'CON',
          'STL',
          'FRM',
          'ROF',
          'SID',
          'WND',
          'LND',
          'DRY',
          'PNT',
          'INS',
          'CLG',
          'HVAC',
          'PLM',
          'ELEC',
          'EXC',
          'DEM',
          'GRD',
          'FPS',
          'SEC',
          'AV',
          'ELEV',
          'SOL',
          'UTIL',
          'FIN',
          'CAR',
          'TLE',
          'GLS',
          'SPC',
          'REN',
          'HIS',
          'REM',
          'WTR',
          'ENV',
          'ASB',
          'LEAD',
          'ENVC',
          'DB',
          'ARC',
          'ENG',
          'LOG',
          'WARE',
          'IEQ',
          'SPEQ',
          'CKE',
          'LMEQ',
          'FAC',
          'CUR',
          'OTH',
        ],
        required: true,
      },
    ],
    updates: [reviewUpdateSchema],
    businessReplies: [businessReplySchema],
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
