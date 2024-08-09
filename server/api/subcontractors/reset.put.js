import Subcontractor from '~/server/models/Users/Subcontractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    // Update all subcontractors' ratings to 0
    await Subcontractor.updateMany({}, { $set: { ratings: 0 } });
    await disconnectDB();
    return { message: "All subcontractor ratings have been reset to zero." };
  } catch (error) {
    console.error('Error in POST /api/subcontractors/reset-ratings:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
