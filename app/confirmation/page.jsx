'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [quotationPrice, setQuotationPrice] = useState(null);

  useEffect(() => {
    // Retrieve the saved delivery request details from localStorage
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
            country: details.pickupCountry,
            address: details.pickupAddress,
            zipcode: details.pickupZipcode,
            city: details.pickupCity,
          },
          dropoff: {
            country: details.dropoffCountry,
            address: details.dropoffAddress,
            zipcode: details.dropoffZipcode,
            city: details.dropoffCity,
          },
          shippingMethod: details.shippingMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuotationPrice(data.estimatedCost);
        localStorage.setItem("tempAmount", data.estimatedCost);  // Save amount to localStorage for payment page
      } else {
        console.error("Failed to fetch quotation price");
      }
    } catch (error) {
      console.error("Error fetching quotation price:", error);
    }
  };

  const handleEdit = () => {
    // Include the quotation price in the delivery details before editing
    const updatedDetails = { ...deliveryDetails, quotationPrice };
    const encodedData = encodeURIComponent(JSON.stringify(updatedDetails));
    router.push(`/request-delivery?data=${encodedData}`); // Redirect to the form page for editing
  };

  const handleProceedToPayment = () => {
    // Store the request details and quotation price to localStorage before proceeding to payment
    localStorage.setItem("confirmedRequestData", JSON.stringify(deliveryDetails));
    localStorage.setItem("quotationPrice", quotationPrice);
    router.push('/payment'); // Redirect to payment page
  };

  if (!deliveryDetails) {
    return <p>Loading confirmation details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-100">
      <h1 className="text-3xl font-semibold mb-6 text-violet-400">Confirm Delivery Request</h1>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <p className="text-lg mb-2">Please review your details below. If everything is correct, proceed to payment.</p>

        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-300">Contact Information</h3>
          <p>Name: {deliveryDetails.contactName}</p>
          <p>Phone: {deliveryDetails.phoneNumber}</p>
          <p>Email: {deliveryDetails.email}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-300">Package Details</h3>
          <p>Weight: {deliveryDetails.weight} kg</p>
          <p>Dimensions: {deliveryDetails.length} x {deliveryDetails.width} x {deliveryDetails.height} cm</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-300">Pickup Location</h3>
          <p>Country: {deliveryDetails.pickupCountry}</p>
          <p>Address: {deliveryDetails.pickupAddress}</p>
          <p>City: {deliveryDetails.pickupCity}</p>
          <p>Zipcode: {deliveryDetails.pickupZipcode}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-300">Drop-off Location</h3>
          <p>Country: {deliveryDetails.dropoffCountry}</p>
          <p>Address: {deliveryDetails.dropoffAddress}</p>
          <p>City: {deliveryDetails.dropoffCity}</p>
          <p>Zipcode: {deliveryDetails.dropoffZipcode}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-medium text-gray-300">Shipping Method</h3>
          <p>{deliveryDetails.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}</p>
        </div>

        {quotationPrice && (
          <div className="mt-4">
            <h3 className="text-xl font-medium text-gray-300">Quotation Price</h3>
            <p className="text-lg font-semibold text-violet-400">${quotationPrice}</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleEdit}
            className="rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-600">
            Edit Details
          </button>
          <button
            onClick={handleProceedToPayment}
            className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
