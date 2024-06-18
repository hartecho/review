import Claim from '~/server/models/Users/Claim.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  // await authMiddleware(event);
  await connectDB(); // Ensure DB connection
  try {
    const claimId = event.context.params.id;

    const claim = await Claim.findByIdAndDelete(claimId);
    if (!claim) {
      throw createError({ statusCode: 404, message: 'Claim not found' });
    }

    await disconnectDB();
    return { message: 'Claim successfully deleted', claim };
  } catch (error) {
    console.error('Error in DELETE /api/claims/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
