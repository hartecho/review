import Contractor from '~/server/models/Contractor.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const contractorId = event.context.params.id;

        const contractor = await Contractor.findById(contractorId);
        if (!contractor) {
            throw createError({ statusCode: 404, message: 'Contractor not found' });
        }

        Object.assign(contractor, body);
        await contractor.save();
        await disconnectDB();
        return contractor;
    } catch (error) {
        console.error('Error in PUT /api/contractors/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
