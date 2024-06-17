// server/api/review.js
import Review from '~/server/models/Users/Review';
import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const query = getQuery(event);
    const contractorId = query.contractor;
    const userId = query.user;

    const randomUser = await User.findOne({}); // Without this it says the User model isn't registered...

    let reviews;
    if (contractorId && userId) {
      reviews = await Review.findOne({ contractor: contractorId, reviewer: userId })
        .populate('reviewer', 'name')
        .populate('contractor', 'company');
    } else if (contractorId) {
      reviews = await Review.find({ contractor: contractorId }).populate('reviewer', 'name');
    } else if (userId) {
      reviews = await Review.find({ reviewer: userId }).populate('contractor', 'company');
    } else {
      reviews = await Review.find({});
    }

    await disconnectDB(); // Disconnect from DB after fetching data
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
