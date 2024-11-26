'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { DollarSign, Tag, Gift, Loader2 } from 'lucide-react';

export default function PurchaseCouponsPage() {
  const { user, isLoading } = useUser();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPoints();
    }
  }, [user]);

  const fetchPoints = async () => {
    try {
      const response = await fetch('/api/get-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handlePurchaseCoupon = async () => {
    const pointsToRedeem = selectedDiscount * 10;

    if (pointsBalance < pointsToRedeem) {
      alert('Insufficient points balance');
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch('/api/purchase-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.sub,
          pointsToRedeem,
        }),
      });

      if (response.ok) {
        alert('Coupon purchased successfully!');
        setSelectedDiscount(null); // Reset the selected coupon
        fetchPoints(); // Update points balance
      } else {
        alert('Failed to purchase coupon. Please try again.');
      }
    } catch (error) {
      console.error('Error purchasing coupon:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsPurchasing(false);
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
        <Tag className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-medium text-gray-100">Purchase Coupons</h2>
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

        {/* Purchase Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-100">Available Coupons</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[5, 10, 20].map((discountPercentage) => {
              const pointsRequired = discountPercentage * 10;

              return (
                <button
                  key={discountPercentage}
                  onClick={() => setSelectedDiscount(discountPercentage)}
                  disabled={isPurchasing || pointsBalance < pointsRequired}
                  className={`flex items-center justify-between rounded-lg border-2 p-4 transition-all ${
                    pointsBalance >= pointsRequired
                      ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                      : 'border-gray-800 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  }`}>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-violet-400" />
                    <p className="text-gray-100">
                      {discountPercentage}% Discount Coupon
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {pointsRequired} points
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Purchase Button */}
        {selectedDiscount && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePurchaseCoupon}
              disabled={isPurchasing}
              className="flex items-center gap-2 rounded-lg bg-violet-500 px-6 py-3 text-white hover:bg-violet-600 transition-all disabled:opacity-50 disabled:hover:bg-violet-500"
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Purchase {selectedDiscount}% Coupon
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
