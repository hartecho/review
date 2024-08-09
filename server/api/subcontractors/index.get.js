import Subcontractor from '~/server/models/Users/Subcontractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  const _id = query._id;

  try {
    if (_id) {
      const subcontractor = await Subcontractor.findById(_id);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return subcontractor;
    } else {
      const allSubcontractors = await Subcontractor.find({});
      await disconnectDB();
      return allSubcontractors;
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
