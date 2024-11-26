'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
export default function LogoutPage() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8 text-violet-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Ready to Leave?
          </h1>
          
          <p className="text-gray-400 mb-8">
            You can always sign back in to access your account
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border-2 border-gray-800 
                       text-gray-300 font-medium hover:bg-gray-800/50 
                       transition-colors"
            >
              Cancel
            </button>
            
            <a href=" ">Signout</a>
          </div>
        </div>
      </div>
    </div>
  );
}