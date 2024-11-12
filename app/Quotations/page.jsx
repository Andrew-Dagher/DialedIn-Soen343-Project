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
    pickupCountry: '',
    pickupAddress: '',
    pickupZipcode: '',
    pickupCity: '',
    dropoffCountry: '',
    dropoffAddress: '',
    dropoffZipcode: '',
    dropoffCity: '',
    shippingMethod: ''
  });
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setAccepted(false);

    try {
      const requestBody = {
        id: Math.floor(Math.random() * 1000),
        estimatedCost: quote,
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
          city: formData.pickupCity
        },
        dropoff: {
          country: formData.dropoffCountry,
          address: formData.dropoffAddress,
          zipcode: formData.dropoffZipcode,
          city: formData.dropoffCity
        },
        shippingMethod: formData.shippingMethod
      };

      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch the quotation');
      }

      const data = await response.json();
      setQuote(data.estimatedCost);
      setError(null);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
      setQuote(null);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    const encodedData = encodeURIComponent(JSON.stringify(formData));
    router.push(`/request-delivery?data=${encodedData}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-8">
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100 mb-2">Delivery Quote</h1>
        <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8">Calculate your delivery cost.</p>

        <QuotationForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />

        {quote && !error && (
          <div className="mt-6 rounded-xl border-2 border-gray-800 bg-transparent p-4 sm:p-6">
            <p className="text-base text-white font-bold sm:text-lg">
              Estimated Cost: <span className="font-semibold text-violet-400">${quote}</span>
            </p>
            <button
              onClick={handleAccept}
              className="mt-4 w-full rounded-xl bg-green-500 px-4 sm:px-6 py-3 sm:py-4 font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              disabled={accepted}>
              Accept Quotation
            </button>
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