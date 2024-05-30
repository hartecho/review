import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: {
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
  date: {
    type: Date,
    default: Date.now,
  }
});

const contractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
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
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  tags: [{
    type: String,
    enum: [
      'GEN', // General Contractors
      'FLR', // Flooring
      'CTP', // Countertops
      'CAB', // Cabinets
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
      'EXC', // Exterior Cladding Systems
      'CUR', // Curtain Wall Systems
      'OTH' // Other
    ],
    required: true,
  }],
}, {
  timestamps: true,
});

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
