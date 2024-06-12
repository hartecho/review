import Blog from '~/server/models/Blogs/Blog.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    // await authMiddleware(event);
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const blogId = event.context.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            throw createError({ statusCode: 404, message: 'Blog not found' });
        }

        Object.assign(blog, body);
        await blog.save();
        await disconnectDB();
        return blog;
    } catch (error) {
        console.error('Error in PUT /api/blogs/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
