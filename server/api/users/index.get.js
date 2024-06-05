import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const users = await User.find().populate('contractor', 'company');
    await disconnectDB(); // Disconnect from DB after fetching data
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
