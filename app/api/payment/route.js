// api/payment/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import PaymentService from '../../../services/PaymentService';
import OrderDelivery from '../../../models/OrderDelivery';
import Tracking from '../../../models/Tracking';


export async function POST(request) {
  await connectToDatabase(); // Ensure the database is connected

  const { requestID, paymentInfo, amount, deliveryDetails } = await request.json();

  if (!requestID) {
    return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
  }

  try {
    // 1. Update Client with payment information using requestID instead of _id
    // const client = await Client.findOneAndUpdate(
    //   { requestID: requestID }, // Change _id to requestID
    //   { $set: { paymentInfo } },
    //   { new: true }
    // );

    // if (!client) {
    //   return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    // }


    // Instantiate PaymentService with the appropriate payment method
    const paymentService = new PaymentService(paymentInfo.paymentMethod);
    const payment = await paymentService.processPayment(amount, requestID, paymentInfo);

    if (payment.status === 'completed') {
      // Save delivery details once payment is successful
      const delivery = new OrderDelivery({
        requestID: requestID,
        contactName: deliveryDetails.contactName,
        phoneNumber: deliveryDetails.phoneNumber,
        email: deliveryDetails.email,
        billingLocation: {
          address: deliveryDetails.billingAddress,
          city: deliveryDetails.billingCity,
          zipcode: deliveryDetails.billingZipcode,
          country: deliveryDetails.billingCountry,
          coordinates: {
            lat: deliveryDetails.billingCoordinates.lat,
            lng: deliveryDetails.billingCoordinates.lng,
          },
          formattedAddress: deliveryDetails.billingFormattedAddress,
        },
        packageDimensions: {
          weight: deliveryDetails.weight,
          length: deliveryDetails.length,
          width: deliveryDetails.width,
          height: deliveryDetails.height,
        },
        pickupLocation: {
          address: deliveryDetails.pickupAddress,
          city: deliveryDetails.pickupCity,
          zipcode: deliveryDetails.pickupZipcode,
          country: deliveryDetails.pickupCountry,
          coordinates: {
            lat: deliveryDetails.pickupCoordinates.lat,
            lng: deliveryDetails.pickupCoordinates.lng,
          },
          formattedAddress: deliveryDetails.pickupFormattedAddress,
        },
        dropoffLocation: {
          address: deliveryDetails.dropoffAddress,
          city: deliveryDetails.dropoffCity,
          zipcode: deliveryDetails.dropoffZipcode,
          country: deliveryDetails.dropoffCountry,
          coordinates: {
            lat: deliveryDetails.dropoffCoordinates.lat,
            lng: deliveryDetails.dropoffCoordinates.lng,
          },
          formattedAddress: deliveryDetails.dropoffFormattedAddress,
        },
        shippingMethod: deliveryDetails.shippingMethod,
        paymentStatus: 'completed',
        userId: deliveryDetails.userId,
      });
      
      
      

      const tracking = new Tracking({
        packageId: requestID,
        clientContact: deliveryDetails.email,
        clientName: deliveryDetails.contactName,
        clientPhone: deliveryDetails.phoneNumber,
        locationDetails: {
          location: 'Picked up from warehouse',
          description: 'Package has been picked up and is being prepared for delivery',
          progress: 0,
        },
        deliveryProgress: 0,
        userId: deliveryDetails.userId
      });

      
      await tracking.save();

      await delivery.save();
    }



    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
