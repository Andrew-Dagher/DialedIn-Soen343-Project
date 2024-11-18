import { NextResponse } from 'next/server';
import QuotationService from '../../../services/QuotationService';

// Ensure Google Maps API key is available
if (!process.env.GOOGLE_MAPS_API_KEY) {
  throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { weight, dimensions, pickup, dropoff, shippingMethod } = body;

    // Validate required fields
    if (!weight || !dimensions || !pickup || !dropoff || !shippingMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quote = await QuotationService.getQuote({
      weight,
      dimensions,
      pickup,
      dropoff,
      shippingMethod,
      includeBreakdown: true
    });

    return NextResponse.json({
      success: true,
      data: {
        estimatedCost: quote.total,
        breakdown: quote.breakdown,
        distance: quote.distance,
        estimatedDelivery: quote.estimatedDelivery,
        addresses: quote.addresses
      }
    });

  } catch (error) {
    console.error('Quotation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate quotation' },
      { status: 400 }
    );
  }
}