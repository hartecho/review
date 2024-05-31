import Blog from '~/server/models/Blogs/Blog.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await authMiddleware(event);
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    const blog = new Blog(body);
    await blog.save();
    await disconnectDB();
    return blog;
  } catch (error) {
    console.error('Error in POST /api/blogs:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
