import Subcontractor from '~/server/models/Users/Subcontractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const result = await Subcontractor.deleteMany({});
    await disconnectDB();
    return { message: 'All subcontractors deleted successfully', result };
  } catch (error) {
    console.error('Error in DELETE /api/subcontractors/deleteAll:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
