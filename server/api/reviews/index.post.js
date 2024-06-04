import Review from '~/server/models/Review.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body._id = null;
    const review = new Review(body);
    await review.save();
    await disconnectDB();
    return review;
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
