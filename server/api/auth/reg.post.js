import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/Users/User.js'; // Ensure your User model path is correct

export default defineEventHandler(async (event) => {
    await connectDB(); // Connect to the database

    try {
        const body = await readBody(event);
        const { email, password, name, reCaptchaToken } = body;

        // Step 1: Verify reCAPTCHA token with Google API using $fetch
        if (!reCaptchaToken) {
            throw createError({ statusCode: 400, message: 'No reCAPTCHA token provided' });
        }

        const config = useRuntimeConfig();
        console.log("Secret key: " + config.private.RECAPTCHA_SECRET_KEY);
        const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${config.private.RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`;
        const recaptchaResponse = await $fetch(recaptchaVerificationUrl, {
            method: 'POST',
        });

        if (!recaptchaResponse.success) {
            throw createError({ statusCode: 400, message: 'Invalid reCAPTCHA' });
        }

        // Step 2: Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError({ statusCode: 409, message: 'User already exists' });
        }

        // Step 3: Create a new user
        const user = new User({
            email,
            password,
            name,
        });

        await user.save(); // Save the user, password will be hashed automatically by the model

        await disconnectDB(); // Disconnect from the database

        return { message: 'User created successfully' };
    } catch (error) {
        console.error('Error in POST /api/auth/createUser:', error);
        await disconnectDB();

        if (error.statusCode === 409) {
            throw createError({ statusCode: 409, message: 'User already exists' });
        }

        throw createError({ statusCode: 500, message: 'An unexpected error occurred. Please try again later.' });
    }
});
