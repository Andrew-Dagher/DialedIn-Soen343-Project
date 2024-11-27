'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ReviewForm from '../../components/ReviewForm';
import {
  Package,
  Phone,
  Mail,
  MapPin,
  Truck,
  Calendar,
  User,
  Box,
  Loader2,
  Scale,
  Ruler,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function DeliveryPage() {
  const { user, isLoading } = useUser();
  const [deliveries, setDeliveries] = useState([]);
  const [openReviewId, setOpenReviewId] = useState(null);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    orderID: ''
  });

  const handleButtonClick = deliveryId => {
    setOpenReviewId(openReviewId === deliveryId ? null : deliveryId);
  };

  const handleSubmit = e => {
    if (user) {
      const fetchDeliveries = async () => {
        try {
          const port = window.location.port;
          const response = await fetch(
            `http://localhost:${port}/api/reviews?userId=${user.sub}&orderID=${formData.orderID}&rating=${formData.rating}&comment=${formData.comment}`
          );

          if (response.status == 500 || response.status == 400) {
            throw new Error('Failed to submit review');
          }
          const data = await response.json();
          console.log('Review:', data);
          setOpenReviewId(false);
          alert('Review submitted!');
        } catch (error) {
          console.error('Error submitting review:', error);
          
        }
      };

      fetchDeliveries();
    } else {
      alert('Error.');
      console.error('Review not submitted, user not found.');
    }
  };
  useEffect(() => {
    if (user) {
      const fetchDeliveries = async () => {
        const port = window.location.port;
        const response = await fetch(`http://localhost:${port}/api/view-deliveries?userId=${user.sub}`);
        const data = await response.json();
        console.log('Deliveries:', data);

        const trackingPromises = data.map(async delivery => {
          const trackingResponse = await fetch(`/api/track/${delivery.requestID}`, {
            method: 'POST'
          });

          if (!trackingResponse.ok) {
            throw new Error('Failed to fetch tracking information.');
          }

          const trackingData = await trackingResponse.json();
          console.log('Tracking data:', trackingData);
          delivery.trackingStatus = trackingData.data.locationDetails.location;
          return delivery;
        });

        // Wait for all the tracking data to be added to the deliveries
        const updatedDeliveries = await Promise.all(trackingPromises);

        // Sort deliveries by creation date in descending order (newest first)
        const sortedDeliveries = updatedDeliveries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setDeliveries(sortedDeliveries);
      };

      fetchDeliveries();
    }
  }, [user]);

  const getPaymentStatusInfo = status => {
    const statusInfo = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        style: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
        statusIcon: <CreditCard className="h-4 w-4" />
      },
      completed: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        style: 'border-green-400 bg-green-400/10 text-green-400',
        statusIcon: <CreditCard className="h-4 w-4" />
      },
      failed: {
        icon: <XCircle className="h-4 w-4" />,
        style: 'border-red-400 bg-red-400/10 text-red-400',
        statusIcon: <CreditCard className="h-4 w-4" />
      }
    };
    return (
      statusInfo[status?.toLowerCase()] || {
        icon: <AlertCircle className="h-4 w-4" />,
        style: 'border-gray-400 bg-gray-400/10 text-gray-400'
      }
    );
  };

  const getDeliveryStatusInfo = status => {
    const statusInfo = {
      delivered: {
        icon: <Truck className="h-4 w-4" />,
        style: 'border-green-400 bg-green-400/10 text-green-400',
        statusIcon: <CheckCircle2 className="h-4 w-4" />
      },
      pending: {
        icon: <Truck className="h-4 w-4" />,
        style: 'border-blue-400 bg-blue-400/10 text-blue-400',
        statusIcon: <Clock className="h-4 w-4" />
      },
      'in transit': {
        icon: <Truck className="h-4 w-4" />,
        style: 'border-violet-400 bg-violet-400/10 text-violet-400',
        statusIcon: <Clock className="h-4 w-4" />
      },
      canceled: {
        icon: <Truck className="h-4 w-4" />,
        style: 'border-red-400 bg-red-400/10 text-red-400',
        statusIcon: <Clock className="h-4 w-4" />
      }
    };
    return (
      statusInfo[status?.toLowerCase()] || {
        icon: <AlertCircle className="h-4 w-4" />,
        style: 'border-gray-400 bg-gray-400/10 text-gray-400'
      }
    );
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
      <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
        <Box className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-medium text-gray-100">My Deliveries</h2>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {deliveries.map(delivery => (
          <div
            key={delivery._id}
            className="rounded-xl border-2 border-gray-800 bg-gray-950 p-6 transition-all hover:border-gray-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-violet-400" />
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-base font-medium text-gray-100">{delivery.requestID}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 ${getPaymentStatusInfo(delivery.paymentStatus).style}`}>
                  {getPaymentStatusInfo(delivery.paymentStatus).statusIcon}
                  <span className="text-sm">{delivery.paymentStatus}</span>
                  {getPaymentStatusInfo(delivery.paymentStatus).icon}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 ${getDeliveryStatusInfo(delivery.trackingStatus).style}`}>
                  {getDeliveryStatusInfo(delivery.trackingStatus).icon}
                  <span className="text-sm">{delivery.trackingStatus}</span>
                  {getDeliveryStatusInfo(delivery.trackingStatus).statusIcon}
                </div>
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
                  <div className="flex items-start gap-3">
                    {' '}
                    <Scale className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-gray-100">{delivery.packageDimensions.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {' '}
                    <Ruler className="mt-1 h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="text-gray-100">
                        {delivery.packageDimensions.length} × {delivery.packageDimensions.width} ×{' '}
                        {delivery.packageDimensions.height} cm
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
                {delivery.billingLocation && (
                  <div className="space-y-2 text-gray-100">
                    <p>{delivery.billingLocation.address}</p>
                    <p>
                      {delivery.billingLocation.city}, {delivery.billingLocation.postalCode}
                    </p>
                    <p>{delivery.billingLocation.country}</p>
                  </div>
                )}
                {!delivery.billingLocation && (
                  <div className="space-y-2 text-gray-100">
                    <p>{delivery.addressLine}</p>
                    <p>
                      {delivery.city}, {delivery.postalCode}
                    </p>
                    <p>{delivery.country}</p>
                  </div>
                )}
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
                    {delivery.pickupLocation.city}, {delivery.pickupLocation.zipcode}
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
            {/* Button and Review Form section */}
            <div className="mt-6 flex items-center justify-between border-t-2 border-gray-800 pt-4">
              <button
                onClick={() => handleButtonClick(delivery.requestID)}
                className="flex items-center gap-2 rounded-xl border-2 border-violet-400 bg-violet-400/10 px-4 py-2 text-sm text-violet-400 transition-colors hover:bg-violet-400/20">
                <MessageSquare className="h-4 w-4" />
                {openReviewId === delivery.requestID ? 'Close Review Form' : 'Write a Review'}
              </button>
            </div>

            {openReviewId === delivery.requestID && (
              <ReviewForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                orderID={delivery.requestID}
              />
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
}
