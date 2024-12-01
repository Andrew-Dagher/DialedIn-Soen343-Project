import { POST } from '../../../../app/api/track/[packageId]/route';
import connectToDatabase from '../../../../utils/mongodb';
import { handleUserTrackingRequest } from '../../../../services/TrackingService';

jest.mock('../../../../utils/mongodb');
jest.mock('../../../../services/TrackingService');

describe('POST /api/track/[packageId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if packageId is missing', async () => {
    const mockRequest = {
      nextUrl: {
        pathname: '/api/track/'
      }
    };

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'PackageId is required' });
  });

  it('should return 400 if tracking service returns an error', async () => {
    connectToDatabase.mockResolvedValueOnce();
    handleUserTrackingRequest.mockResolvedValueOnce({ error: 'Tracking not found' });

    const mockRequest = {
      nextUrl: {
        pathname: '/api/track/12345'
      }
    };

    const response = await POST(mockRequest);

    expect(connectToDatabase).toHaveBeenCalled();
    expect(handleUserTrackingRequest).toHaveBeenCalledWith('12345');
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Tracking not found' });
  });

  it('should return 200 with tracking data if successful', async () => {
    const mockTrackingData = {
      _id: 'test-id',
      packageId: '12345',
      clientContact: 'test@example.com',
      clientName: 'John Doe',
      clientPhone: '+1234567890',
      locationDetails: { location: 'Warehouse', description: 'Ready for delivery' },
      deliveryProgress: 80
    };

    connectToDatabase.mockResolvedValueOnce(); // Mock database connection
    handleUserTrackingRequest.mockResolvedValueOnce(mockTrackingData);

    const mockRequest = {
      nextUrl: {
        pathname: '/api/track/12345'
      }
    };

    const response = await POST(mockRequest);

    expect(connectToDatabase).toHaveBeenCalled();
    expect(handleUserTrackingRequest).toHaveBeenCalledWith('12345');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'Tracking updated for packageId: 12345',
      data: mockTrackingData
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    connectToDatabase.mockImplementationOnce(() => {
      throw new Error('Database connection failed');
    });

    const mockRequest = {
      nextUrl: {
        pathname: '/api/track/12345'
      }
    };

    const response = await POST(mockRequest);

    expect(connectToDatabase).toHaveBeenCalled();
    expect(handleUserTrackingRequest).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to handle tracking request' });
  });
});
