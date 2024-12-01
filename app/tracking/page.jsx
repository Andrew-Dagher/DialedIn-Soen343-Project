'use client';

import { useSearchParams } from 'next/navigation';
import TrackingForm from '../../components/TrackingForm';

const TrackingPage = () => {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');

  return (
    <div className="mx-4 mt-6 rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:mx-6 sm:mt-8 sm:p-6 md:mx-8 md:mt-10 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-100 sm:mb-8 sm:text-3xl">Track Your Package</h1>
        <TrackingForm initialPackageId={packageId} />
      </div>
    </div>
  );
};

export default TrackingPage;
