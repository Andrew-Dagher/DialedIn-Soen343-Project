import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { 
  Mail, Calendar, 
  BadgeCheck, AtSign,
  Clock, Box, User,
  Package, MessageSquare,
  Gift
} from 'lucide-react';

import PointsCouponDashboard from './PointsCouponDashboard';
import PurchaseCoupons from './PurchaseCoupons';
import Reviews from '../components/Reviews';

const ProfileDashboard = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-violet-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="rounded-xl border-2 border-gray-800 bg-transparent p-8 text-center">
          <User className="mx-auto h-12 w-12 text-violet-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-100">Please log in</h2>
          <p className="mt-2 text-gray-500">Authentication required to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-screen-2xl">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Points and Coupons Section - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 space-y-6">
            <PurchaseCoupons showPointsBalance={false} />
              <PointsCouponDashboard />
              
            </div>

            {/* Reviews Section - Full width on mobile, 1/3 on desktop */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Reviews />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;