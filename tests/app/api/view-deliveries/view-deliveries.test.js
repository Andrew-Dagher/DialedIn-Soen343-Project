/**
 * @jest-environment jsdom
 */


import { GET } from '../../../../app/api/view-deliveries/route';
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


describe('/api/view-deliveries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deliveries if all required information is present.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/view-deliveries?userId=7KREQv8oBhNIoy1FHVeTS',
    };

    const res = await GET(mockRequest);

    expect(res.status);
    if(res.status==400){
        expect(true).toBe(false)
    }
    
  }, 20000);

  it('should return an error if userID is missing.', async () => {
    const mockRequest = {
      url: 'http://localhost/api/view-deliveries',
    };

    const res = await GET(mockRequest);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ error: 'User ID is required'});
  });

});
