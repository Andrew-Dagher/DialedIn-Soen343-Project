'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  Truck,
  CreditCard,
  Edit2,
  Tag,
  ChevronDown,
  Activity,
  ArrowRight,
  Building
} from 'lucide-react';

const BillingInfoItem = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="text-sm text-gray-400">{label}:</span>
    <span className="text-right text-sm text-gray-100">{value}</span>
  </div>
);

export default function DashboardConfirmation() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [quotationPrice, setQuotationPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoupons, setUserCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('requestData');
    const requestId = localStorage.getItem('tempRequestID');

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

  const fetchQuotationPrice = async details => {
    try {
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: details.weight,
          dimensions: {
            length: details.length,
            width: details.width,
            height: details.height
          },
          pickup: {
            address: details.pickupAddress,
            city: details.pickupCity,
            country: details.pickupCountry,
            zipcode: details.pickupZipcode,
            coordinates: details.pickupCoordinates
          },
          dropoff: {
            address: details.dropoffAddress,
            city: details.dropoffCity,
            country: details.dropoffCountry,
            zipcode: details.dropoffZipcode,
            coordinates: details.dropoffCoordinates
          },
          shippingMethod: details.shippingMethod
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuotationPrice(data.data.estimatedCost);
        setDiscountedPrice(data.data.estimatedCost);
        localStorage.setItem('tempAmount', data.data.estimatedCost);
      }
    } catch (error) {
      console.error('Error fetching quotation price:', error);
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
        body: JSON.stringify({ userId: user.sub })
      });

      if (response.ok) {
        const data = await response.json();
        setUserCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleEdit = () => {
    const updatedDetails = { ...deliveryDetails, quotationPrice };
    const encodedData = encodeURIComponent(JSON.stringify(updatedDetails));
    router.push(`/request-delivery?data=${encodedData}`);
  };

  const handleProceedToPayment = () => {
    let appliedCouponID = selectedCoupon?.couponID || '';

    localStorage.setItem('confirmedRequestData', JSON.stringify(deliveryDetails));
    localStorage.setItem('quotationPrice', JSON.stringify(discountedPrice));
    if (appliedCouponID) {
      localStorage.setItem('appliedCouponID', appliedCouponID);
    } else {
      localStorage.removeItem('appliedCouponID');
    }

    router.push('/payment');
  };

  const applyCoupon = coupon => {
    if (coupon && !coupon.isUsed) {
      const discountAmount = quotationPrice * (coupon.discountPercentage / 100);
      const newPrice = quotationPrice - discountAmount;
      setDiscountedPrice(newPrice);
      setSelectedCoupon(coupon);
      setShowCouponDropdown(false);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-violet-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6">
      {/* Stats Header */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
        <StatCard
          title="Package Status"
          value="Pending"
          icon={<Activity className="h-5 w-5 text-violet-400" />}
          trend="+12%"
        />
        <StatCard title="Estimated Time" value="2-3 Days" icon={<Truck className="h-5 w-5 text-violet-400" />} />
        <StatCard title="Distance" value="1,205 km" icon={<MapPin className="h-5 w-5 text-violet-400" />} />
        <StatCard
          title="Total Cost"
          value={`$${discountedPrice?.toFixed(2)}`}
          icon={<CreditCard className="h-5 w-5 text-violet-400" />}
          highlight
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        {/* Left Column - Package & Route */}
        <div className="space-y-3 lg:col-span-8 lg:space-y-4">
          {/* Package Card */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-violet-400" />
                <h2 className="font-semibold text-gray-100">Package Details</h2>
              </div>
              <button
                onClick={handleEdit}
                className="rounded-lg p-2 text-yellow-500 transition-colors hover:bg-gray-800/50 hover:text-yellow-400">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
              <InfoCard label="Weight" value={`${deliveryDetails?.weight} kg`} />
              <InfoCard label="Length" value={`${deliveryDetails?.length} cm`} />
              <InfoCard label="Width" value={`${deliveryDetails?.width} cm`} />
              <InfoCard label="Height" value={`${deliveryDetails?.height} cm`} />
            </div>
          </div>

          {/* Route Card */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Truck className="h-5 w-5 text-violet-400" />
              <h2 className="font-semibold text-gray-100">Delivery Route</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <LocationCard
                title="Pickup Location"
                address={deliveryDetails?.pickupAddress}
                city={`${deliveryDetails?.pickupCity}, ${deliveryDetails?.pickupCountry}`}
                zipcode={deliveryDetails?.pickupZipcode}
              />
              <div className="hidden rotate-90 sm:block sm:rotate-0">
                <ArrowRight className="h-6 w-6 text-gray-600" />
              </div>
              <LocationCard
                title="Delivery Location"
                address={deliveryDetails?.dropoffAddress}
                city={`${deliveryDetails?.dropoffCity}, ${deliveryDetails?.dropoffCountry}`}
                zipcode={deliveryDetails?.dropoffZipcode}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3 lg:col-span-4 lg:space-y-4">
          {/* Billing Information */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Building className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-gray-100">Billing Information</h2>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              <BillingInfoItem label="Name" value={deliveryDetails?.contactName} />
              <BillingInfoItem label="Phone" value={deliveryDetails?.phoneNumber} />
              <BillingInfoItem label="Email" value={deliveryDetails?.email} className="sm:col-span-2 lg:col-span-1" />
              <div className="my-1.5 h-px bg-gray-800 sm:col-span-2 lg:col-span-1"></div>
              <BillingInfoItem
                label="Address"
                value={deliveryDetails?.billingAddress}
                className="sm:col-span-2 lg:col-span-1"
              />
              <BillingInfoItem
                label="City/Country"
                value={`${deliveryDetails?.billingCity}, ${deliveryDetails?.billingCountry}`}
                className="sm:col-span-2 lg:col-span-1"
              />
              <BillingInfoItem label="ZIP" value={deliveryDetails?.billingZipcode} />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4">
            <h2 className="mb-4 font-semibold text-gray-100">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Base Price</span>
                <span className="text-gray-100">${quotationPrice?.toFixed(2)}</span>
              </div>

              {/* Coupon Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCouponDropdown(!showCouponDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-gray-800 bg-gray-950 p-2 text-sm transition-colors hover:border-violet-400">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-violet-400" />
                    <span className="text-gray-300">
                      {selectedCoupon ? `${selectedCoupon.couponID} Applied` : 'Apply Coupon'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showCouponDropdown ? 'rotate-180 transform' : ''}`}
                  />
                </button>

                {showCouponDropdown && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border-2 border-gray-800 bg-gray-950 shadow-lg">
                    <div className="space-y-1 p-2">
                      {userCoupons
                        .filter(coupon => !coupon.isUsed)
                        .map(coupon => (
                          <button
                            key={coupon.couponID}
                            onClick={() => applyCoupon(coupon)}
                            className="flex w-full items-center justify-between rounded-md p-2 text-sm text-gray-100 hover:bg-gray-800">
                            <span>{coupon.couponID}</span>
                            <span className="text-violet-400">{coupon.discountPercentage}% OFF</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-green-400">-${(quotationPrice - discountedPrice).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-gray-800 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-100">Total Amount</span>
                  <span className="text-violet-400">${discountedPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedToPayment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-400 px-4 py-3 font-medium text-white transition-colors hover:bg-violet-500">
            <CreditCard className="h-5 w-5" />
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// Update StatCard component
const StatCard = ({ title, value, icon, trend, highlight }) => (
  <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-3 sm:p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs text-gray-400 sm:text-sm">{title}</span>
      {icon}
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-lg font-semibold sm:text-xl ${highlight ? 'text-green-400' : 'text-gray-100'}`}>
        {value}
      </span>
      {trend && <span className="text-xs text-green-400">{trend}</span>}
    </div>
  </div>
);

// Update InfoCard component
const InfoCard = ({ label, value }) => (
  <div className="rounded-lg bg-gray-950 p-2 sm:p-3">
    <p className="mb-1 text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-100 sm:text-base">{value}</p>
  </div>
);

// Update LocationCard component
const LocationCard = ({ title, address, city, zipcode }) => (
  <div className="flex-1 rounded-lg bg-gray-900 p-2 sm:p-3">
    <p className="mb-1 text-xs text-gray-400">{title}</p>
    <p className="text-sm font-medium text-gray-100 sm:text-base">{address}</p>
    <p className="text-xs text-gray-500 sm:text-sm">{city}</p>
    {zipcode && <p className="text-xs text-gray-500 sm:text-sm">ZIP: {zipcode}</p>}
  </div>
);
