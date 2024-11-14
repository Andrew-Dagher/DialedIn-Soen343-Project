'use client';

import { useState } from 'react';

const TrackingForm = () => {
    const [packageId, setPackageId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setPackageId(e.target.value);
    };

    const handleTrackClick = async () => {
        if (!packageId) {
            setError('Please enter a package ID.');
            return;
        }
        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            const response = await fetch(`/api/track?packageId=${encodeURIComponent(packageId)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tracking information.');
            }

            const data = await response.json();
            setTrackingData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClassName = "w-full border-gray-800 border-2 rounded-xl bg-transparent p-3 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:border-violet-400 focus:outline-none";
    const buttonClassName = "rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700";
    const cardClassName = "bg-gray-800 p-4 rounded-lg text-gray-100 mt-4 shadow-lg";

    // Progress bar styles
    const progressBarContainerClass = "w-full bg-gray-700 rounded-full h-4 mt-2";
    const progressBarClass = "bg-violet-400 h-4 rounded-full transition-width duration-300";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Enter Package ID"
                    value={packageId}
                    onChange={handleInputChange}
                    className={inputClassName}
                />
                <button onClick={handleTrackClick} className={buttonClassName}>
                    Track
                </button>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {trackingData && (
                    <div className={cardClassName}>
                        <h2 className="text-lg font-medium mb-2">Tracking Information</h2>
                        <p><strong>Message:</strong> {trackingData.message}</p>
                        <p><strong>Package ID:</strong> {trackingData.data?.packageId}</p>
                        <p><strong>Client Contact:</strong> {trackingData.data?.clientContact}</p>
                        <p><strong>Client Name:</strong> {trackingData.data?.clientName}</p>
                        <p><strong>Client Phone:</strong> {trackingData.data?.clientPhone}</p>
                        {trackingData.data?.locationDetails && (
                            <div className="mt-2">
                                <p><strong>Location:</strong> {trackingData.data.locationDetails.location}</p>
                                <p><strong>Description:</strong> {trackingData.data.locationDetails.description}</p>
                            </div>
                        )}
                        {trackingData.data?.deliveryProgress !== undefined && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium">Delivery Progress:</h3>
                                <div className={progressBarContainerClass}>
                                    <div
                                        className={progressBarClass}
                                        style={{ width: `${trackingData.data.deliveryProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-1">{trackingData.data.deliveryProgress}% completed</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingForm;
