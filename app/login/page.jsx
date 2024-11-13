'use client';

import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      window.location.href = '/api/auth/login';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-violet-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to DailedIn
          </h1>
          
          <p className="text-gray-400 mb-8">
            Please sign in to continue to your account
          </p>

          <button
            onClick={handleLogin}
            className="w-full px-6 py-3 rounded-xl bg-violet-500 
                     text-white font-medium hover:bg-violet-600 
                     transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In with Auth0
          </button>
        </div>
      </div>
    </div>
  );
}