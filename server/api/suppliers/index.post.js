import Supplier from '~/server/models/Users/Supplier.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body._id = null;
    const supplier = new Supplier(body);
    await supplier.save();
    const savedSupplier = await Supplier.findOne({company: supplier.company});
    await disconnectDB();
    return savedSupplier;
  } catch (error) {
    console.error('Error in POST /api/suppliers:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
