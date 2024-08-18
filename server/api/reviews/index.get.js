// server/api/review.js
import Review from '~/server/models/Users/Review';
import User from '~/server/models/Users/User.js';
import Contractor from '~/server/models/Users/Contractor';
import Subcontractor from '~/server/models/Users/Subcontractor';
import Supplier from '~/server/models/Users/Supplier';
import Agency from '~/server/models/Users/Agency';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const query = getQuery(event);
    const contractorId = query.contractorId;
    const subcontractorId = query.subcontractorId;
    const supplierId = query.supplierId;
    const agencyId = query.agencyId;
    const userId = query.user;

    const randomUser = await User.findOne({}); // Without this, it says the User model isn't registered...

    const businessTypes = {
      contractor: 'Contractor',
      subcontractor: 'Subcontractor',
      supplier: 'Supplier',
      agency: 'Agency',
    };

    // console.log("contractorId?: " + contractorId);

    let reviews;
    if (userId && contractorId) {
      reviews = await Review.findOne({
        businessId: contractorId,
        businessType: businessTypes.contractor,
        reviewer: userId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Contractor, select: 'company' });
    } else if (subcontractorId && userId) {
      reviews = await Review.findOne({
        businessId: subcontractorId,
        businessType: businessTypes.subcontractor,
        reviewer: userId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Subcontractor, select: 'company' });
    } else if (supplierId && userId) {
      reviews = await Review.findOne({
        businessId: supplierId,
        businessType: businessTypes.supplier,
        reviewer: userId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Supplier, select: 'company' });
    } else if (agencyId && userId) {
      reviews = await Review.findOne({
        businessId: agencyId,
        businessType: businessTypes.agency,
        reviewer: userId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Agency, select: 'company' });
        
    } else if (contractorId) {
      // console.log("Has contractorId: " + contractorId);
      reviews = await Review.find({
        businessId: contractorId,
        businessType: businessTypes.contractor,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Contractor, select: 'company' });
        // console.log("reviews: " + reviews);
    } else if (subcontractorId) {
      reviews = await Review.find({
        businessId: subcontractorId,
        businessType: businessTypes.subcontractor,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Supplier, select: 'company' });
    } else if (supplierId) {
      reviews = await Review.find({
        businessId: supplierId,
        businessType: businessTypes.supplier,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Subcontractor, select: 'company' });
    } 
    else if (agencyId) {
      reviews = await Review.find({
        businessId: agencyId,
        businessType: businessTypes.agency,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'businessId', model: Agency, select: 'company' });
    } 
    else if (userId) {
      reviews = await Review.find({ reviewer: userId }).populate('reviewer', 'name');
      // Dynamically populate based on businessType
      reviews = await Promise.all(
        reviews.map(async (review) => {
          const businessModel = {
            Contractor,
            Subcontractor,
            Supplier,
            Agency,
          }[review.businessType];
          if (businessModel) {
            return review.populate({ path: 'businessId', model: businessModel, select: 'company' });
          }
          return review;
        })
      );
    } else { 
      // console.log("Returning ALL Reviews");
      // console.log("query: " + JSON.stringify(query));
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
