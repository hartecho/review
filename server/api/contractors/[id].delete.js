import Contractor from '~/server/models/Users/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const contractorId = event.context.params.id;

    const contractor = await Contractor.findByIdAndDelete(contractorId);
    if (!contractor) {
      throw createError({ statusCode: 404, message: 'Contractor not found' });
    }

    // Optionally return the deleted contractor's information for confirmation
    await disconnectDB();
    return { message: 'Contractor successfully deleted', contractor };
  } catch (error) {
    console.error('Error in DELETE /api/contractors/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
