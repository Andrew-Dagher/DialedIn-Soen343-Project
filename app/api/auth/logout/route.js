import { handleLogout } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    return await handleLogout(request, {
      returnTo: '/',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/logout?error=true', request.url));
  }
}