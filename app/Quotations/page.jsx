'use client';

import React, { useState } from 'react';
import QuotationForm from '../../components/QuotationForm';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    // Pickup location with new structure
    pickupFormattedAddress: '',
    pickupAddress: '',
    pickupCity: '',
    pickupCountry: '',
    pickupZipcode: '',
    pickupCoordinates: null,
    // Dropoff location with new structure
    dropoffFormattedAddress: '',
    dropoffAddress: '',
    dropoffCity: '',
    dropoffCountry: '',
    dropoffZipcode: '',
    dropoffCoordinates: null,
    // Shipping method
    shippingMethod: ''
  });
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setAccepted(false);
    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        weight: parseFloat(formData.weight),
        dimensions: {
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height)
        },
        pickup: {
          country: formData.pickupCountry,
          address: formData.pickupAddress,
          zipcode: formData.pickupZipcode,
          city: formData.pickupCity,
          coordinates: formData.pickupCoordinates,
          formatted_address: formData.pickupFormattedAddress
        },
        dropoff: {
          country: formData.dropoffCountry,
          address: formData.dropoffAddress,
          zipcode: formData.dropoffZipcode,
          city: formData.dropoffCity,
          coordinates: formData.dropoffCoordinates,
          formatted_address: formData.dropoffFormattedAddress
        },
        shippingMethod: formData.shippingMethod
      };

      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch the quotation');
      }

      setQuoteData(data.data);
      setError(null);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
      setQuoteData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    // Create a clean version of the delivery data without circular references
    const deliveryData = {
      ...formData,
      pickup: {
        formatted_address: formData.pickupFormattedAddress,
        address: formData.pickupAddress,
        city: formData.pickupCity,
        country: formData.pickupCountry,
        zipcode: formData.pickupZipcode,
        coordinates: formData.pickupCoordinates
      },
      dropoff: {
        formatted_address: formData.dropoffFormattedAddress,
        address: formData.dropoffAddress,
        city: formData.dropoffCity,
        country: formData.dropoffCountry,
        zipcode: formData.dropoffZipcode,
        coordinates: formData.dropoffCoordinates
      },
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height)
      },
      weight: parseFloat(formData.weight),
      quoteData: quoteData,
      acceptedAt: new Date().toISOString()
    };

    // Remove any undefined or null values
    const cleanData = JSON.parse(JSON.stringify(deliveryData));
    const encodedData = encodeURIComponent(JSON.stringify(cleanData));
    router.push(`/request-delivery?data=${encodedData}`);
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-xl px-4 sm:mt-8 sm:px-6 md:mt-10 md:px-8">
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
        <h1 className="mb-2 text-2xl font-semibold text-gray-100 sm:text-3xl">Delivery Quote</h1>
        <p className="mb-6 text-base text-gray-400 sm:mb-8 sm:text-lg">Calculate your delivery cost.</p>

        <QuotationForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isSubmitting={isLoading}
        />

        {quoteData && !error && (
          <div className="mt-6 space-y-4">
            {/* Quote Summary */}
            <div className="rounded-xl border-2 border-gray-800 bg-transparent p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Estimated Cost:</span>
                <span className="text-2xl font-bold text-violet-400">${quoteData.estimatedCost.toFixed(2)}</span>
              </div>

              {/* Cost Breakdown */}
              <div className="mt-4 border-t border-gray-800 pt-4">
                <h3 className="mb-2 font-semibold text-gray-200">Cost Breakdown:</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(quoteData.breakdown).map(
                    ([key, value]) =>
                      key !== 'total' &&
                      key !== 'totalBeforeTax' && (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="text-gray-200">${value.toFixed(2)}</span>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="mt-4 border-t border-gray-800 pt-4">
                <h3 className="mb-2 font-semibold text-gray-200">Delivery Details:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Time:</span>
                    <span className="text-gray-200">
                      {quoteData.estimatedDelivery.minDays}-{quoteData.estimatedDelivery.maxDays} business days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-gray-200">{quoteData.distance.toFixed(1)} km</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAccept}
                disabled={accepted || isLoading}
                className="mt-6 w-full rounded-xl bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-4">
                {accepted ? 'Quote Accepted' : 'Accept Quotation'}
              </button>
            </div>

            {/* Addresses */}
            <div className="rounded-xl border-2 border-gray-800 bg-transparent p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium text-gray-400">Pickup Address:</h3>
                  <p className="text-gray-200">{formData.pickupFormattedAddress}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-gray-400">Delivery Address:</h3>
                  <p className="text-gray-200">{formData.dropoffFormattedAddress}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border-2 border-red-800 bg-transparent p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {accepted && (
          <div className="mt-6 rounded-xl bg-green-900/30 p-4">
            <p className="text-green-400">Quotation accepted. Redirecting to the delivery request form...</p>
          </div>
        )}
      </div>
    </div>
  );
}
