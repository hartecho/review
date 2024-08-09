import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const agencyId = event.context.params.id;

    const agency = await Agency.findByIdAndDelete(agencyId);
    if (!agency) {
      throw createError({ statusCode: 404, message: 'Agency not found' });
    }

    // Optionally return the deleted agency's information for confirmation
    await disconnectDB();
    return { message: 'Agency successfully deleted', agency };
  } catch (error) {
    console.error('Error in DELETE /api/agencies/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
