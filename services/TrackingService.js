import { EmailSubscriber } from '../utils/EmailSubscriber'; 
import { TrackingSubject } from '../utils/TrackingSubject'; 
import sendgridClient from '@sendgrid/mail';
import Tracking from '../models/Tracking'; 

sendgridClient.setApiKey(process.env.SENDGRID_API_KEY); 

const emailSubscriber = new EmailSubscriber(); 
const trackingSubject = new TrackingSubject();
trackingSubject.subscribe(emailSubscriber);
const deliveryStages = [
  {
    location: 'Picked up from warehouse',
    description: 'Package has been picked up and is being prepared for delivery',
    progress: 0,
  },
  {
    location: 'In transit to distribution center',
    description: 'Package is on its way to the distribution center',
    progress: 10,
  },
  {
    location: 'Arrived at distribution center',
    description: 'Package has reached the distribution center',
    progress: 20,
  },
  {
    location: 'Departed from distribution center',
    description: 'Package is en route to your area',
    progress: 30,
  },
  {
    location: 'Arrived at local delivery facility',
    description: 'Package has reached your local delivery center',
    progress: 40,
  },
  {
    location: 'Sorted at local delivery facility',
    description: 'Package is being sorted for final delivery',
    progress: 50,
  },
  {
    location: 'Out for delivery',
    description: 'Package is on the delivery vehicle',
    progress: 60,
  },
  {
    location: 'In your neighborhood',
    description: 'Delivery vehicle is in your area',
    progress: 70,
  },
  {
    location: 'Delivery vehicle nearing address',
    description: 'The delivery vehicle is close to your location',
    progress: 80,
  },
  {
    location: 'Approaching delivery address',
    description: 'Package will be delivered soon',
    progress: 90,
  },
  {
    location: 'Delivered',
    description: 'Package has been delivered successfully',
    progress: 100,
  },
];



async function updateTrackingPhase(packageId) {
  try {
    const trackingData = await Tracking.findOne({ packageId });

    if (!trackingData) {
      console.error('Tracking data not found for packageId:', packageId);
      return { error: 'Tracking data not found' }; 
    }

    const currentProgress = trackingData.locationDetails?.progress || 0;
    const currentIndex = deliveryStages.findIndex(stage => stage.progress === currentProgress);

    if (currentIndex === -1) {
      console.error('Invalid progress state:', currentProgress);
      return { error: 'Invalid progress state' };
    }

    if (currentIndex >= deliveryStages.length - 1) {
      trackingData.locationDetails = deliveryStages[deliveryStages.length - 1];
      trackingData.deliveryProgress = 100;
      console.log(`Package ${packageId} already delivered.`);
    } else {
      const nextStage = deliveryStages[currentIndex + 1];
      trackingData.locationDetails = nextStage;
      trackingData.deliveryProgress = nextStage.progress;
      console.log(`Package ${packageId} updated to progress: ${nextStage.progress}%`);
      trackingSubject.notify(trackingData);
    }

    await trackingData.save();
    return trackingData;
  } catch (error) {
    console.error('Error updating tracking phase:', error);
    return { error: error.message || 'Failed to update tracking data' }; 
  }
}




async function handleUserTrackingRequest(packageId) {
  const updatedTrackingData = await updateTrackingPhase(packageId);

  // Check if an error occurred
  if (updatedTrackingData.error) {
    console.warn('Error during tracking update:', updatedTrackingData.error);
    return { error: updatedTrackingData.error, status: 'error' }; 
  }

  console.log('Tracking data updated for packageId:', packageId);
  return updatedTrackingData;
}


export { handleUserTrackingRequest };
