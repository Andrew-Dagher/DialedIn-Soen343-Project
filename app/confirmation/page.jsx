'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  Package,
  MapPin,
  Truck,
  CreditCard,
  Edit2,
  DollarSign,
  Tag,
} from 'lucide-react';

export default function ConfirmationPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [quotationPrice, setQuotationPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoupons, setUserCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [couponID, setCouponID] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("requestData");
    const requestId = localStorage.getItem("tempRequestID");

    if (savedData && requestId) {
      const details = JSON.parse(savedData);
      setDeliveryDetails({ ...details, requestId });
      fetchQuotationPrice(details);
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchUserCoupons();
    }
  }, [user]);

  const fetchQuotationPrice = async (details) => {
    try {
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: details.weight,
          dimensions: {
            length: details.length,
            width: details.width,
            height: details.height,
          },
          pickup: {
            address: details.pickupAddress,
            city: details.pickupCity,
            country: details.pickupCountry,
            zipcode: details.pickupZipcode,
            coordinates: details.pickupCoordinates,
          },
          dropoff: {
            address: details.dropoffAddress,
            city: details.dropoffCity,
            country: details.dropoffCountry,
            zipcode: details.dropoffZipcode,
            coordinates: details.dropoffCoordinates,
          },
          shippingMethod: details.shippingMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuotationPrice(data.data.estimatedCost);
        setDiscountedPrice(data.data.estimatedCost); // Initially set discounted price to the estimated cost
        localStorage.setItem("tempAmount", data.data.estimatedCost);
      }
    } catch (error) {
      console.error("Error fetching quotation price:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCoupons = async () => {
    if (!user?.sub) {
      console.error('User ID is not available');
      return;
    }

    try {
      const response = await fetch(`/api/get-coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.sub }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserCoupons(data.coupons);
      } else {
        console.error('Failed to fetch coupons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const applyCoupon = () => {
    let coupon = null;

    if (selectedCoupon) {
      coupon = userCoupons.find((c) => c.couponID === selectedCoupon && !c.isUsed);
    } else if (couponID) {
      coupon = userCoupons.find((c) => c.couponID === couponID && !c.isUsed);
    }

    if (coupon) {
      const discountAmount = quotationPrice * (coupon.discountPercentage / 100);
      const newPrice = quotationPrice - discountAmount;
      setDiscountedPrice(newPrice);
      setDiscountApplied(true);
      alert('Coupon applied successfully!');
    } else {
      alert('Invalid or already used coupon. Please try again.');
    }
  };

  const handleEdit = () => {
    const updatedDetails = { ...deliveryDetails, quotationPrice };
    const encodedData = encodeURIComponent(JSON.stringify(updatedDetails));
    router.push(`/request-delivery?data=${encodedData}`);
  };

  const handleProceedToPayment = () => {
    let appliedCouponID = '';
  
    if (discountApplied) {
      // Get the applied coupon ID from either dropdown or input
      appliedCouponID = selectedCoupon || couponID;
      if (appliedCouponID) {
        const usedCoupon = userCoupons.find((c) => c.couponID === appliedCouponID);
        if (usedCoupon) {
          usedCoupon.isUsed = true; // Mark it as used in state (local state change)
        }
      }
    }
  
    // Store the necessary data in localStorage for payment
    localStorage.setItem("confirmedRequestData", JSON.stringify(deliveryDetails));
    localStorage.setItem("quotationPrice", JSON.stringify(discountedPrice));
    if (appliedCouponID) {
      localStorage.setItem("appliedCouponID", appliedCouponID); // Store coupon ID if applied
    } else {
      localStorage.removeItem("appliedCouponID"); // Remove if no coupon was applied
    }
  
    // Redirect to the payment page
    router.push('/payment');
  };
  
  

  if (isLoading || isUserLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-8">
        <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6 sm:gap-8">

        {/* Details Sections */}
        <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center text-center gap-2">
            <ClipboardList className="w-12 h-12 text-violet-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">
              Confirm Your Delivery
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl">
              Please review your delivery details below before proceeding to payment.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-900/50">
              <h3 className="text-lg font-medium text-gray-100 sm:col-span-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-violet-400" />
                Contact Information
              </h3>
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-base text-gray-100">{deliveryDetails?.contactName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-base text-gray-100">{deliveryDetails?.phoneNumber}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-base text-gray-100">{deliveryDetails?.email}</p>
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-gray-900/50">
              <h3 className="text-lg font-medium text-gray-100 col-span-full flex items-center gap-2">
                <Package className="w-5 h-5 text-violet-400" />
                Package Details
              </h3>
              <div>
                <p className="text-sm text-gray-400">Weight</p>
                <p className="text-base text-gray-100">{deliveryDetails?.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Length</p>
                <p className="text-base text-gray-100">{deliveryDetails?.length} cm</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Width</p>
                <p className="text-base text-gray-100">{deliveryDetails?.width} cm</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Height</p>
                <p className="text-base text-gray-100">{deliveryDetails?.height} cm</p>
              </div>
            </div>

            {/* Billing, Pickup, and Dropoff Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Billing Information */}
              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  Billing Address
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.billingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.billingCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Zipcode</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.billingZipcode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.billingCountry}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  Pickup Location
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.pickupCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Zipcode</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.pickupZipcode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.pickupCountry}</p>
                  </div>
                </div>
              </div>

              {/* Drop-off Location */}
              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-400" />
                  Drop-off Location
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.dropoffAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.dropoffCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Zipcode</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.dropoffZipcode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-base text-gray-100">{deliveryDetails?.dropoffCountry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-violet-400" />
                  Shipping Method
                </h3>
                <p className="text-base text-gray-100 capitalize">
                  {deliveryDetails?.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}
                </p>
              </div>

              {discountedPrice !== null && (
                <div className="p-4 rounded-lg bg-gray-900/50">
                  <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-violet-400" />
                    Total Cost
                  </h3>
                  <p className="text-xl font-semibold text-violet-400">
                    ${discountedPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="p-4 rounded-lg bg-gray-900/50 mt-6">
              <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-400" />
                Apply Coupon
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                  className="w-full rounded-lg p-2.5 border-2 border-gray-800 bg-gray-950 text-gray-100"
                >
                  <option value="">Select from My Coupons</option>
                  {userCoupons
                    .filter((coupon) => !coupon.isUsed)
                    .map((coupon) => (
                      <option key={coupon.couponID} value={coupon.couponID}>
                        {coupon.couponID} - {coupon.discountPercentage}% Discount
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  value={couponID}
                  onChange={(e) => setCouponID(e.target.value)}
                  placeholder="Enter Coupon ID"
                  className="w-full rounded-lg p-2.5 border-2 border-gray-800 bg-gray-950 text-gray-100"
                />
                <button
                  onClick={applyCoupon}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 
                        bg-violet-400 hover:bg-violet-600 text-white font-medium transition-colors"
                >
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 
                     bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit Details
            </button>
            <button
              onClick={handleProceedToPayment}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 
                     bg-violet-400 hover:bg-violet-600 text-white font-medium transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
