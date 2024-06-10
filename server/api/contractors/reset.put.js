import Contractor from '~/server/models/Users/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    // Update all contractors' ratings to 0
    await Contractor.updateMany({}, { $set: { ratings: 0 } });
    await disconnectDB();
    return { message: "All contractor ratings have been reset to zero." };
  } catch (error) {
    console.error('Error in POST /api/contractors/reset-ratings:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
