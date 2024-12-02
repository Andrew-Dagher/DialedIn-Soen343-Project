// services/QuotationService.js

class QuotationService {
  static GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  
  static PRICING_CONSTANTS = {
    // Base rates for different shipping methods (reduced by ~40%)
    BASE_RATES: {
      standard: 12.00,  // Was 20.00
      express: 22.00    // Was 35.00
    },
    
    // Weight pricing tiers (in kg) (reduced by ~30%)
    WEIGHT_TIERS: [
      { maxWeight: 5, pricePerKg: 1.40 },    // Was 2.00
      { maxWeight: 20, pricePerKg: 1.20 },   // Was 1.75
      { maxWeight: 50, pricePerKg: 1.00 },   // Was 1.50
      { maxWeight: 100, pricePerKg: 0.80 }   // Was 1.25
    ],
    
    // Volume pricing (reduced by ~40%)
    VOLUME_RATES: {
      standard: 0.45,   // Was 0.75
      express: 0.60     // Was 1.00
    },
    
    // Distance pricing (reduced by ~50%)
    DISTANCE_RATES: {
      standard: {
        base: 0.01,          // Was 0.20
        international: 0.03   // Was 0.35
      },
      express: {
        base: 0.02,          // Was 0.30
        international: 0.04   // Was 0.50
      }
    },
    
    // Reduced surcharges
    FUEL_SURCHARGE: 0.03,    // Was 0.05 (5% to 3%)
    INSURANCE_RATE: 0.005,   // Was 0.01 (1% to 0.5%)
    
    // Reduced express multiplier
    EXPRESS_MULTIPLIER: 1.2,  // Was 1.3 (30% to 20%)
    
    // Size limits remain the same
    SIZE_LIMITS: {
      minLength: 10,
      maxLength: 200,
      minWidth: 10,
      maxWidth: 200,
      minHeight: 10,
      maxHeight: 200
    },
  
    // Weight limits remain the same
    WEIGHT_LIMITS: {
      min: 0.1,
      max: 100
    },
  
    // Reduced minimum charge
    MINIMUM_CHARGE: 10.00  // Was 15.00
  };

  static async getQuote({ 
    weight, 
    dimensions, 
    pickup, 
    dropoff, 
    shippingMethod, 
    declaredValue = 0,
    includeBreakdown = false 
  }) {
    try {
      // Validate basic inputs first
      this.validateInputs({ weight, dimensions, shippingMethod, declaredValue });
      
      // Validate addresses and get geocoded data
      const [pickupGeocode, dropoffGeocode] = await Promise.all([
        this.geocodeAddress(pickup),
        this.geocodeAddress(dropoff)
      ]);

      // Check if addresses are the same
      if (this.isSameLocation(pickupGeocode, dropoffGeocode)) {
        throw new Error('Pickup and dropoff locations cannot be the same');
      }

      // Calculate the actual driving distance
      const distance = await this.calculateDistance(pickupGeocode, dropoffGeocode);
      const isInternational = pickupGeocode.country !== dropoffGeocode.country;

      // Calculate pricing
      const pricing = this.calculatePrice({
        weight,
        dimensions,
        distance,
        shippingMethod,
        declaredValue,
        isInternational
      });

      return {
        total: pricing.totalCost,
        breakdown: pricing.breakdown,
        distance,
        addresses: {
          pickup: pickupGeocode.formattedAddress,
          dropoff: dropoffGeocode.formattedAddress
        },
        estimatedDelivery: this.calculateEstimatedDeliveryTime(
          distance,
          shippingMethod,
          isInternational
        )
      };
    } catch (error) {
      throw new Error(`Quotation failed: ${error.message}`);
    }
  }

  static validateInputs({ weight, dimensions, shippingMethod, declaredValue }) {
    if (!['standard', 'express'].includes(shippingMethod)) {
      throw new Error('Please select either standard or express shipping');
    }

    if (!weight || isNaN(weight)) {
      throw new Error('Please enter a valid weight');
    }
    
    if (weight < this.PRICING_CONSTANTS.WEIGHT_LIMITS.min || 
        weight > this.PRICING_CONSTANTS.WEIGHT_LIMITS.max) {
      throw new Error(
        `Weight must be between ${this.PRICING_CONSTANTS.WEIGHT_LIMITS.min}kg and ` +
        `${this.PRICING_CONSTANTS.WEIGHT_LIMITS.max}kg`
      );
    }

    const { length, width, height } = dimensions;
    const { SIZE_LIMITS } = this.PRICING_CONSTANTS;

    for (const [dimension, value] of Object.entries({ length, width, height })) {
      if (!value || isNaN(value)) {
        throw new Error(`Please enter a valid ${dimension}`);
      }
      
      const min = SIZE_LIMITS[`min${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`];
      const max = SIZE_LIMITS[`max${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`];
      
      if (value < min || value > max) {
        throw new Error(`${dimension} must be between ${min}cm and ${max}cm`);
      }
    }

    if (declaredValue < 0) {
      throw new Error('Declared value cannot be negative');
    }
  }

  static async geocodeAddress(address) {
    try {
      const formattedAddress = `${address.address}, ${address.city}, ${address.zipcode}, ${address.country}`;
      const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
      url.searchParams.append('address', formattedAddress);
      url.searchParams.append('key', this.GOOGLE_MAPS_API_KEY);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Failed to validate address: ${data.status}`);
      }

      const result = data.results[0];
      const components = result.address_components;
      
      const countryComponent = components.find(c => c.types.includes('country'));
      const country = countryComponent ? countryComponent.short_name : '';

      return {
        formattedAddress: result.formatted_address,
        location: result.geometry.location,
        country,
        placeId: result.place_id
      };
    } catch (error) {
      throw new Error(`Address validation failed: ${error.message}`);
    }
  }

  static isSameLocation(loc1, loc2) {
    const lat1 = loc1.location.lat;
    const lng1 = loc1.location.lng;
    const lat2 = loc2.location.lat;
    const lng2 = loc2.location.lng;

    const distance = this.calculateHaversineDistance(
      { lat: lat1, lng: lng1 },
      { lat: lat2, lng: lng2 }
    );

    return distance < 0.1; // Less than 100 meters
  }

  static async calculateDistance(origin, destination) {
    try {
      // Use coordinates directly if available
      const originStr = origin.coordinates ? 
        `${origin.coordinates.lat},${origin.coordinates.lng}` :
        `${origin.location.lat},${origin.location.lng}`;
        
      const destinationStr = destination.coordinates ? 
        `${destination.coordinates.lat},${destination.coordinates.lng}` :
        `${destination.location.lat},${destination.location.lng}`;
  
      const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
      url.searchParams.append('origins', originStr);
      url.searchParams.append('destinations', destinationStr);
      url.searchParams.append('key', this.GOOGLE_MAPS_API_KEY);
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status !== 'OK') {
        throw new Error('Failed to calculate distance');
      }
  
      const distance = data.rows[0].elements[0].distance.value / 1000;
      return Math.round(distance);
  
    } catch (error) {
      console.error('Distance calculation error, falling back to straight-line distance');
      const point1 = origin.coordinates || origin.location;
      const point2 = destination.coordinates || destination.location;
      return this.calculateHaversineDistance(point1, point2);
    }
  }
  

  static calculateHaversineDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  static toRad(value) {
    return value * Math.PI / 180;
  }

  static calculatePrice({ 
    weight, 
    dimensions, 
    distance, 
    shippingMethod, 
    declaredValue = 0,
    isInternational = false 
  }) {
    let breakdown = {};
    let totalCost = 0;

    // Base rate
    const baseRate = this.PRICING_CONSTANTS.BASE_RATES[shippingMethod];
    breakdown.baseRate = baseRate;
    totalCost += baseRate;

    // Weight cost
    const weightCost = this.calculateWeightCost(weight);
    breakdown.weightCost = weightCost;
    totalCost += weightCost;

    // Volume cost
    const volume = dimensions.length * dimensions.width * dimensions.height;
    const volumeRate = this.PRICING_CONSTANTS.VOLUME_RATES[shippingMethod];
    const volumeCost = (volume / 1000) * volumeRate;
    breakdown.volumeCost = volumeCost;
    totalCost += volumeCost;

    // Distance cost
    const distanceRate = isInternational 
      ? this.PRICING_CONSTANTS.DISTANCE_RATES[shippingMethod].international
      : this.PRICING_CONSTANTS.DISTANCE_RATES[shippingMethod].base;
    const distanceCost = distance * distanceRate;
    breakdown.distanceCost = distanceCost;
    totalCost += distanceCost;

    // Fuel surcharge
    const fuelSurcharge = totalCost * this.PRICING_CONSTANTS.FUEL_SURCHARGE;
    breakdown.fuelSurcharge = fuelSurcharge;
    totalCost += fuelSurcharge;

    // Insurance cost
    if (declaredValue > 0) {
      const insuranceCost = declaredValue * this.PRICING_CONSTANTS.INSURANCE_RATE;
      breakdown.insuranceCost = insuranceCost;
      totalCost += insuranceCost;
    }

    // Express multiplier
    if (shippingMethod === 'express') {
      const expressMultiplierCost = totalCost * (this.PRICING_CONSTANTS.EXPRESS_MULTIPLIER - 1);
      breakdown.expressMultiplierCost = expressMultiplierCost;
      totalCost *= this.PRICING_CONSTANTS.EXPRESS_MULTIPLIER;
    }

    // Minimum charge
    if (totalCost < this.PRICING_CONSTANTS.MINIMUM_CHARGE) {
      breakdown.minimumChargeAdjustment = 
        this.PRICING_CONSTANTS.MINIMUM_CHARGE - totalCost;
      totalCost = this.PRICING_CONSTANTS.MINIMUM_CHARGE;
    }

    totalCost = Math.round(totalCost * 100) / 100;

    return {
      totalCost,
      breakdown: {
        ...breakdown,
        totalBeforeTax: totalCost,
        total: totalCost
      }
    };
  }

  static calculateWeightCost(weight) {
    let remainingWeight = weight;
    let totalWeightCost = 0;

    for (const tier of this.PRICING_CONSTANTS.WEIGHT_TIERS) {
      if (remainingWeight <= 0) break;
      
      const weightInThisTier = Math.min(remainingWeight, tier.maxWeight);
      totalWeightCost += weightInThisTier * tier.pricePerKg;
      remainingWeight -= weightInThisTier;
    }

    return totalWeightCost;
  }

  static calculateEstimatedDeliveryTime(distance, shippingMethod, isInternational) {
    const baseDeliveryTimes = {
      standard: {
        domestic: {
          min: 2,
          max: 4
        },
        international: {
          min: 5,
          max: 10
        }
      },
      express: {
        domestic: {
          min: 1,
          max: 2
        },
        international: {
          min: 3,
          max: 5
        }
      }
    };

    const deliveryTime = baseDeliveryTimes[shippingMethod][isInternational ? 'international' : 'domestic'];
    const additionalDays = Math.floor(distance / 1000);
    
    return {
      minDays: deliveryTime.min,
      maxDays: deliveryTime.max + additionalDays
    };
  }
}

export default QuotationService;
