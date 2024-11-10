// app/api/test/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import Test from '../../../models/Test';

export async function POST(request) {
  await connectToDatabase();

  // Attempt to create a new test document
  const { message } = await request.json();
  
  try {
    const testDocument = await Test.create({ message });
    return NextResponse.json({ success: true, data: testDocument });
  } catch (error) {
    console.error('Error creating test document:', error);
    return NextResponse.json({ success: false, error: 'Failed to create test document' }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const testDocuments = await Test.find();
    return NextResponse.json({ success: true, data: testDocuments });
  } catch (error) {
    console.error('Error retrieving test documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve test documents' }, { status: 500 });
  }
}
