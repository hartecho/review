import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Review Schema
const reviewSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    enum: [
      'GEN', // General Contractors
      'FLR', // Flooring
      'CTP', // Countertops
      'CAB', // Cabinets
      // Add more tags as needed...
      'CON', // Concrete and Masonry
      'STL', // Steel and Metal Fabrication
      'FRM', // Framing
      'ROF', // Roofing
      'SID', // Siding
      'WND', // Windows and Doors
      'LND', // Landscaping and Hardscaping
      'DRY', // Drywall and Plaster
      'PNT', // Painting and Finishing
      'INS', // Insulation
      'CLG', // Ceiling Systems
      'HVAC', // HVAC
      'PLM', // Plumbing
      'ELEC', // Electrical
      'EXC', // Excavation
      'DEM', // Demolition
      'GRD', // Grading and Paving
      'FPS', // Fire Protection and Sprinkler Systems
      'SEC', // Security Systems
      'AV', // Audio-Visual Installations
      'ELEV', // Elevator and Escalator Installation
      'SOL', // Solar Energy and Green Building Solutions
      'UTIL', // Utility Contractors
      'FIN', // Finishing Contractors
      'CAR', // Carpentry and Woodwork
      'TLE', // Tile and Stone Installation
      'GLS', // Glass and Glazing
      'SPC', // Specialty Coatings and Sealants
      'REN', // Renovation and Restoration
      'HIS', // Historic Restoration
      'REM', // Remodeling
      'WTR', // Waterproofing and Mold Remediation
      'ENV', // Environmental Contractors
      'ASB', // Asbestos Abatement
      'LEAD', // Lead Paint Removal
      'ENVC', // Environmental Cleanup and Remediation
      'DB', // Design and Build Contractors
      'ARC', // Architectural Services
      'ENG', // Engineering Services
      'LOG', // Logistics and Material Handling Contractors
      'WARE', // Warehouse Setup
      'IEQ', // Industrial Equipment Installation
      'SPEQ', // Specialty Equipment Contractors
      'CKE', // Commercial Kitchen Equipment
      'LMEQ', // Laboratory and Medical Equipment
      'FAC', // Facade and Cladding Contractors
      'CUR', // Curtain Wall Systems
      'OTH'  // Other
    ],
    required: true
  }]
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String, // URL to the profile picture
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  reviews: [reviewSchema],
  companies: {
    type: [String],
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare given password with the hashed one in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
