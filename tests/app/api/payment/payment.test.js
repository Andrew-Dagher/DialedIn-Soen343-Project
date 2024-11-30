/**
 * @jest-environment node
 */

import { POST } from '../../../../app/api/payment/route';
import PaymentService from '../../../../services/PaymentService';
import OrderDelivery from '../../../../models/OrderDelivery';
import Tracking from '../../../../models/Tracking';
import UserPoints from '../../../../models/UserPoints';
import Coupon from '../../../../models/Coupons';

// Mock utils/mongodb.js to bypass MONGODB_URI check
jest.mock('../../../../utils/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../../services/PaymentService');
jest.mock('../../../../models/OrderDelivery');
jest.mock('../../../../models/Tracking');
jest.mock('../../../../models/UserPoints');
jest.mock('../../../../models/Coupons');

describe('/api/payment/route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if requestID is missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        paymentInfo: {},
        amount: 100,
        deliveryDetails: {},
      }),
    };

    const res = await POST(mockRequest);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Missing request ID' });
  });

  it('should process payment successfully', async () => {
    const mockRequestData = {
      requestID: '123',
      paymentInfo: { paymentMethod: 'credit_card' },
      amount: 100,
      deliveryDetails: {
        contactName: 'John Doe',
        phoneNumber: '1234567890',
        email: 'johndoe@example.com',
        billingAddress: '123 Main St',
        billingCity: 'City',
        billingZipcode: '12345',
        billingCountry: 'Country',
        billingCoordinates: { lat: 1.23, lng: 4.56 },
        billingFormattedAddress: '123 Main St, City, Country',
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
      },
      couponID: 'coupon123',
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestData),
    };

    const mockPayment = { status: 'completed' };
    PaymentService.mockImplementation(() => ({
      processPayment: jest.fn().mockResolvedValue(mockPayment),
    }));

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
    expect(await res.json()).toEqual({ success: true, payment: mockPayment });

    expect(PaymentService).toHaveBeenCalledWith('credit_card');
    expect(OrderDelivery).toHaveBeenCalled();
    expect(Tracking).toHaveBeenCalled();
    expect(UserPoints.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user123' },
      { $inc: { pointsBalance: 100 } },
      { new: true, upsert: true }
    );
    expect(Coupon.findOneAndUpdate).toHaveBeenCalledWith(
      { couponID: 'coupon123', userId: 'user123' },
      { $set: { isUsed: true } },
      { new: true }
    );
  });

  it('should return 500 on payment failure', async () => {
    const mockRequestData = {
      requestID: '123',
      paymentInfo: { paymentMethod: 'credit_card' },
      amount: 100,
      deliveryDetails: {},
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestData),
    };

    PaymentService.mockImplementation(() => ({
      processPayment: jest.fn().mockRejectedValue(new Error('Payment failed')),
    }));

    const res = await POST(mockRequest);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal Server Error' });

    expect(PaymentService).toHaveBeenCalledWith('credit_card');
  });
});
