// services/QuotationService.js

class QuotationService {
  static getQuote({ weight, dimensions, pickup, dropoff, shippingMethod }) {
    // Input validation
    if (weight <= 0) {
      throw new Error('Weight must be greater than 0');
    }

    if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
      throw new Error('All dimensions must be greater than 0');
    }

    // Maximum weight validation (example: 100kg limit)
    if (weight > 100) {
      throw new Error('Weight exceeds maximum limit of 100kg');
    }

    // Maximum dimension validation (example: 200cm per side)
    if (dimensions.length > 200 || dimensions.width > 200 || dimensions.height > 200) {
      throw new Error('Package dimensions exceed maximum limit of 200cm per side');
    }

    // Validate shipping method
    if (!['express', 'standard'].includes(shippingMethod)) {
      throw new Error('Invalid shipping method. Must be either "express" or "standard"');
    }

    // Required fields validation
    const requiredFields = {
      pickup: ['country', 'address', 'zipcode', 'city'],
      dropoff: ['country', 'address', 'zipcode', 'city']
    };

    for (const [location, fields] of Object.entries(requiredFields)) {
      for (const field of fields) {
        if (!eval(location)[field]) {
          throw new Error(`Missing required field: ${location}.${field}`);
        }
      }
    }

    // Basic pricing calculation
    const baseRate = shippingMethod === 'express' ? 50 : 30;
    
    // Calculate volume in cubic centimeters
    const volume = dimensions.length * dimensions.width * dimensions.height;
    
    // Weight factor (price per kg)
    const weightCost = weight * 2;
    
    // Volume factor (price per 1000 cubic cm)
    const volumeCost = (volume / 1000) * 1.5;
    
    // Distance factor (simplified - just checking if same country)
    const distanceFactor = pickup.country === dropoff.country ? 1 : 2;
    
    // Calculate total cost
    const totalCost = (baseRate + weightCost + volumeCost) * distanceFactor;
    
    // Round to 2 decimal places
    return Math.round(totalCost * 100) / 100;
  }
}

export default QuotationService;