// server/api/users.post.js
import { connectUserDB } from '~/server/utils/dbUserConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/Users/User.js'; // Ensure your User model path is correct
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
    await connectUserDB(); // Connect to the database

    try {
        const { password, email } = await readBody(event);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError({ statusCode: 409, message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            password,
            email
        });

        await user.save(); // Save the user, password will be hashed automatically by the model

        await disconnectDB(); // Disconnect from the database

        return { message: 'User created successfully' };
    } catch (error) {
        console.error('Error in POST /api/users:', error);
        await disconnectDB();
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
