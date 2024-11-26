import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import Coupon from '../../../models/Coupons';

export async function POST(request) {
  await connectToDatabase(); // Connect to the MongoDB database

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    // Find all coupons for the user by userId
    const userCoupons = await Coupon.find({ userId });

    return NextResponse.json({ coupons: userCoupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
