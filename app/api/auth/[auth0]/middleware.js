import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/profile/:path*',
    '/payment/:path*',
    '/request-delivery/:path*',
    '/quotations/:path*'
  ],
};