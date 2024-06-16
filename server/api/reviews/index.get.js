// server/api/review.js
import Review from '~/server/models/Users/Review';
import Contractor from '~/server/models/Users/Contractor.js';
import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const query = getQuery(event);
    const contractorId = query.contractor;
    const userId = query.user;

    console.log("userId: " + userId);

    let reviews;
    if (contractorId && userId) {
      console.log("Was both contractorId and userId");
      // Fetch a single review for the given contractor and user
      reviews = await Review.findOne({ contractor: contractorId, reviewer: userId })
        .populate('reviewer', 'name')
        .populate('contractor', 'company');
    } else if (contractorId) {
      // Fetch all reviews for the given contractor
      console.log("Was just contractorId");
      reviews = await Review.find({ contractor: contractorId }).populate('reviewer', 'name');
    } else if (userId) {
      // Fetch all reviews for the given user
      console.log("Was just userId");
      reviews = await Review.find({ reviewer: userId }).populate('contractor', 'company');
    } else {
      // Fetch all reviews
      console.log("Was neither contractorId or userId");
      reviews = await Review.find({});
    }

    await disconnectDB(); // Disconnect from DB after fetching data
    console.log("Successful when userId: " + userId);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    console.log("Failure when userId: " + userId);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
