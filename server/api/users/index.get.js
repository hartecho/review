import User from '~/server/models/Users/User.js';
import Contractor from '~/server/models/Users/Contractor.js';
import Subcontractor from '~/server/models/Users/Subcontractor.js';
import Supplier from '~/server/models/Users/Supplier.js';
import Agency from '~/server/models/Users/Agency.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Fetch users without populating
    const users = await User.find();

    // Manually populate businesses based on type
    const populatedUsers = await Promise.all(
      users.map(async (user) => {
        const populatedBusinesses = await Promise.all(
          user.businesses.map(async (businessId, index) => {
            const businessType = user.businessTypes[index];
            let Model;
            switch (businessType) {
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
                throw new Error(`Unknown business type: ${businessType}`);
            }
            return await Model.findById(businessId, 'company');
          })
        );

        // Return user object with populated businesses
        return {
          ...user.toObject(),
          businesses: populatedBusinesses,
        };
      })
    );

    await disconnectDB(); // Disconnect from DB after fetching data
    return populatedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
