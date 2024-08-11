import Contractor from '~/server/models/Users/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  let _id;

  if (query) {
    _id = query._id;
  }

  // console.log("QUERY FOR CONTRACTOR GET API" + query);

  try {
    if (_id) {
      // console.log("FOUND _ID IN API");
      const contractor = await Contractor.findById(_id);
      // console.log("SINGLE CONTRACTOR FOUND: " + contractor);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return contractor;
    } else {
      // console.log("FETCHING ALL CONTRACTORS");
      const allContractors = await Contractor.find({});
      // console.log("CONTRACTORS: " + allContractors);
      await disconnectDB();
      return allContractors;
    }
  } catch (error) {
    console.log("WAS ERROR FETCHING CONTRACTORS: " + error.message);
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
