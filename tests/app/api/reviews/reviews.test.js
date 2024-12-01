import { GET } from '../../../../app/api/reviews/route';
Response = class {
    constructor(body, init) {
      this.body = body;
      this.status = init.status;
      this.headers = init.headers;
    }
  
    async json() {
      return JSON.parse(this.body);
    }
  };
  

// Mock dependencies
jest.mock('../../../../utils/mongodb', () => jest.fn().mockResolvedValue({}));
jest.mock('../../../../models/Reviews', () => ({
  insertMany: jest.fn().mockResolvedValue([
    { userId: '7KREQv8oBhNIoy1FHVeTS', orderID: '7KREQv8oBhNIoTS', rating: 5 },
  ]),
}));

describe('/api/reviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a review if all required information is present.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/reviews?userId=7KREQv8oBhNIoy1FHVeTS&orderID=7KREQv8oBhNIoTS&rating=5',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([{ userId: '7KREQv8oBhNIoy1FHVeTS', orderID: '7KREQv8oBhNIoTS', rating: 5 }]);
  });

  it('should create a review if all required information is present as well as a comment.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/reviews?userId=7KREQv8oBhNIoy1FHVeTS&orderID=7KREQv8oBhNIoTS&rating=5&comment=excellent',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([{ userId: '7KREQv8oBhNIoy1FHVeTS', orderID: '7KREQv8oBhNIoTS', rating: 5 }]);
  });

  it('should throw an error if userId is not present.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/reviews?orderID=7KREQv8oBhNIoTS&rating=5',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'User ID, rating, and orderID are required' });
  });
  it('should throw an error if orderId is not present.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/reviews?userId=7KREQv8oBhNIoTS&rating=5',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'User ID, rating, and orderID are required' });
  });

  it('should throw an error if rating is not present.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/reviews?userId=7KREQv8oBhNIoTS&orderID=7KREQv8oBhNIoTSVV',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'User ID, rating, and orderID are required' });
  });
});
