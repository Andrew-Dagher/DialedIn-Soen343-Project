import connectToDatabase from '../../../utils/mongodb'; 
import { handleUserTrackingRequest } from '../../../services/TrackingService'; 


export async function POST(req) {
  try {
    await connectToDatabase();

  
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return new Response(JSON.stringify({ error: 'PackageId is required' }), { status: 400 });
    }


    const trackingData = await handleUserTrackingRequest(packageId);

    if (trackingData.error) {
      return new Response(JSON.stringify({ error: trackingData.error }), { status: 500 });
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
    console.error(`Error handling tracking request for packageId ${req.url}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to handle tracking request' }), { status: 500 });
  }
}
