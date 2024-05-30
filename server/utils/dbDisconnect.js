import mongoose from 'mongoose';

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 2) {
    console.log('Database connecting. Cant disconnect.');
    return;
  }

  setTimeout(function() {
    return mongoose.disconnect()
  .then(() => console.log('Database disconnected'))
  .catch((err) => console.error('Database disconnection error:', err));
  }, 15000); // The delay in milliseconds (3000ms = 3 seconds)

  
};
