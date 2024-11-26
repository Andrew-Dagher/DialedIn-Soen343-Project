// app/api/quotation/route.js

import { NextResponse } from 'next/server';
import QuotationService from '../../../services/QuotationService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { weight, dimensions, pickup, dropoff, shippingMethod } = body;

    // Basic validation
    if (!weight || !dimensions || !pickup || !dropoff || !shippingMethod) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Pre-validate dimensions
    const { SIZE_LIMITS } = QuotationService.PRICING_CONSTANTS;
    for (const [dimension, value] of Object.entries(dimensions)) {
      if (!value || isNaN(value)) {
        return NextResponse.json(
          { error: `Please enter a valid ${dimension}` },
          { status: 400 }
        );
      }
      
      const min = SIZE_LIMITS[`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`];
      const max = SIZE_LIMITS[`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`];
      
      if (value < min || value > max) {
        return NextResponse.json(
          { error: `${dimension} must be between ${min}cm and ${max}cm` },
          { status: 400 }
        );
      }
    }

    // Pre-validate weight
    const { WEIGHT_LIMITS } = QuotationService.PRICING_CONSTANTS;
    if (!weight || isNaN(weight)) {
      return NextResponse.json(
        { error: 'Please enter a valid weight' },
        { status: 400 }
      );
    }
    
    if (weight < WEIGHT_LIMITS.min || weight > WEIGHT_LIMITS.max) {
      return NextResponse.json(
        { error: `Weight must be between ${WEIGHT_LIMITS.min}kg and ${WEIGHT_LIMITS.max}kg` },
        { status: 400 }
      );
    }

    // Validate addresses
    if (!pickup.coordinates || !dropoff.coordinates) {
      return NextResponse.json(
        { error: 'Please select valid addresses from the suggestions' },
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
        addresses: {
          pickup: quote.addresses.pickup || pickup.formatted_address,
          dropoff: quote.addresses.dropoff || dropoff.formatted_address
        }
      }
    });

  } catch (error) {
    console.error('Quotation error:', error);
    
    return NextResponse.json(
      { 
        error: error.message.replace('Quotation failed: ', '')
      },
      { status: 400 }
    );
  }
}