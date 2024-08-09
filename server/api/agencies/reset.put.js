import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    // Update all agencies' ratings to 0
    await Agency.updateMany({}, { $set: { ratings: 0 } });
    await disconnectDB();
    return { message: "All agency ratings have been reset to zero." };
  } catch (error) {
    console.error('Error in POST /api/agencies/reset-ratings:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
