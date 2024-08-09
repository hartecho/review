import Agency from '~/server/models/Users/Agency.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const agencyId = event.context.params.id;

        const agency = await Agency.findById(agencyId);
        if (!agency) {
            throw createError({ statusCode: 404, message: 'Agency not found' });
        }

        Object.assign(agency, body);
        await agency.save();
        await disconnectDB();
        return agency;
    } catch (error) {
        console.error('Error in PUT /api/agencies/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
