import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URI; // Ensure your DB URI is correctly set in your environment

export const connectUserDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Database already connected');
    return;
  }
  
  return mongoose.connect(`mongodb+srv://thomas:8ylQuAYP3fZCtQ2b@cluster0.vfkpn24.mongodb.net/HARTECHO`
  ,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected'))
  // .catch((err) => console.error('Database connection error:', err));
};
