import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/question/:id',
  '/tags',
  '/tags/:id',
  '/profile/:id',
  '/community',
  '/jobs',
]);

export default clerkMiddleware((auth, request) => {
  const { redirectToSignIn, userId } = auth();
  if (!isPublicRoute(request) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip internal Next.js paths, static assets, and specific files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes, except '/api/webhooks' and '/api/chatgpt'
    '/(api(?!/webhooks|/chatgpt)|trpc)(.*)',
  ],
};
