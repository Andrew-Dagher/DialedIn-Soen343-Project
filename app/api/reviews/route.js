import connectToDatabase from '../../../utils/mongodb';
import Review from '../../../models/Reviews';

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const rating = searchParams.get('rating');
    const orderID = searchParams.get('orderID')
    const comment = searchParams.get('comment')



    if (!userId || !orderID || !rating) {
        return new Response(JSON.stringify({ error: 'User ID, rating, and orderID are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        await connectToDatabase()
        const review = await Review.insertMany({ 'orderID':orderID,'userId':userId, "rating":rating, "comments":comment })
        console.log(review)
        return new Response(JSON.stringify(review), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Failed to create review' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
