import Review from '~/server/models/Users/Review';
import Contractor from '~/server/models/Users/Contractor.js';
import Subcontractor from '~/server/models/Users/Subcontractor.js';
import Supplier from '~/server/models/Users/Supplier.js';
import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function resetAllBusinessRatings() {
  const businessModels = [Contractor, Subcontractor, Supplier, Agency];

  for (const BusinessModel of businessModels) {
    const businesses = await BusinessModel.find({});
    for (const business of businesses) {
      await BusinessModel.findByIdAndUpdate(business._id, { ratings: 0, reviewCount: 0 });
    }
  }
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Delete all reviews
    await Review.deleteMany({});

    // Reset ratings for all businesses
    await resetAllBusinessRatings();

    await disconnectDB();
    return {
      message: 'All reviews successfully deleted and ratings reset for all businesses',
    };
  } catch (error) {
    console.error('Error in DELETE /api/reviews/deleteAll:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
