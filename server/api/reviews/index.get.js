import Review from '~/server/models/Users/Review.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  const contractorId = query.contractor;
  const userId = query.user;

  try {
    let reviews;
    if (contractorId && userId) {
      // Fetch a single review for the given contractor and user
      reviews = await Review.findOne({ contractor: contractorId, reviewer: userId }).populate('reviewer', 'name').populate('contractor', 'company');
    } else if (contractorId) {
      // Fetch all reviews for the given contractor
      reviews = await Review.find({ contractor: contractorId }).populate('reviewer', 'name');
    } else if (userId) {
      // Fetch all reviews for the given user
      reviews = await Review.find({ reviewer: userId }).populate('contractor', 'company');
    } else {
      // Fetch all reviews
      reviews = await Review.find({});
    }
    await disconnectDB(); // Disconnect from DB after fetching data
    return reviews;
  } catch (error) {
    console.error(error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error });
  }
});
