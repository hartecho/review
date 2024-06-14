import Review from '~/server/models/Users/Review';
import Contractor from '~/server/models/Users/Contractor.js';
import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const reviewId = event.context.params.id;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Optionally return the deleted review's information for confirmation
    await disconnectDB();
    return { message: 'Review successfully deleted', review };
  } catch (error) {
    console.error('Error in DELETE /api/reviews/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
