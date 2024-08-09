import Subcontractor from '~/server/models/Users/Subcontractor.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const subcontractorId = event.context.params.id;

        const subcontractor = await Subcontractor.findById(subcontractorId);
        if (!subcontractor) {
            throw createError({ statusCode: 404, message: 'Subcontractor not found' });
        }

        Object.assign(subcontractor, body);
        await subcontractor.save();
        await disconnectDB();
        return subcontractor;
    } catch (error) {
        console.error('Error in PUT /api/subcontractors/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
