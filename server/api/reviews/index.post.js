import Review from '~/server/models/Users/Review.js';
import Contractor from '~/server/models/Users/Contractor.js';
import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import mongoose from 'mongoose';

async function updateContractorRating(contractorId) {
  console.log("updating contractor rating");
  const reviews = await Review.find({ contractor: contractorId });

  if (reviews.length === 0) {
    console.log("Found no reviews for ", contractorId);
    await Contractor.findByIdAndUpdate(contractorId, { ratings: 0 });
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
  console.log("average rating: " + averageRating);

  await Contractor.findByIdAndUpdate(contractorId, { ratings: parseFloat(averageRating) });
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const body = await readBody(event);
    const { contractor, rating, comment, tags, reviewer, reviewId, businessRep, reply } = body;
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
        contractor: contractor,
        reviewer: reviewer
      });

      if (existingReview) {
        console.log("Existing review found, adding update");
        existingReview.updates.push({
          rating: rating,
          comment: comment
        });
        await existingReview.save();
      } else {
        console.log("Creating new review");
        const newReview = new Review({
          contractor: contractor,
          reviewer: reviewer,
          rating,
          comment,
          tags,
        });

        await newReview.save();
      }

      // Update the contractor's rating
      await updateContractorRating(contractor);
    }

    await disconnectDB(); // Disconnect from DB after success
    return { message: 'Review added successfully' };
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message || 'Server Error' });
  }
});
