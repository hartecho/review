import Claim from '~/server/models/Users/Claim.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  // await authMiddleware(event);
  await connectDB(); // Ensure DB connection
  const body = getQuery(event);
  const _id = body._id;

  console.log("In claims");

  try {
    if (_id) {
      const claim = await Claim.findById(_id);
      await disconnectDB();
      return claim;
    } else {
      const allClaims = await Claim.find({});
      console.log("In all claims: " + allClaims);
      await disconnectDB();
      return allClaims;
    }
  } catch (error) {
    console.error('Error in GET /api/claims:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
