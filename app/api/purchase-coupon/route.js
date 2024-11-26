import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import Coupon from '../../../models/Coupons'; // Correct the filename
import UserPoints from '../../../models/UserPoints';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  await connectToDatabase();

  try {
    // Parse the request data
    const { userId, pointsToRedeem } = await request.json();
    console.log('Received request data:', { userId, pointsToRedeem });

    // Check if userId and pointsToRedeem are provided
    if (!userId || !pointsToRedeem) {
      console.log('Missing user ID or points to redeem');
      return NextResponse.json({ error: 'Missing user ID or points to redeem' }, { status: 400 });
    }

    // Find the user's points account
    const userPointsAccount = await UserPoints.findOne({ userId });
    console.log('User points account:', userPointsAccount);

    // Validate if the user's points account is found and if they have enough points
    if (!userPointsAccount) {
      console.log('User points account not found for userId:', userId);
      return NextResponse.json({ error: 'User points account not found' }, { status: 404 });
    }

    if (userPointsAccount.pointsBalance < pointsToRedeem) {
      console.log('Insufficient points balance:', userPointsAccount.pointsBalance);
      return NextResponse.json({ error: 'Insufficient points balance' }, { status: 400 });
    }

    // Deduct the points from user's balance
    userPointsAccount.pointsBalance -= pointsToRedeem;
    await userPointsAccount.save();
    console.log('Updated user points balance:', userPointsAccount.pointsBalance);

    // Create a new coupon with the appropriate discount percentage
    const discountPercentage = pointsToRedeem / 10;
    const newCoupon = new Coupon({
      userId,
      couponID: uuidv4(),
      discountPercentage,
    });

    // Save the coupon in the database
    await newCoupon.save();
    console.log('Coupon created successfully:', newCoupon);

    // Return the newly created coupon, including the couponID
    return NextResponse.json({
      message: 'Coupon purchased successfully',
      coupon: {
        couponID: newCoupon.couponID, // Include the generated couponID
        discountPercentage: newCoupon.discountPercentage,
        isUsed: newCoupon.isUsed,
      },
    });
  } catch (error) {
    console.error('Error purchasing coupon:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
