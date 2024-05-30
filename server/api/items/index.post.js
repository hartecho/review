import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await authMiddleware(event);
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    const item = new Item(body);
    await item.save();
    await disconnectDB();
    return item;
  } catch (error) {
    console.error('Error in POST /api/items:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
