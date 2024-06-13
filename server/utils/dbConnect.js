import mongoose from 'mongoose';
const config = useRuntimeConfig();

const MONGODB_URI = config.DB_URI; // Ensure your DB URI is correctly set in your environment

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Database already connected');
    return;
  }
  
  return mongoose.connect(MONGODB_URI
  ,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected'))
  // .catch((err) => console.error('Database connection error:', err));
};
