import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/issuer(.*)', '/wallet(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true' && process.env.NODE_ENV === 'development';
  const hasDevCookie = req.cookies.has('dev_role');

  if (isProtectedRoute(req)) {
    if (isDevMode && hasDevCookie) {
      return; // Bypass Clerk protection
    }
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
