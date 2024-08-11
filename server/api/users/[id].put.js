import User from '~/server/models/Users/User.js';
import Contractor from '~/server/models/Users/Contractor.js';
import Subcontractor from '~/server/models/Users/Subcontractor.js';
import Supplier from '~/server/models/Users/Supplier.js';
import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB();
  const userId = event.context.params.id;
  const body = await readBody(event);

  if (!userId) {
    console.error('Error: Missing userId in the request');
    throw createError({ statusCode: 400, message: 'Bad Request: Missing userId' });
  }

  if (!Array.isArray(body.businesses) || !Array.isArray(body.businessTypes)) {
    console.error('Error: Invalid business data in the request body');
    throw createError({ statusCode: 400, message: 'Bad Request: Invalid business data' });
  }

  try {
    // Remove duplicates from businesses and businessTypes arrays
    const uniqueBusinesses = [...new Set(body.businesses)];
    const uniqueBusinessTypes = uniqueBusinesses.map((id, index) => {
      return body.businessTypes[body.businesses.indexOf(id)];
    });

    // Update user with unique business assignments
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: body.name,
        email: body.email,
        password: body.password,
        profilePicture: body.profilePicture,
        bio: body.bio,
        businesses: uniqueBusinesses,
        businessTypes: uniqueBusinessTypes,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`Error: User with id ${userId} not found`);
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    // Update all businesses to reflect changes
    await Promise.all(
      updatedUser.businesses.map(async (businessId, index) => {
        const type = updatedUser.businessTypes[index];
        let Model;
        switch (type) {
          case 'Contractor':
            Model = Contractor;
            break;
          case 'Subcontractor':
            Model = Subcontractor;
            break;
          case 'Supplier':
            Model = Supplier;
            break;
          case 'Agency':
            Model = Agency;
            break;
          default:
            return;
        }
        await Model.findByIdAndUpdate(businessId, { isClaimed: true });
      })
    );

    await disconnectDB();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
