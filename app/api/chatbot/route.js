import { NextResponse } from 'next/server';
import ChatbotStrategy from '../../../services/ChatbotStrategy';
import connectToDatabase from '../../../utils/mongodb';
import { handleUserTrackingRequest } from '../../../services/TrackingService';

const chatbotStrategy = new ChatbotStrategy();
const conversationHistory = {}; // Simple in-memory storage for conversation history

const companyInfo = `
You are a customer service representative for DialedIn, specializing in delivery services. 
Provide friendly, professional, and accurate responses based on the following services:

1. **Package Tracking**:
   - Help customers track packages by requesting their tracking number.
   - Provide real-time updates about package locations, potential delays, and reasons.

2. **Quotations for Delivery Services**:
   - Provide accurate delivery quotations based on package weight, dimensions, destination, and speed.

3. **General Inquiries**:
   - Address all inquiries related to DialedIn services.
   - Politely redirect unrelated questions to remain focused on delivery services.

Follow these protocols:
- Answer in around 15 words.
- Maintain a professional and empathetic tone.
- Focus responses on DialedIn's services.
- Avoid providing information outside the scope of DialedIn.
`;

export async function POST(request) {
  await connectToDatabase(); // Ensure the database is connected

  const { question } = await request.json();
  if (!question) {
    return NextResponse.json({ error: 'Missing question in request body' }, { status: 400 });
  }

  const userId = 'default_user'; // Static user ID for simplicity
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = { history: [], quotationDetails: null };
  }

  try {
    // Save user question to history
    conversationHistory[userId].history.push({ role: 'user', message: question });

    // Detect tracking number
    const trackingNumber = question.match(/[A-Za-z0-9_-]{21}/)?.[0];
    if (trackingNumber) {
      try {
        const location = await chatbotStrategy.getPackageLocation(trackingNumber);
        const trackingLink = `http://localhost:3000/tracking?packageId=${trackingNumber}`;
        const response = `The package with tracking number ${trackingNumber} is at: ${location}. You can also check the status --> ${trackingLink}.`;

        // Save bot response to history
        conversationHistory[userId].history.push({ role: 'bot', message: response });
        return NextResponse.json({ answer: response });
      } catch (error) {
        const errorMessage = `I couldn't find information for tracking number ${trackingNumber}. Please verify it.`;
        conversationHistory[userId].history.push({ role: 'bot', message: errorMessage });
        return NextResponse.json({ answer: errorMessage });
      }
    }

    // Handle quotation requests
    if (
      question.toLowerCase().includes('quote') ||
      question.toLowerCase().includes('quotation') ||
      question.toLowerCase().includes('weight') ||
      question.toLowerCase().includes('dimensions') ||
      question.toLowerCase().includes('pickup') ||
      question.toLowerCase().includes('dropoff') ||
      question.toLowerCase().includes('shipping method')
    ) {
      try {
        const extractedDetails = await chatbotStrategy.extractDetails(question);
        if (
          extractedDetails.weight &&
          extractedDetails.dimensions &&
          extractedDetails.pickup &&
          extractedDetails.dropoff &&
          extractedDetails.shippingMethod
        ) {
          const quote = await chatbotStrategy.getQuotation({
            weight: extractedDetails.weight,
            dimensions: extractedDetails.dimensions,
            pickup: { address: extractedDetails.pickup },
            dropoff: { address: extractedDetails.dropoff },
            shippingMethod: extractedDetails.shippingMethod,
          });

          // Combine quotation details with extracted data for conversation history
          conversationHistory[userId].quotationDetails = { ...quote, ...extractedDetails };

          // Prepare delivery data for the redirect link
          const deliveryData = {
            pickup: {
              formatted_address: extractedDetails.pickup,
              address: extractedDetails.pickup,
            },
            dropoff: {
              formatted_address: extractedDetails.dropoff,
              address: extractedDetails.dropoff,
            },
            dimensions: {
              length: extractedDetails.dimensions.length,
              width: extractedDetails.dimensions.width,
              height: extractedDetails.dimensions.height,
            },
            weight: extractedDetails.weight,
            shippingMethod: extractedDetails.shippingMethod,
            quoteData: quote,
            acceptedAt: new Date().toISOString(),
          };

          const redirectLink = `/request-delivery?data=${encodeURIComponent(JSON.stringify(deliveryData))}`;
          const quotationResponse = `Estimated cost: $${quote.total.toFixed(2)} using ${extractedDetails.shippingMethod} shipping. Proceed to request delivery --> ${redirectLink}`;

          conversationHistory[userId].history.push({ role: 'bot', message: quotationResponse });
          return NextResponse.json({ answer: quotationResponse, redirectLink });
        } else {
          const missingDetailsResponse = `It seems some quotation details are missing. Please provide weight, dimensions, pickup, dropoff addresses, and shipping method.`;
          conversationHistory[userId].history.push({ role: 'bot', message: missingDetailsResponse });
          return NextResponse.json({ answer: missingDetailsResponse });
        }
      } catch (error) {
        const errorMessage = `Failed to process your quotation request: ${error.message}`;
        conversationHistory[userId].history.push({ role: 'bot', message: errorMessage });
        return NextResponse.json({ answer: errorMessage });
      }
    }

    // Fallback for other inquiries
    const contextAwarePrompt = `
      ${companyInfo}
      Conversation History: ${JSON.stringify(conversationHistory[userId].history)}
      User: ${question}
      Assistant:
    `;
    const response = await chatbotStrategy.sendToLlamaModel(contextAwarePrompt);
    conversationHistory[userId].history.push({ role: 'bot', message: response });
    return NextResponse.json({ answer: response });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
