'use client';

import { useState } from 'react';
import { Package, Loader2, Search } from 'lucide-react';

const TrackingForm = ({ initialPackageId, onTrack }) => {
  const [packageId, setPackageId] = useState(initialPackageId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = e => {
    setPackageId(e.target.value);
  };

  const handleTrackClick = async () => {
    if (!packageId) {
      setError('Please enter a valid package ID.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onTrack(packageId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = `
    w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 
    border-2 border-gray-800 text-sm text-gray-100 
    placeholder-gray-500 focus:border-violet-500 
    focus:outline-none transition-colors hover:border-gray-700
  `;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
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
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50">
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
      {error && (
        <div className="rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-red-400">
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default TrackingForm;
