import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Tag, Gift, Loader2, ArrowRight, Star, DollarSign } from 'lucide-react';

const PurchaseCoupons = ({ showPointsBalance = true }) => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.sub,
          pointsToRedeem
        })
      });

      if (response.ok) {
        alert('Coupon purchased successfully!');
        setSelectedDiscount(null);
        fetchPoints();
        window.location.reload();
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

  if (isLoading) return null;

  const purchaseOptions = [
    {
      discount: 5,
      points: 50,
      description: 'Basic discount for small purchases',
      popular: false
    },
    {
      discount: 10,
      points: 100,
      description: 'Most popular choice for medium purchases',
      popular: true
    },
    {
      discount: 20,
      points: 200,
      description: 'Best value for large purchases',
      popular: false
    }
  ];

  return (
    <div className="space-y-4">
      {/* Points Section */}
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full border-2 border-green-400 bg-violet-400/10 p-3">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Points</p>
              <p className="text-2xl font-medium text-gray-100">{pointsBalance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Options Section */}
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-violet-400 sm:h-5 sm:w-5" />
            <h3 className="text-base font-medium text-gray-100 sm:text-lg">Available Coupons</h3>
          </div>
          <div className="self-start rounded-full border-2 border-violet-400 bg-violet-400/10 px-3 py-1 sm:self-auto sm:px-4 sm:py-1.5">
            <span className="text-xs text-violet-400 sm:text-sm">Exchange Points for Discounts</span>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3">
          {purchaseOptions.map(option => {
            const isAffordable = pointsBalance >= option.points;
            const isSelected = selectedDiscount === option.discount;

            return (
              <button
                key={option.discount}
                onClick={() => setSelectedDiscount(option.discount)}
                disabled={!isAffordable || isPurchasing}
                className={`group relative flex flex-col rounded-lg border-2 p-3 transition-all sm:p-4 ${
                  isAffordable
                    ? isSelected
                      ? 'border-violet-400 bg-violet-400/10'
                      : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                    : 'cursor-not-allowed border-gray-800 bg-gray-800/50 opacity-60'
                }`}>
                {option.popular && (
                  <div className="absolute -top-2 left-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs text-white sm:-top-3 sm:left-4 sm:py-1">
                    <Star className="h-3 w-3" />
                    <span className="text-xs">Popular</span>
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-violet-400 sm:h-5 sm:w-5" />
                    <span className="text-lg font-semibold text-gray-100 sm:text-xl">{option.discount}% OFF</span>
                  </div>
                  <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-400">
                    {option.points} points
                  </span>
                </div>

                <p className="text-xs text-gray-500 sm:text-sm">{option.description}</p>

                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-violet-400 sm:text-sm">
                    <span>Click to purchase</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Purchase Action */}
        {selectedDiscount && (
          <div className="flex flex-col items-start gap-3 rounded-lg border-2 border-violet-400 bg-violet-400/10 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Gift className="h-4 w-4 text-violet-400 sm:h-5 sm:w-5" />
              <span className="text-xs font-medium text-violet-400 sm:text-sm">
                {selectedDiscount}% Discount Coupon for {selectedDiscount * 10} points
              </span>
            </div>
            <button
              onClick={handlePurchaseCoupon}
              disabled={isPurchasing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-3 py-2 font-medium text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:justify-start sm:px-4">
              {isPurchasing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-xs sm:text-sm">Confirm Purchase</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseCoupons;
