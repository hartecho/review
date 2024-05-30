import mongoose from 'mongoose';

const disconnectMongoose = async () => {
  await mongoose.disconnect();
  console.log('Disconnected from Mongoose');
};

// Call the function if the script is run directly
disconnectMongoose().catch(err => {
  console.error('Failed to disconnect:', err);
});