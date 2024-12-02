/**
 * @jest-environment node
 */

import { POST as getPoints } from '../../../../app/api/get-points/route';
import { POST as getCoupons } from '../../../../app/api/get-coupons/route';
import UserPoints from '../../../../models/UserPoints';
import Coupon from '../../../../models/Coupons';

// Mock utils/mongodb.js to bypass MONGODB_URI check
jest.mock('../../../../utils/mongodb.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../../../models/UserPoints.js');
jest.mock('../../../../models/Coupons.js');

describe('Point System API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/get-points/route', () => {
    it('should return 400 if user ID is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      };

      const res = await getPoints(mockRequest);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Missing user ID' });
    });

    it('should return points balance if user ID is provided', async () => {
      const mockRequestData = {
        userId: 'user123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockRequestData),
      };

      UserPoints.findOne.mockResolvedValue({
        userId: 'user123',
        pointsBalance: 200,
      });

      const res = await getPoints(mockRequest);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ pointsBalance: 200 });

      expect(UserPoints.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should return 0 points if user points account is not found', async () => {
      const mockRequestData = {
        userId: 'user123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockRequestData),
      };

      UserPoints.findOne.mockResolvedValue(null);

      const res = await getPoints(mockRequest);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ pointsBalance: 0 });

      expect(UserPoints.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should return 500 on points retrieval failure', async () => {
      const mockRequestData = {
        userId: 'user123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockRequestData),
      };

      UserPoints.findOne.mockRejectedValue(new Error('Database error'));

      const res = await getPoints(mockRequest);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('/api/get-coupons/route', () => {
    it('should return 400 if user ID is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      };

      const res = await getCoupons(mockRequest);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Missing user ID' });
    });

    it('should return coupons if user ID is provided', async () => {
      const mockRequestData = {
        userId: 'user123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockRequestData),
      };

      Coupon.find.mockResolvedValue([
        {
          couponID: 'coupon123',
          userId: 'user123',
          discountPercentage: 10,
          isUsed: false,
        },
      ]);

      const res = await getCoupons(mockRequest);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        coupons: [
          {
            couponID: 'coupon123',
            userId: 'user123',
            discountPercentage: 10,
            isUsed: false,
          },
        ],
      });

      expect(Coupon.find).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should return 500 on coupons retrieval failure', async () => {
      const mockRequestData = {
        userId: 'user123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockRequestData),
      };

      Coupon.find.mockRejectedValue(new Error('Database error'));

      const res = await getCoupons(mockRequest);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Internal Server Error' });
    });
  });
});
