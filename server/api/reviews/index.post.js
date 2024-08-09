import Review from '~/server/models/Users/Review.js';
import Contractor from '~/server/models/Users/Contractor.js';
import Subcontractor from '~/server/models/Users/Subcontractor.js';
import Supplier from '~/server/models/Users/Supplier.js';
import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import mongoose from 'mongoose';

async function updateBusinessRating(businessId, businessType) {
  console.log(`Updating rating for ${businessType}`);

  // Map business types to their respective models
  const businessModels = {
    Contractor,
    Subcontractor,
    Supplier,
    Agency,
  };

  // Get the appropriate model for the business type
  const BusinessModel = businessModels[businessType];

  if (!BusinessModel) {
    console.error('Invalid business type:', businessType);
    return;
  }

  // Find reviews for the business
  const reviews = await Review.find({ businessId: businessId, businessType: businessType });

  if (reviews.length === 0) {
    console.log(`Found no reviews for ${businessId}`);
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
  // console.log(`Average rating for ${businessType}: ${averageRating}`);

  // Update the business rating
  await BusinessModel.findByIdAndUpdate(businessId, { ratings: parseFloat(averageRating) });
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const body = await readBody(event);
    const { businessId, businessType, rating, comment, tags, reviewer, reviewerName, reviewId, businessRep, reply } = body;
    console.log("Request Body:", body);

    if (reply) {
      console.log("Adding business reply");
      const review = await Review.findById(reviewId);
      if (review) {
        console.log("BusinessRep: ", businessRep);
        review.businessReplies.push({ businessRep: businessRep, comment: reply });
        await review.save();
      }
    } else {
      let existingReview = await Review.findOne({
        businessId: businessId,
        businessType,
        reviewer,
      });

      console.log("ExistingReview: ", existingReview);

      if (existingReview) {
        console.log("Existing review found, adding update");
        existingReview.updates.push({
          rating,
          comment,
        });
        existingReview.tags = tags;
        await existingReview.save();
      } else {
        console.log("Creating new review");
        const newReview = new Review({
          businessId: businessId,
          businessType,
          reviewer,
          reviewerName,
          rating,
          comment,
          tags,
        });

        await newReview.save();
      }

      // Update the business's rating
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
