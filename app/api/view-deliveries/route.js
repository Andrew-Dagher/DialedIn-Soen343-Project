import connectToDatabase from '../../../utils/mongodb';
import OrderDelivery from '../../../models/OrderDelivery';

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        await connectToDatabase()
        const deliveries = await OrderDelivery.find({ 'userId':userId }).exec();
        console.log(deliveries)
        return new Response(JSON.stringify(deliveries), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Failed to fetch deliveries' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
