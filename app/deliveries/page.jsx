'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { Package, Phone, Mail, MapPin, Truck, Calendar, User, Box, Loader2, Scale, Ruler } from 'lucide-react';

export default function RequestDeliveryPage() {
  const { user, isLoading } = useUser();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchDeliveries = async () => {
        const port = window.location.port;
        const response = await fetch(`http://localhost:${port}/api/view-deliveries?userId=${user.sub}`);
        const data = await response.json();
        setDeliveries(data);
        console.log('Deliveries:', data);
      };
      fetchDeliveries();
    }
  }, [user]);

  const getStatusStyle = status => {
    const statusStyles = {
      pending: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
      paid: 'border-green-400 bg-green-400/10 text-green-400',
      unpaid: 'border-red-400 bg-red-400/10 text-red-400',
      delivered: 'border-green-400 bg-green-400/10 text-green-400',
      'in transit': 'border-blue-400 bg-blue-400/10 text-blue-400',
      processing: 'border-violet-400 bg-violet-400/10 text-violet-400'
    };
    return statusStyles[status?.toLowerCase()] || 'border-gray-400 bg-gray-400/10 text-gray-400';
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

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="rounded-xl border-2 border-gray-800 bg-transparent p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-violet-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-100">Please log in</h2>
          <p className="mt-2 text-gray-500">Authentication required to view deliveries</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
        <Box className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-medium text-gray-100">My Deliveries</h2>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {deliveries.map(delivery => (
          <div
            key={delivery._id}
            className="rounded-xl border-2 border-gray-800 bg-transparent p-6 transition-all hover:border-gray-700">
            {/* Order Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-violet-400" />
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-base font-medium text-gray-100">{delivery.requestID}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${getStatusStyle(delivery.paymentStatus)}`}>
                  {delivery.paymentStatus}
                </span>
                <span
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${getStatusStyle(delivery.deliveryStatus)}`}>
                  {delivery.deliveryStatus}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <User className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-medium text-gray-100">Contact Details</h3>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-100">{delivery.contactName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-100">{delivery.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-100">{delivery.email}</span>
                  </div>
                </div>
              </div>

              {/* Package Dimensions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <Box className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-medium text-gray-100">Package Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Scale className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-gray-100">{delivery.packageDimensions.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="text-gray-100">
                        {delivery.packageDimensions.length} × {delivery.packageDimensions.width} × {delivery.packageDimensions.height} cm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-medium text-gray-100">Primary Address</h3>
                </div>
                <div className="space-y-2 text-gray-100">
                  <p>{delivery.addressLine}</p>
                  <p>
                    {delivery.city}, {delivery.postalCode}
                  </p>
                  <p>{delivery.country}</p>
                </div>
              </div>
            </div>

            {/* Pickup and Dropoff Locations */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Pickup Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-medium text-gray-100">Pickup Location</h3>
                </div>
                <div className="space-y-2 text-gray-100">
                  <p>{delivery.pickupLocation.address}</p>
                  <p>
                    {delivery.pickupLocation.city}, {delivery.pickupLocation.ipcode}
                  </p>
                  <p>{delivery.pickupLocation.country}</p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-medium text-gray-100">Dropoff Location</h3>
                </div>
                <div className="space-y-2 text-gray-100">
                  <p>{delivery.dropoffLocation.address}</p>
                  <p>
                    {delivery.dropoffLocation.city}, {delivery.dropoffLocation.zipcode}
                  </p>
                  <p>{delivery.dropoffLocation.country}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t-2 border-gray-800 pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-violet-400" />
                <span className="text-gray-100">{delivery.shippingMethod}</span>
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                <Calendar className="h-5 w-5 text-violet-400" />
                <span className="text-gray-100">{new Date(delivery.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State remains the same */}
      </div>
    </div>
  );
}
