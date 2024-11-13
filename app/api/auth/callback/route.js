import { handleCallback } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    return await handleCallback(request);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/login?error=true', request.url));
  }
}