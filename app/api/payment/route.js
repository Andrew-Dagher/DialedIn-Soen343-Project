import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import Client from '../../../models/Client';
import Payment from '../../../models/Payment';
import { v4 as uuidv4 } from 'uuid'; // To generate unique paymentID

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

    // 2. Create a new payment log in the Payment collection
    const payment = new Payment({
      paymentID: uuidv4(), // Generate a unique payment ID
      requestID: requestID, 
      paymentMethod: 'credit_card',
      amount: amount,
      status: 'completed', // Set to completed or pending as per your requirements
      transactionDate: new Date(),
    });


    await payment.save(); // Save payment log

    // Respond with success
    return NextResponse.json({ success: true, payment });
    // return NextResponse.json({ success: true, client, payment });
  } catch (error) {
    console.error("Error updating client payment details:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
