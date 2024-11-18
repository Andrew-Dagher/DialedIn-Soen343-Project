// services/AddressValidationService.js

class AddressValidationService {
    static async validateAddresses(pickup, dropoff) {
      // First validate basic format
      this.validateAddressFormat(pickup, 'Pickup');
      this.validateAddressFormat(dropoff, 'Dropoff');
  
      // Check if addresses are the same
      if (this.isSameAddress(pickup, dropoff)) {
        throw new Error('Pickup and dropoff locations cannot be the same');
      }
  
      // Calculate approximate distance
      const distance = this.calculateApproximateDistance(pickup, dropoff);
  
      return {
        pickup: { formattedAddress: this.formatAddress(pickup) },
        dropoff: { formattedAddress: this.formatAddress(dropoff) },
        distance: distance
      };
    }
  
    static validateAddressFormat(address, locationType) {
      const requiredFields = ['country', 'address', 'city', 'zipcode'];
      
      // Check for missing or empty fields
      for (const field of requiredFields) {
        if (!address[field] || typeof address[field] !== 'string' || !address[field].trim()) {
          throw new Error(`${locationType}: ${field} is required and cannot be empty`);
        }
      }
  
      // Basic format validations
      if (!/^[A-Z]{2}$/i.test(address.country)) {
        throw new Error(`${locationType}: Country must be a 2-letter code (e.g., US, GB)`);
      }
  
      if (address.address.length < 5) {
        throw new Error(`${locationType}: Address is too short`);
      }
  
      if (address.city.length < 2) {
        throw new Error(`${locationType}: City name is too short`);
      }
    }
  
    static isSameAddress(addr1, addr2) {
      return (
        addr1.country.toUpperCase() === addr2.country.toUpperCase() &&
        addr1.address.toLowerCase() === addr2.address.toLowerCase() &&
        addr1.city.toLowerCase() === addr2.city.toLowerCase() &&
        addr1.zipcode === addr2.zipcode
      );
    }
  
    static formatAddress(address) {
      return `${address.address}, ${address.city}, ${address.zipcode}, ${address.country}`;
    }
  
    static calculateApproximateDistance(pickup, dropoff) {
      // Simple distance approximation
      if (pickup.country === dropoff.country) {
        // If same country, use zipcode difference as rough approximation
        const zipDiff = Math.abs(parseInt(pickup.zipcode) - parseInt(dropoff.zipcode));
        return Math.min(zipDiff * 0.5, 500); // Cap at 500km for same country
      } else {
        // If different countries, use fixed distances based on regions
        return 1000; // Default international distance
      }
    }
  }
  
  export default AddressValidationService;