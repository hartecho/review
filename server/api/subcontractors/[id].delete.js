import Subcontractor from '~/server/models/Users/Subcontractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const subcontractorId = event.context.params.id;

    const subcontractor = await Subcontractor.findByIdAndDelete(subcontractorId);
    if (!subcontractor) {
      throw createError({ statusCode: 404, message: 'Subcontractor not found' });
    }

    // Optionally return the deleted subcontractor's information for confirmation
    await disconnectDB();
    return { message: 'Subcontractor successfully deleted', subcontractor };
  } catch (error) {
    console.error('Error in DELETE /api/subcontractors/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
