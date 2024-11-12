import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import PaymentService from '../../../services/PaymentService';

export async function POST(request) {
  await connectToDatabase(); // Ensure the database is connected

  const { requestID, paymentInfo, amount } = await request.json();

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

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
