'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, User, Phone, Mail, MapPin } from 'lucide-react';
import TrackingForm from '../../components/TrackingForm';

const TrackingPage = () => {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');

  const fetchTrackingData = async packageIdToTrack => {
    try {
      const response = await fetch(`/api/track/${encodeURIComponent(packageIdToTrack)}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch tracking information.');
      }

      setTrackingData(data);
      setError('');
    } catch (err) {
      setTrackingData(null);
      setError(err.message);
    }
  };

  return (
    <div className="mx-4 mt-6 rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:mx-6 sm:mt-8 sm:p-6 md:mx-8 md:mt-10 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-100 sm:mb-8 sm:text-3xl">Track Your Package</h1>
        <TrackingForm initialPackageId={packageId} onTrack={fetchTrackingData} />
        {trackingData && (
          <div className="mt-8 space-y-8">
            {/* Status Message */}
            <div className="rounded-xl border-2 border-violet-500/50 bg-violet-500/10 p-4">
              <p className="text-violet-400">{trackingData.message}</p>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                <Package className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-medium text-gray-100">Package Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Package ID</p>
                    <p className="text-gray-100">{trackingData.data?.packageId || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Client Name</p>
                    <p className="text-gray-100">{trackingData.data?.clientName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Client Contact</p>
                    <p className="text-gray-100">{trackingData.data?.clientContact || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Client Phone</p>
                    <p className="text-gray-100">{trackingData.data?.clientPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location */}
            {trackingData.data?.locationDetails && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <h2 className="text-lg font-medium text-gray-100">Current Location</h2>
                </div>
                <div className="rounded-xl border-2 border-gray-800 bg-gray-900/50 p-4">
                  <p className="font-medium text-gray-100">{trackingData.data.locationDetails.location}</p>
                  <p className="mt-1 text-gray-500">{trackingData.data.locationDetails.description}</p>
                </div>
              </div>
            )}

            {/* Delivery Progress */}
            {trackingData.data?.deliveryProgress !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">
                  <Package className="h-5 w-5 text-violet-400" />
                  <h2 className="text-lg font-medium text-gray-100">Delivery Progress</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm text-violet-400">{trackingData.data.deliveryProgress}% completed</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${trackingData.data.deliveryProgress}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-red-400">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
