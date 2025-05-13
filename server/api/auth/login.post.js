// Importing necessary utilities and models
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/Users/User.js'; // Make sure your User model path is correct

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await connectDB(); // Ensure the database connection is established
    console.log("Secret key: " + config.private.RECAPTCHA_SECRET_KEY);

    try {
        // Reading the request body
        const { email, password, reCaptchaToken } = await readBody(event);

        // Step 1: Verify reCAPTCHA token with Google's API using $fetch
        if (!reCaptchaToken) {
            throw createError({ statusCode: 400, message: 'No reCAPTCHA token provided' });
        }

        const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${config.private.RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`;
        const recaptchaResponse = await $fetch(recaptchaVerificationUrl, {
            method: 'POST'
        });

        if (!recaptchaResponse.success) {
            throw createError({ statusCode: 400, message: 'Invalid reCAPTCHA' });
        }

        // Step 2: Proceed with normal email/password login if reCAPTCHA is valid
        const user = await User.findOne({ email });

        // If no user is found, or the password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' });
        }

        // Creating a JWT for the user
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Returning the token to the client
        return { token, user };

    } catch (error) {
        console.error('Error in POST /api/login:', error);
        if (error.statusCode === 401) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' });
        }
        throw createError({ statusCode: 500, message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        // Ensure the database connection is closed after handling the request
        await disconnectDB();
    }
});
