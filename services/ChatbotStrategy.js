// services/ChatbotStrategy.js

import ollama from 'ollama'; // Assuming ollama is the library used for LLaMA model interaction
import { handleUserTrackingRequest } from './TrackingService'; // Import the method from TrackingService

class ChatbotStrategy {
  async sendToLlamaModel(prompt) {
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
  }

  async getPackageLocation(trackingNumber) {
    try {
      const trackingData = await handleUserTrackingRequest(trackingNumber);
      if (trackingData.error) {
        throw new Error(trackingData.message);
      }
      console.log('Tracking data:', trackingData);
      return trackingData.locationDetails.description;
    } catch (error) {
      console.error(`Error getting package location: ${error.message}`);
      throw new Error('Failed to get package location');
    }
  }

  async getPaymentStatus(trackingNumber) {
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
  }
}

export default ChatbotStrategy;