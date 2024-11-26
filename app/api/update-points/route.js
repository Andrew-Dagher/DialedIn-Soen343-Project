// app/api/update-points/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import UserPoints from '../../../models/UserPoints';

export async function POST(request) {
  await connectToDatabase();

  const { userId, pointsToAdd } = await request.json();

  if (!userId || typeof pointsToAdd !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Find and update the user's points balance or create a new record if the user doesn't exist
    const userPointsAccount = await UserPoints.findOneAndUpdate(
      { userId },
      { $inc: { pointsBalance: pointsToAdd } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'Points updated successfully', pointsBalance: userPointsAccount.pointsBalance });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
