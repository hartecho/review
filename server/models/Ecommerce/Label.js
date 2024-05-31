import mongoose from 'mongoose';

// Define the Address schema
const AddressSchema = new mongoose.Schema({
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
});

// Define the Package Description schema
const PackageDescriptionSchema = new mongoose.Schema({
  weightUOM: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensionsUOM: { type: String, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  girth: Number,
  mailClass: { type: String, required: true },
  rateIndicator: String,
  processingCategory: String,
  destinationEntryFacilityType: String,
  packageOptions: Object,
  customerReference: Array,
  extraServices: Array,
  mailingDate: Date,
  carrierRelease: Boolean,
  carrierPickup: Boolean,
  physicalSignatureRequired: Boolean
});

// Define the Label Schema
const LabelSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true }, // Indexed for faster queries
  toAddress: AddressSchema,
  fromAddress: AddressSchema,
  packageDescription: PackageDescriptionSchema
});

// Create the Label model
const Label = mongoose.model('Label', LabelSchema);

export default Label;
