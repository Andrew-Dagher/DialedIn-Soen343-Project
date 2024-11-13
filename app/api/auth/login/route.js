import { handleLogin } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    return await handleLogin(request, {
      returnTo: '/',
      authorizationParams: {
        prompt: 'login',
        screen_hint: 'login',
        login_hint: email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    return await handleLogin(request, {
      returnTo: '/',
      authorizationParams: {
        prompt: 'login',
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=true', request.url));
  }
}