import Contractor from '~/server/models/Users/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const result = await Contractor.deleteMany({});
    await disconnectDB();
    return { message: 'All contractors deleted successfully', result };
  } catch (error) {
    console.error('Error in DELETE /api/contractors/deleteAll:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
