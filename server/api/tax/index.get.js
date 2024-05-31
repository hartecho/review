import Transaction from '~/server/models/Ecommerce/Transaction.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import authMiddleware from '~/server/middleware/auth.js';

export default defineEventHandler(async (event) => {
  await authMiddleware(event); // Ensure the request is authenticated
  await connectDB(); // Ensure DB connection
  try {
    const transactions = await Transaction.find({});
    await disconnectDB();
    return transactions;
  } catch (error) {
    console.error('Error in GET /api/transactions/get.js:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
