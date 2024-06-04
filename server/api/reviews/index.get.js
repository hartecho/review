import Review from '~/server/models/Users/Review.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  const _id = query._id;

  try {
    if (_id) {
      const review = await Review.findById(_id);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return review;
    } else {
      const allReviews = await Review.find({});
      await disconnectDB();
      return allReviews;
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
