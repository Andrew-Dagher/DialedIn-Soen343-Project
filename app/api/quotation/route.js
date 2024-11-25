// app/api/quotation/route.js

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

    // Validate coordinates presence
    if (!pickup.coordinates || !dropoff.coordinates) {
      return NextResponse.json(
        { error: 'Invalid address coordinates' },
        { status: 400 }
      );
    }

    // Format addresses for the service
    const formattedPickup = {
      address: pickup.address,
      city: pickup.city,
      zipcode: pickup.zipcode,
      country: pickup.country,
      coordinates: pickup.coordinates,
      formatted_address: pickup.formatted_address
    };

    const formattedDropoff = {
      address: dropoff.address,
      city: dropoff.city,
      zipcode: dropoff.zipcode,
      country: dropoff.country,
      coordinates: dropoff.coordinates,
      formatted_address: dropoff.formatted_address
    };

    // Get quote with the formatted addresses
    const quote = await QuotationService.getQuote({
      weight,
      dimensions,
      pickup: formattedPickup,
      dropoff: formattedDropoff,
      shippingMethod,
      includeBreakdown: true
    });

    // Return formatted response
    return NextResponse.json({
      success: true,
      data: {
        estimatedCost: quote.total,
        breakdown: quote.breakdown,
        distance: quote.distance,
        estimatedDelivery: quote.estimatedDelivery,
        addresses: {
          pickup: quote.addresses.pickup || formattedPickup.formatted_address,
          dropoff: quote.addresses.dropoff || formattedDropoff.formatted_address
        }
      }
    });

  } catch (error) {
    console.error('Quotation error:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to calculate quotation';
    let statusCode = 400;

    if (error.message.includes('GOOGLE_MAPS_API_KEY')) {
      errorMessage = 'Service configuration error';
      statusCode = 500;
    } else if (error.message.includes('address')) {
      errorMessage = 'Invalid address format or location not found';
    } else if (error.message.includes('dimensions')) {
      errorMessage = 'Invalid package dimensions';
    } else if (error.message.includes('weight')) {
      errorMessage = 'Invalid package weight';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: statusCode }
    );
  }
}