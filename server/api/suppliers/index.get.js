import Supplier from '~/server/models/Users/Supplier.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const query = getQuery(event);
  let _id;

  if (query) {
    _id = query._id;
  }

  try {
    if (_id) {
      const supplier = await Supplier.findById(_id);
      await disconnectDB(); // Disconnect from DB for static file generation to close after build success
      return supplier;
    } else {
      const allSuppliers = await Supplier.find({});
      await disconnectDB();
      return allSuppliers;
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
