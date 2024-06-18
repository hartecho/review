import Claim from '~/server/models/Users/Claim.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  // await authMiddleware(event);
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    const claim = new Claim(body);
    await claim.save();
    await disconnectDB();
    return claim;
  } catch (error) {
    console.error('Error in POST /api/claims:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
