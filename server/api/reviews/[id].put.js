import Review from '~/server/models/Review.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const reviewId = event.context.params.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            throw createError({ statusCode: 404, message: 'Review not found' });
        }

        Object.assign(review, body);
        await review.save();
        await disconnectDB();
        return review;
    } catch (error) {
        console.error('Error in PUT /api/reviews/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
