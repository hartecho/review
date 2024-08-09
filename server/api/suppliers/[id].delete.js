import Supplier from '~/server/models/Users/Supplier.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const supplierId = event.context.params.id;

    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier) {
      throw createError({ statusCode: 404, message: 'Supplier not found' });
    }

    // Optionally return the deleted supplier's information for confirmation
    await disconnectDB();
    return { message: 'Supplier successfully deleted', supplier };
  } catch (error) {
    console.error('Error in DELETE /api/suppliers/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
