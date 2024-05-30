// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log("Token in middleware: ", token);
  
  // if (event.req.url === '/api/users/login' || event.req.url === '/' || event.req.url.startsWith('/public')) {
  //   return;
  // }

  if (!event.req.url.startsWith('/api/review')) {
    return;
  }
  
  console.log('Auth middleware called for URL:', event.req.url);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication token not found' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  
  // Decode token for debugging
  const decodedToken = jwt.decode(token);
  console.log("Decoded token: ", decodedToken);

  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        reject(createError({ statusCode: 403, statusMessage: 'Token is not valid' }));
      } else {
        event.context.user = decoded; // Store user info in the context
        resolve();
      }
    });
  });
});
