import connectToDatabase from '../../../../utils/mongodb';
import { handleUserTrackingRequest } from '../../../../services/TrackingService';

export async function POST(req) {
  try {
    await connectToDatabase();

    const packageId = req.nextUrl?.pathname.split('/').pop();

    if (!packageId) {
      return new Response(JSON.stringify({ error: 'PackageId is required' }), { status: 400 });
    }

    const trackingData = await handleUserTrackingRequest(packageId);

    if (trackingData.error) {
      console.warn('Tracking error handled gracefully:', trackingData.error);
      return new Response(JSON.stringify({ error: trackingData.error }), { status: 400 });
    }

    const responseData = {
      message: `Tracking updated for packageId: ${packageId}`,
      data: {
        _id: trackingData._id,
        packageId: trackingData.packageId,
        clientContact: trackingData.clientContact,
        clientName: trackingData.clientName,
        clientPhone: trackingData.clientPhone,
        locationDetails: trackingData.locationDetails,
        deliveryProgress: trackingData.deliveryProgress
      }
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle tracking request' }), { status: 500 });
  }
}
