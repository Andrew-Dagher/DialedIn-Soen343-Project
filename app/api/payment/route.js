import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import Client from '../../../models/Client';

export async function POST(request) {
  await connectToDatabase(); // Ensures the database is connected

  const { deliveryId, paymentInfo } = await request.json();

  if (!deliveryId) {
    return NextResponse.json({ error: 'Missing reservation ID' }, { status: 400 });
  }

  try {
    const client = await Client.findOneAndUpdate(
      { deliveryId },
      { $set: { paymentInfo } },
      { new: true } // Option to return the updated document
    );

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error('Error updating client payment details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
