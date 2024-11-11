// app/api/quotation/route.js

import { NextResponse } from 'next/server';
import QuotationService from '../../services/QuotationService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { weight, dimensions, pickup, dropoff, shippingMethod } = body;

    const estimatedCost = QuotationService.getQuote({
      weight,
      dimensions,
      pickup,
      dropoff,
      shippingMethod,
    });

    return NextResponse.json({ estimatedCost });
  } catch (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    );
  }
}

// Optionally, add OPTIONS method to handle preflight requests
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}