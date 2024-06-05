import User from '~/server/models/Users/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const userId = event.context.params.id;
  const body = await readBody(event);

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true }).populate('contractor', 'company');
    await disconnectDB(); // Disconnect from DB after updating data
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
