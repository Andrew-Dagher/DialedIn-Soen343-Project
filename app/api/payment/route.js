// api/payment/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import PaymentService from '../../../services/PaymentService';
import OrderDelivery from '../../../models/OrderDelivery';

export async function POST(request) {
  await connectToDatabase(); // Ensure the database is connected

  const { requestID, paymentInfo, amount, deliveryDetails } = await request.json();

  if (!requestID) {
    return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
  }

  try {
    // Instantiate PaymentService with the appropriate payment method
    const paymentService = new PaymentService(paymentInfo.paymentMethod);
    const payment = await paymentService.processPayment(amount, requestID, paymentInfo);

    if (payment.status === 'completed') {
      // Save delivery details once payment is successful
      const delivery = new OrderDelivery({
        requestID,
        contactName: deliveryDetails.contactName,
        phoneNumber: deliveryDetails.phoneNumber,
        email: deliveryDetails.email,
        country: deliveryDetails.country,
        addressLine: deliveryDetails.addressLine,
        postalCode: deliveryDetails.postalCode,
        city: deliveryDetails.city,
        packageDimensions: {
          width: deliveryDetails.width,
          length: deliveryDetails.length,
          height: deliveryDetails.height,
          weight: deliveryDetails.weight,
        },
        pickupLocation: {
          country: deliveryDetails.pickupCountry,
          address: deliveryDetails.pickupAddress,
          zipcode: deliveryDetails.pickupZipcode,
          city: deliveryDetails.pickupCity,
        },
        dropoffLocation: {
          country: deliveryDetails.dropoffCountry,
          address: deliveryDetails.dropoffAddress,
          zipcode: deliveryDetails.dropoffZipcode,
          city: deliveryDetails.dropoffCity,
        },
        shippingMethod: deliveryDetails.shippingMethod,
        paymentStatus: 'completed',
      });

      await delivery.save();
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
