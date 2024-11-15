import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TrackingSearch = () => {
  const [packageId, setPackageId] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    setPackageId(e.target.value);
  };

  const handleTrackClick = () => {
    if (!packageId) {
      alert('Please enter a package ID.');
      return;
    }
    // Redirect to the tracking page with the packageId as a query parameter
    router.push(`/tracking?packageId=${encodeURIComponent(packageId)}`);
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-0">
      <div className="relative flex h-12 flex-1 items-center rounded-xl bg-white sm:h-14">
        <input
          type="text"
          placeholder="Enter tracking number"
          value={packageId}
          onChange={handleInputChange}
          className="flex-1 rounded-xl bg-transparent px-4 text-sm outline-none sm:text-base"
          aria-label="Tracking number input"
        />
        <button
          onClick={handleTrackClick}
          className="rounded-xl bg-violet-400 text-sm font-medium text-white transition-colors hover:bg-violet-600 sm:h-14 sm:px-12 sm:text-base"
        >
          Track
        </button>
      </div>
    </div>
  );
};

export default TrackingSearch;
