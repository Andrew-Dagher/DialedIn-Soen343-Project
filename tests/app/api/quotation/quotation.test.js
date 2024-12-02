import { POST } from '../../../../app/api/quotation/route';
import { NextResponse } from 'next/server';
import QuotationService from '../../../../services//QuotationService';

// app/api/quotation/route.test.js


jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn()
    }
}));

jest.mock('../../../../services//QuotationService', () => ({
    PRICING_CONSTANTS: {
        SIZE_LIMITS: {
            minLength: 10,
            maxLength: 100,
            minWidth: 10,
            maxWidth: 100,
            minHeight: 10,
            maxHeight: 100
        },
        WEIGHT_LIMITS: {
            min: 1,
            max: 50
        }
    },
    getQuote: jest.fn()
}));

describe('POST /api/quotation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({})
        };

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Please fill in all required fields' },
            { status: 400 }
        );
    });

    it('should return 400 if dimensions are invalid', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                weight: 10,
                dimensions: { length: 'invalid', width: 20, height: 30 },
                pickup: { coordinates: [0, 0] },
                dropoff: { coordinates: [0, 0] },
                shippingMethod: 'standard'
            })
        };

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Please enter a valid length' },
            { status: 400 }
        );
    });

    it('should return 400 if weight is invalid', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                weight: 'invalid',
                dimensions: { length: 20, width: 20, height: 30 },
                pickup: { coordinates: [0, 0] },
                dropoff: { coordinates: [0, 0] },
                shippingMethod: 'standard'
            })
        };

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Please enter a valid weight' },
            { status: 400 }
        );
    });

    it('should return 400 if addresses are invalid', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                weight: 10,
                dimensions: { length: 20, width: 20, height: 30 },
                pickup: {},
                dropoff: {},
                shippingMethod: 'standard'
            })
        };

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Please select valid addresses from the suggestions' },
            { status: 400 }
        );
    });

    it('should return 200 with quote data if all inputs are valid', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                weight: 10,
                dimensions: { length: 20, width: 20, height: 30 },
                pickup: { coordinates: [0, 0], formatted_address: 'Pickup Address' },
                dropoff: { coordinates: [0, 0], formatted_address: 'Dropoff Address' },
                shippingMethod: 'standard'
            })
        };

        const quote = {
            total: 100,
            breakdown: {},
            distance: 10,
            estimatedDelivery: '2023-10-10',
            addresses: {
                pickup: 'Pickup Address',
                dropoff: 'Dropoff Address'
            }
        };

        QuotationService.getQuote.mockResolvedValue(quote);

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({
            success: true,
            data: {
                estimatedCost: quote.total,
                breakdown: quote.breakdown,
                distance: quote.distance,
                estimatedDelivery: quote.estimatedDelivery,
                addresses: {
                    pickup: quote.addresses.pickup,
                    dropoff: quote.addresses.dropoff
                }
            }
        });
    });

    it('should return 400 if there is an error in the service', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                weight: 10,
                dimensions: { length: 20, width: 20, height: 30 },
                pickup: { coordinates: [0, 0], formatted_address: 'Pickup Address' },
                dropoff: { coordinates: [0, 0], formatted_address: 'Dropoff Address' },
                shippingMethod: 'standard'
            })
        };

        QuotationService.getQuote.mockRejectedValue(new Error('Quotation failed: Service error'));

        await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith(
            { error: 'Service error' },
            { status: 400 }
        );
    });
});