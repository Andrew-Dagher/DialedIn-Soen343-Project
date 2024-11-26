import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import UserPoints from '../../../models/UserPoints';

export async function POST(request) {
  await connectToDatabase(); // Connect to the MongoDB database

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    // Find user points balance by userId
    const userPointsAccount = await UserPoints.findOne({ userId });

    if (!userPointsAccount) {
      return NextResponse.json({ pointsBalance: 0 }); // Default to 0 if no points found
    }

    return NextResponse.json({ pointsBalance: userPointsAccount.pointsBalance });
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
