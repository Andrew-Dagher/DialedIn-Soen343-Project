// services/ChatbotStrategy.js

import ollama from 'ollama'; // Assuming ollama is the library used for LLaMA model interaction
import { handleUserTrackingRequest } from './TrackingService';
import QuotationService from './QuotationService';

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
      return trackingData.locationDetails.description;
    } catch (error) {
      console.error(`Error getting package location: ${error.message}`);
      throw new Error('Failed to get package location');
    }
  }

  async parseStructuredResponse(response) {
    try {
      const weightMatch = response.match(/Weight:\s*(\d+|\bnull\b)\s*kg/i);
      const dimensionsMatch = response.match(/Dimensions:\s*(\d+|\bnull\b)\s*x\s*(\d+|\bnull\b)\s*x\s*(\d+|\bnull\b)\s*cm/i);
      const pickupMatch = response.match(/Pickup Address:\s*(.+?)(?=\n|$)/i);
      const dropoffMatch = response.match(/Dropoff Address:\s*(.+?)(?=\n|$)/i);
      const shippingMethodMatch = response.match(/Shipping Method:\s*(.+?)(?=\n|$)/i);

      const weight = weightMatch ? parseFloat(weightMatch[1]) : null;
      const dimensions = dimensionsMatch
        ? {
            length: parseFloat(dimensionsMatch[1]),
            width: parseFloat(dimensionsMatch[2]),
            height: parseFloat(dimensionsMatch[3]),
          }
        : null;
      const pickup = pickupMatch ? pickupMatch[1].trim() : null;
      const dropoff = dropoffMatch ? dropoffMatch[1].trim() : null;
      const shippingMethod = shippingMethodMatch ? shippingMethodMatch[1].trim().toLowerCase() : null;

      if (
        weight != null &&
        dimensions &&
        dimensions.length != null &&
        dimensions.width != null &&
        dimensions.height != null &&
        pickup &&
        dropoff &&
        shippingMethod
      ) {
        return { weight, dimensions, pickup, dropoff, shippingMethod };
      } else {
        throw new Error('Missing or invalid fields in the AI response.');
      }
    } catch (error) {
      console.error('Error parsing structured response:', error);
      throw new Error('Failed to parse structured response.');
    }
  }

  async extractDetails(message) {
    const prompt = `
      Based on the user's input: "${message}", extract the following details in text format:
        Weight: <weight> kg
        Dimensions: <length> x <width> x <height> cm
        Pickup Address: <pickup_address>
        Dropoff Address: <dropoff_address>
        Shipping Method: <shipping_method>
      If a detail is missing, include "null" in its place.
    `;

    const response = await this.sendToLlamaModel(prompt);
    return await this.parseStructuredResponse(response);
  }

  async getQuotation(details) {
    return await QuotationService.getQuote(details);
  }
}

export default ChatbotStrategy;
