import ollama from 'ollama';
import { NextResponse } from 'next/server';

let conversationHistory = [];

// Define a fixed context for your company
const companyInfo = `
You are a customer service representative for DialedIn, which specializes in delivery services. 
Please respond in a friendly and professional manner, providing accurate information based on the company context. 

The services offered by DialedIn include:

1. **Package Tracking**: 
   - Assist customers in tracking their packages by requesting the tracking number. 
   - Provide real-time updates about the package's location, which is obtained from our tracking system.
   - Inform customers about any potential delays and the reasons behind them.

2. **Payment Status**: 
   - Help customers check the status of their payments.
   - If asked about a payment, inquire about the order number or tracking number to retrieve relevant information.
   - Provide clear information regarding payment confirmations, processing times, and any issues that may have occurred.

3. **Quotations for Delivery Services**: 
   - Provide customers with quotations based on their delivery needs.
   - Ask for details such as package weight, dimensions, destination, and desired delivery speed to generate an accurate quote.
   - Clarify any additional fees that may apply based on the service level requested.

4. **General Inquiries**: 
   - Welcome all general inquiries related to DialedIn’s services.
   - Always redirect conversations back to the services provided by DialedIn.
   - If a customer inquires about unrelated topics, politely inform them that you can only assist with questions related to 
   delivery services, package tracking, payment status, and quotes.

5. **Customer Service Protocol**: 
   - Maintain a tone that is professional, courteous, and helpful.
   - Be empathetic towards customer concerns and respond to them with understanding.
   - Reassure customers that their inquiries are important and that you are there to help.

6. **Limitations**: 
   - Do not mention any other company names, services, or unrelated topics. 
   - Avoid providing information on services that DialedIn does not offer, ensuring customers receive accurate and relevant answers.

When responding to questions, consider the following guidelines:
- Start with a welcoming greeting specific to DialedIn (e.g., "Thank you for reaching out to DialedIn! How can I assist you today?").
- For tracking inquiries, prompt the user for their tracking number.
- For payment inquiries, ask for relevant details to assist them effectively.
- For quotes, gather all necessary information and provide a clear estimate.
- Always strive to keep the conversation focused on the services and information related to DialedIn.
- Keep the response short (about 20 words) and straight to the point.
`;

export async function POST(request) {
    console.log('Request body:', request.body);
    const { question } = await request.json();

    if (!question) {
        console.error('Missing question in request body', question);
        return NextResponse.json({ error: 'Missing question in request body' }, { status: 400 });
    } else  {
        console.log('Question:', question);
    };

    try {
        if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('paid')) {
            if (!question.match(/\d+/)) {
                const response = "Could you please provide me with your tracking number to check the payment status?";
                conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: response }
                );
                return NextResponse.json({ answer: response });
            }

            const trackingNumber = question.match(/\d+/)[0];
            try {
                const paymentInfo = await getPaymentStatus(trackingNumber);
                const response = `For tracking number ${trackingNumber}, the payment status is: ${paymentInfo.status}. Amount: ${paymentInfo.amount}, paid on ${paymentInfo.date} via ${paymentInfo.method}. Can I help you with anything else?`;

                conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: response }
                );

                return NextResponse.json({ answer: response });
            } catch (paymentError) {
                const response = `I apologize, but I couldn't find any payment information for tracking number ${trackingNumber}. Could you please verify the number?`;

                conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: response }
                );

                return NextResponse.json({ answer: response });
            }
        }

        if (question.toLowerCase().includes('track') && !question.match(/\d+/)) {
            const response = "Could you please provide me with your tracking number so I can check on its status?";
            conversationHistory.push(
                { role: 'user', content: question },
                { role: 'assistant', content: response }
            );
            return NextResponse.json({ answer: response });
        }

        const trackingNumber = question.match(/\d+/)?.[0];

        if (trackingNumber) {
            try {
                const location = await getPackageLocation(trackingNumber);
                const trackingLink = `http://localhost:3000/tracking/${trackingNumber}`;
                const response = `Thank you for providing your tracking number. ${location}Is there anything else you'd like to know about your delivery? ${trackingLink}`;

                conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: response }
                );

                return NextResponse.json({ answer: response });
            } catch (trackingError) {
                const response = `I'm sorry, but I couldn't find any information for tracking number ${trackingNumber}. Could you please verify the number and try again?`;

                conversationHistory.push(
                    { role: 'user', content: question },
                    { role: 'assistant', content: response }
                );

                return NextResponse.json({ answer: response });
            }
        }

        const conversationPrompt = companyInfo + '\n' + `User: ${question}\nAssistant:`;

        const response = await sendToLlamaModel(conversationPrompt);
        conversationHistory.push(
            { role: 'user', content: question },
            { role: 'assistant', content: response }
        );

        return NextResponse.json({ answer: response });
    } catch (error) {
        console.error(`Error processing request: ${error.message}`);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

// Helper functions

const sendToLlamaModel = async (prompt) => {
    try {
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: prompt }]
        });
        return response.message.content;
    } catch (error) {
        console.error(`Error interacting with LLaMA: ${error.message}`);
        throw new Error('Failed to interact with LLaMA');
    }
};

const getPackageLocation = async (trackingNumber) => {
    const mockLocationData = {
        '123456': 'Your package is currently in transit and is expected to arrive tomorrow.',
        '789012': 'Out for delivery in Phoenix, AZ',
    };

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const location = mockLocationData[trackingNumber];
            if (location) {
                resolve(location);
            } else {
                reject('Tracking number not found.');
            }
        }, 1000);
    });
};

const getPaymentStatus = async (trackingNumber) => {
    const mockPaymentData = {
        '123456': {
            status: 'Paid',
            amount: '$45.99',
            date: '2024-02-01',
            method: 'Credit Card'
        },
        '789012': {
            status: 'Pending',
            amount: '$32.50',
            date: '2024-02-02',
            method: 'PayPal'
        }
    };

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const paymentInfo = mockPaymentData[trackingNumber];
            if (paymentInfo) {
                resolve(paymentInfo);
            } else {
                reject('Payment information not found.');
            }
        }, 1000);
    });
};
