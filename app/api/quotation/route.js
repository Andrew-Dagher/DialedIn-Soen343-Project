import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { distance, weight } = await request.json();

        if (typeof distance !== 'number' || typeof weight !== 'number') {
            return NextResponse.json({ error: 'Invalid distance or weight' }, { status: 400 });
        }

        const basePrice = 30;
        const weightCost = 0.5 * weight; // $0.5 per kg
        const distanceCost = 0.2 * distance; // $0.2 per km
        const estimatedCost = basePrice + weightCost + distanceCost;

        return NextResponse.json({ estimatedCost });
    } catch (error) {
        console.error("Failed to calculate quotation:", error);
        return NextResponse.json({ error: 'Failed to calculate quotation' }, { status: 500 });
    }
}
