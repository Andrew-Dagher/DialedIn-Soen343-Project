'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { DollarSign, Package, Gift, Loader2 } from 'lucide-react';

export default function ViewMyPointsPage() {
  const { user, isLoading } = useUser();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPoints();
      fetchCoupons();
    }
  }, [user]);

  const fetchPoints = async () => {
    try {
      const response = await fetch(`/api/get-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.sub }),
      });
      if (response.ok) {
        const data = await response.json();
        setPointsBalance(data.pointsBalance);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`/api/get-coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.sub }),
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-violet-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
        <Gift className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-medium text-gray-100">My Points & Coupons</h2>
      </div>

      <div className="mt-8 space-y-8">
        {/* Points Balance */}
        <div className="flex items-center gap-4">
          <DollarSign className="h-10 w-10 text-green-400" />
          <div>
            <p className="text-sm text-gray-400">Points Balance</p>
            <p className="text-2xl font-bold text-gray-100">{pointsBalance}</p>
          </div>
        </div>

        {/* Coupons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-100">My Coupons</h3>
          {coupons.length === 0 ? (
            <p className="text-gray-400">You have not purchased any coupons yet.</p>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between rounded-lg border-2 border-gray-800 bg-transparent p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-violet-400" />
                    <p className="text-gray-100">
                      {coupon.discountPercentage}% Discount Coupon
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Coupon ID: <span className="font-bold text-gray-100">{coupon.couponID}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {coupon.isUsed ? 'Used' : 'Available'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

