import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { DollarSign, Package, Gift, Clock, CheckCircle2, XCircle } from 'lucide-react';

const PointsCouponDashboard = () => {
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
        body: JSON.stringify({ userId: user.sub })
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
        body: JSON.stringify({ userId: user.sub })
      });
      if (response.ok) {
        const data = await response.json();
        // Sort coupons by creation date in descending order (newest first)
        const sortedCoupons = data.coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCoupons(sortedCoupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  if (isLoading) return null;

  // Calculate available coupons count
  const availableCouponsCount = coupons.filter(coupon => !coupon.isUsed).length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Coupons Grid */}
      <div className="rounded-xl border-2 border-gray-800 bg-transparent p-6">
        <div className="mb-6 flex items-center gap-2 border-b-2 border-gray-800 pb-2">
          <Gift className="h-5 w-5 text-violet-400" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-100">My Coupons</h3>
          </div>
          <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-400">
            {availableCouponsCount} available
          </span>
        </div>

        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800 p-8 text-center">
            <Gift className="h-12 w-12 text-gray-600" />
            <p className="mt-2 text-gray-400">No coupons available</p>
            <p className="mt-1 text-sm text-gray-500">Purchase coupons using your points</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {coupons.map(coupon => (
              <div
                key={coupon._id}
                className="relative rounded-xl border-2 border-gray-800 bg-transparent p-4 transition-all hover:border-gray-700">
                <div className="flex items-center justify-between">
                  {/* Left section - Discount */}
                  <div className="flex items-center gap-4">
                    <Package className="h-5 w-5 text-violet-400" />
                    <div>
                      <div className="text-sm text-gray-500">Discount</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-medium text-gray-100">{coupon.discountPercentage}%</span>
                        <span className="text-lg text-gray-500">OFF</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle section - Date & ID */}
                  <div className="hidden flex-col items-start gap-1 sm:flex">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(coupon.expiryDate || '2024-12-30').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-gray-500">#{coupon.couponID}</div>
                  </div>

                  {/* Right section - Status */}
                  <div
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 ${
                      coupon.isUsed
                        ? 'border-gray-800 bg-gray-800/50 text-gray-400'
                        : 'border-violet-400 bg-violet-400/10 text-violet-400'
                    }`}>
                    {coupon.isUsed ? (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Used</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Available</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile date & ID */}
                <div className="mt-3 flex flex-col gap-1 sm:hidden">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{new Date(coupon.expiryDate || '2024-12-30').toLocaleDateString()}</span>
                  </div>
                  <div className="font-mono text-xs text-gray-500">#{coupon.couponID}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsCouponDashboard;
