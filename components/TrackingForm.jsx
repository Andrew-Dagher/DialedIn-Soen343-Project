'use client';

import { useState, useEffect } from 'react';
import { Package, User, Phone, Mail, MapPin, Loader2, Search } from 'lucide-react';

const TrackingForm = ({ initialPackageId }) => {
  const [packageId, setPackageId] = useState(initialPackageId || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPackageId) {
      fetchTrackingData(initialPackageId);
    }
  }, [initialPackageId]);

  const fetchTrackingData = async (packageIdToTrack) => {
    if (!packageIdToTrack) {
      setError('Please enter a valid package ID.');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/track/${encodeURIComponent(packageIdToTrack)}`, {
        method: 'POST',
      });

      const data = await response.json();

      console.log(response);

      // Check for errors in response
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch tracking information.');
      }

      // Set tracking data if successful
      setTrackingData(data);
    } catch (error) {
      setTrackingData(null); // Clear tracking data on error
      setError(error.message); // Display the error message
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setPackageId(e.target.value);
  };

  // Handle button click for tracking
  const handleTrackClick = () => {
    fetchTrackingData(packageId);
  };

  const inputClassName = `
    w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 
    border-2 border-gray-800 text-sm text-gray-100 
    placeholder-gray-500 focus:border-violet-500 
    focus:outline-none transition-colors hover:border-gray-700
  `;

  return (
    <div className="flex flex-col gap-8">
      {/* Search Form */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Package className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Enter Package ID"
              value={packageId}
              onChange={handleInputChange}
              className={inputClassName}
            />
          </div>
          <button
            onClick={handleTrackClick}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-medium text-sm
              flex items-center justify-center gap-2 transition-all duration-200
              bg-violet-500 text-white hover:bg-violet-600 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Track Package
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-red-400">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {!error && trackingData && (
        <div className="space-y-8">
          {/* Status Message */}
          <div className="rounded-xl border-2 border-violet-500/50 bg-violet-500/10 p-4">
            <p className="text-violet-400">{trackingData.message}</p>
          </div>

          {/* Package Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
              <Package className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-medium text-gray-100">Package Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Package ID</p>
                  <p className="text-gray-100">{trackingData.data?.packageId || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Client Name</p>
                  <p className="text-gray-100">{trackingData.data?.clientName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Client Contact</p>
                  <p className="text-gray-100">{trackingData.data?.clientContact || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Client Phone</p>
                  <p className="text-gray-100">{trackingData.data?.clientPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {trackingData.data?.locationDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
                <MapPin className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-medium text-gray-100">Current Location</h2>
              </div>
              <div className="rounded-xl border-2 border-gray-800 bg-gray-900/50 p-4">
                <p className="text-gray-100 font-medium">{trackingData.data.locationDetails.location}</p>
                <p className="mt-1 text-gray-500">{trackingData.data.locationDetails.description}</p>
              </div>
            </div>
          )}

          {/* Delivery Progress */}
          {trackingData.data?.deliveryProgress !== undefined && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
                <Package className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-medium text-gray-100">Delivery Progress</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm text-violet-400">{trackingData.data.deliveryProgress}% completed</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${trackingData.data.deliveryProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingForm;
