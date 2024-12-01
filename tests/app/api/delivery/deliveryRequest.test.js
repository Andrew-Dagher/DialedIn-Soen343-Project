/**
 * @jest-environment node
 */

import { POST } from '../../../../app/api/delivery/route';
import OrderDelivery from '../../../../models/OrderDelivery';
import Tracking from '../../../../models/Tracking';
import UserPoints from '../../../../models/UserPoints';
import Coupon from '../../../../models/Coupons';

// Mock utils/mongodb.js to bypass MONGODB_URI check
jest.mock('../../../../utils/mongodb.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../../models/OrderDelivery.js');
jest.mock('../../../../models/Tracking.js');
jest.mock('../../../../models/UserPoints.js');
jest.mock('../../../../models/Coupons.js');

describe('/api/delivery/route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if delivery details are missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        contactName: 'John Doe',
        phoneNumber: '1234567890',
        email: 'john@example.com',
      }),
    };

    const res = await POST(mockRequest);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: 'All fields are required' });
  });

  it('should create delivery request successfully', async () => {
    const mockRequestData = {
      contactName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      billingAddress: '123 Main St',
      billingCity: 'City',
      billingZipcode: '12345',
      billingCountry: 'Country',
      billingCoordinates: { lat: 1.23, lng: 4.56 },
      weight: 10,
      length: 5,
      width: 5,
      height: 5,
      pickupAddress: 'Warehouse 1',
      pickupCity: 'City',
      pickupZipcode: '12345',
      pickupCountry: 'Country',
      pickupCoordinates: { lat: 7.89, lng: 0.12 },
      pickupFormattedAddress: 'Warehouse 1, City, Country',
      dropoffAddress: 'Customer Home',
      dropoffCity: 'City',
      dropoffZipcode: '54321',
      dropoffCountry: 'Country',
      dropoffCoordinates: { lat: 3.21, lng: 6.54 },
      dropoffFormattedAddress: 'Customer Home, City, Country',
      shippingMethod: 'Express',
      userId: 'user123',
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestData),
    };

    OrderDelivery.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(),
    }));
    Tracking.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(),
    }));
    UserPoints.findOneAndUpdate.mockResolvedValue();
    Coupon.findOneAndUpdate.mockResolvedValue({});

    const res = await POST(mockRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Temporary delivery request created', requestID: expect.any(String) });

    expect(OrderDelivery).not.toHaveBeenCalled(); // Delivery not saved yet; just a temporary request
    expect(Tracking).not.toHaveBeenCalled(); // Tracking is not initiated until payment
  });

  it('should return 500 on request creation failure', async () => {
    const mockRequestData = {
      contactName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      billingAddress: '123 Main St',
      billingCity: 'City',
      billingZipcode: '12345',
      billingCountry: 'Country',
      billingCoordinates: { lat: 1.23, lng: 4.56 },
      weight: 10,
      length: 5,
      width: 5,
      height: 5,
      pickupAddress: 'Warehouse 1',
      pickupCity: 'City',
      pickupZipcode: '12345',
      pickupCountry: 'Country',
      pickupCoordinates: { lat: 7.89, lng: 0.12 },
      pickupFormattedAddress: 'Warehouse 1, City, Country',
      dropoffAddress: 'Customer Home',
      dropoffCity: 'City',
      dropoffZipcode: '54321',
      dropoffCountry: 'Country',
      dropoffCoordinates: { lat: 3.21, lng: 6.54 },
      dropoffFormattedAddress: 'Customer Home, City, Country',
      shippingMethod: 'Express',
      userId: 'user123',
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestData),
    };

    OrderDelivery.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Database error')),
    }));

    const res = await POST(mockRequest);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal Server Error' });
  });

  it('should enforce singleton instance of DeliveryRequestService', () => {
    const DeliveryRequestService = require('../../../../services/DeliveryRequestService.js').default;
    expect(DeliveryRequestService.getInstance()).toBe(DeliveryRequestService.getInstance());
  });
});
