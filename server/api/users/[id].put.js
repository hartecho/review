import User from '~/server/models/Users/User.js';
import Contractor from '~/server/models/Users/Contractor.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const userId = event.context.params.id;
  const body = await readBody(event);

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true }).populate('contractor', 'company');
    
    if (updatedUser.contractor) {
      const contractorId = updatedUser.contractor._id;
      await Contractor.findByIdAndUpdate(contractorId, { isClaimed: true });
    }
    
    await disconnectDB(); // Disconnect from DB after updating data
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
