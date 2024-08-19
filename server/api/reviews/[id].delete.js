import Review from '~/server/models/Users/Review';
import Contractor from '~/server/models/Users/Contractor.js';
import Subcontractor from '~/server/models/Users/Subcontractor.js';
import Supplier from '~/server/models/Users/Supplier.js';
import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function updateBusinessRating(businessId, businessType) {
  // console.log(`Updating rating for ${businessType}`);

  const businessModels = {
    Contractor,
    Subcontractor,
    Supplier,
    Agency,
  };

  const BusinessModel = businessModels[businessType];

  if (!BusinessModel) {
    console.error('Invalid business type:', businessType);
    return;
  }

  const reviews = await Review.find({ businessId: businessId, businessType: businessType });

  if (reviews.length === 0) {
    // console.log(`Found no reviews for ${businessId}`);
    await BusinessModel.findByIdAndUpdate(businessId, { ratings: 0 });
    return;
  }

  let totalRating = 0;
  let reviewCount = 0;

  reviews.forEach(review => {
    if (review.updates && review.updates.length > 0) {
      const latestUpdate = review.updates.reduce((latest, update) => {
        return update.date > latest.date ? update : latest;
      }, review.updates[0]);
      totalRating += latestUpdate.rating;
    } else {
      totalRating += review.rating;
    }
    reviewCount++;
  });

  const averageRating = (totalRating / reviewCount).toFixed(1);

  await BusinessModel.findByIdAndUpdate(businessId, { ratings: parseFloat(averageRating), reviewCount: reviewCount-- });
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const reviewId = event.context.params.id;

    // Delete a specific review by ID
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Update the rating for the specific business
    if (review.businessId && review.businessType) {
      await updateBusinessRating(review.businessId, review.businessType);
    }

    await disconnectDB();
    return {
      message: 'Review successfully deleted and rating updated',
    };
  } catch (error) {
    console.error('Error in DELETE /api/reviews/[id]:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});