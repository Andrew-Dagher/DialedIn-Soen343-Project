import connectToDatabase from '../../../utils/mongodb';
import Review from '../../../models/Reviews';

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
        const reviews = await Review.find({ 'userId':userId }).exec();
        console.log(reviews)
        return new Response(JSON.stringify(reviews), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
