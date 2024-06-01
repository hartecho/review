import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { connectUserDB } from '~/server/utils/dbUserConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/Users/User.js'; // Ensure the User model path is correct

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default defineEventHandler(async (event) => {
    await connectUserDB(); // Ensure the database connection is established

    try {
        const body = await readBody(event);
        const token = body.token;

        if (!token) {
            throw createError({
                statusCode: 400,
                statusMessage: "No token or invalid token provided"
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid token payload"
            });
        }

        console.log(payload);

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                email: payload.email,
                name: payload.name,
                googleId: payload.sub,
                profilePicture: payload.picture, // Ensure this field exists in your schema
                // Add any other fields that might be relevant
            });
            await user.save();
        } else {
            // Update user info in case any details have changed
            user.googleId = payload.sub;
            user.name = payload.name;
            user.profilePicture = payload.picture; // Ensure this field exists in your schema
            await user.save();
        }

        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email, name: user.name, picture: user.profilePicture },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token: jwtToken, email: user.email, name: user.name, picture: user.profilePicture };
    } catch (error) {
        console.error('Error in POST /api/google-login:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    } finally {
        await disconnectDB();
    }
});
