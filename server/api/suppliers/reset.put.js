import Supplier from '~/server/models/Users/Supplier.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    // Update all suppliers' ratings to 0
    await Supplier.updateMany({}, { $set: { ratings: 0 } });
    await disconnectDB();
    return { message: "All supplier ratings have been reset to zero." };
  } catch (error) {
    console.error('Error in POST /api/suppliers/reset-ratings:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
