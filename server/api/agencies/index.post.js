import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body._id = null;
    const agency = new Agency(body);
    await agency.save();
    const savedAgency = await Agency.findOne({company: agency.company});
    await disconnectDB();
    return savedAgency;
  } catch (error) {
    console.error('Error in POST /api/agencies:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
