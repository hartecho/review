import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  businesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'businessTypes',
    },
  ],
  businessTypes: [
    {
      type: String,
      enum: ['Contractor', 'Subcontractor', 'Supplier', 'Agency'],
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook to ensure no duplicates in the businesses array
userSchema.pre('save', function (next) {
  const uniqueBusinesses = [...new Set(this.businesses.map(String))];
  if (uniqueBusinesses.length !== this.businesses.length) {
    return next(new Error('Businesses array contains duplicates.'));
  }
  this.businesses = uniqueBusinesses;
  next();
});

// Method to compare given password with the hashed one in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Clear model cache
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model('User', userSchema);

export default User;
