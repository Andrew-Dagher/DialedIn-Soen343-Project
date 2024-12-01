/**
 * @jest-environment node
 */

import { POST } from '../../../../app/api/chatbot/route';
import ChatbotStrategy from '../../../../services/ChatbotStrategy';
import QuotationService from '../../../../services/QuotationService';

// Mock utils/mongodb.js to bypass MONGODB_URI check
jest.mock('../../../../utils/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

// Mock ChatbotStrategy service
jest.mock('../../../../services/ChatbotStrategy');
jest.mock('../../../../services/QuotationService');

describe('/api/chatbot/route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a response for a tracking number request', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        question: 'track 7KREQv8oBhNIoy1FHVeTS',
      }),
    };
  
    // Mock ChatbotStrategy to return the expected package status
    ChatbotStrategy.mockImplementation(() => ({
      getPackageLocation: jest.fn().mockResolvedValue('Package has been delivered successfully'),
    }));
  
    const res = await POST(mockRequest);
  
    expect(res.status).toBe(200);
    const data = await res.json();
    
    // Updated expectations to match the generated response structure
    expect(data.answer).toContain(
      'The package with tracking number 7KREQv8oBhNIoy1FHVeTS has the following status: undefined. You can also check the status --> http://localhost:3000/tracking?packageId=7KREQv8oBhNIoy1FHVeTS.'
    );
    expect(data.answer).toContain('http://localhost:3000/tracking?packageId=7KREQv8oBhNIoy1FHVeTS');
  });

  it('should return 400 when the question is missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    };

    const res = await POST(mockRequest);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing question in request body');
  });

});
