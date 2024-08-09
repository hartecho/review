import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  const _id = query._id;

  try {
    if (_id) {
      const agency = await Agency.findById(_id);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return agency;
    } else {
      const allAgencies = await Agency.find({});
      await disconnectDB();
      return allAgencies;
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
