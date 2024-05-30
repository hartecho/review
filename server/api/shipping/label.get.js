import Label from '~/server/models/Label.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import authMiddleware from '~/server/middleware/auth.js';

export default defineEventHandler(async (event) => {
  await authMiddleware(event); // Ensure the request is authenticated
  await connectDB(); // Ensure DB connection
  try {
    const labels = await Label.find({});
    await disconnectDB();
    return labels;
  } catch (error) {
    console.error('Error in GET /api/shipping/label.get.js:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
