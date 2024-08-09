import Subcontractor from '~/server/models/Users/Subcontractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body._id = null;
    const subcontractor = new Subcontractor(body);
    await subcontractor.save();
    const savedSubcontractor = await Subcontractor.findOne({company: subcontractor.company});
    await disconnectDB();
    return savedSubcontractor;
  } catch (error) {
    console.error('Error in POST /api/subcontractors:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
