import Contractor from '~/server/models/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  const _id = query._id;

  try {
    if (_id) {
      const contractor = await Contractor.findById(_id);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return contractor;
    } else {
      const allContractors = await Contractor.find({});
      await disconnectDB();
      return allContractors;
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
