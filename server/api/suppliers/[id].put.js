import Supplier from '~/server/models/Users/Supplier.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const supplierId = event.context.params.id;

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            throw createError({ statusCode: 404, message: 'Supplier not found' });
        }

        Object.assign(supplier, body);
        await supplier.save();
        await disconnectDB();
        return supplier;
    } catch (error) {
        console.error('Error in PUT /api/suppliers/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
