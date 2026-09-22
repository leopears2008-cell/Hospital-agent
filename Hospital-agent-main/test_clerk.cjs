const { clerkMiddleware, requireAuth } = require('@clerk/express');
console.log(clerkMiddleware ? 'clerkMiddleware exists' : 'missing');
console.log(requireAuth ? 'requireAuth exists' : 'missing');
