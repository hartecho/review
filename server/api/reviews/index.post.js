import Review from '~/server/models/Users/Review.js';
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
    await BusinessModel.findByIdAndUpdate(businessId, { ratings: 0, reviewCount: 0 });
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

  await BusinessModel.findByIdAndUpdate(businessId, { 
    ratings: parseFloat(averageRating), 
    reviewCount: reviewCount 
  });
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const body = await readBody(event);
    const { businessId, businessName, businessType, rating, comment, tags, reviewer, reviewerName, reviewId, businessRep, reply } = body;

    if (!businessId || !businessName || !businessType || !rating || !comment || !reviewer || !reviewerName) {
      throw createError({ statusCode: 400, message: 'All required fields must be provided.' });
    }

    if (reply) {
      const review = await Review.findById(reviewId);
      if (review) {
        review.businessReplies.push({ businessRep: businessRep, comment: reply });
        await review.save();
      }
    } else {
      let existingReview = await Review.findOne({ businessId, businessType, reviewer });

      if (existingReview) {
        existingReview.updates.push({ rating, comment });
        existingReview.tags = tags;
        await existingReview.save();
      } else {
        const newReview = new Review({
          businessId,
          businessName,
          businessType,
          reviewer,
          reviewerName,
          rating,
          comment,
          tags,
        });

        await newReview.save();
      }

      await updateBusinessRating(businessId, businessType);
    }

    await disconnectDB(); // Disconnect from DB after success
    return { message: 'Review added successfully' };
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message || 'Server Error' });
  }
});
