import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const result = await Agency.deleteMany({});
    await disconnectDB();
    return { message: 'All agencies deleted successfully', result };
  } catch (error) {
    console.error('Error in DELETE /api/agencies/deleteAll:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
