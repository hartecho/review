import Supplier from '~/server/models/Users/Supplier.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const result = await Supplier.deleteMany({});
    await disconnectDB();
    return { message: 'All suppliers deleted successfully', result };
  } catch (error) {
    console.error('Error in DELETE /api/suppliers/deleteAll:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
