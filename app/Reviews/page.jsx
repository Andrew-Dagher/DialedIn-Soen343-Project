'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

import {

  Loader2,

} from 'lucide-react';

export default function ReviewPage() {
  const { user, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);


  useEffect(() => {

    if (user) {
      const fetchReviews = async () => {
        const port = window.location.port;
        const response = await fetch(`http://localhost:${port}/api/view-reviews?userId=${user.sub}`);
        const data = await response.json();
        console.log('reviews:', data);

        setReviews(data);
      
    }
    fetchReviews();
  }
  }, [user]);

 

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-violet-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="rounded-xl border-2 border-gray-800 bg-transparent p-8 text-center">
          
          <h2 className="mt-4 text-lg font-medium text-gray-100">Please log in</h2>
          <p className="mt-2 text-gray-500">Authentication required to view reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 border-b-2 border-gray-800 pb-2">

        <h2 className="text-lg font-medium text-gray-100">My Reviews</h2>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {reviews.map(review => (
          <div
            key={review._id}
            className="rounded-xl border-2 border-gray-800 bg-transparent p-6 transition-all hover:border-gray-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-base font-medium text-gray-100">{review.orderID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-base font-medium text-gray-100">{review.rating} stars</p>
                </div>
                {review.comments &&(
                <div>
                  <p className="text-sm text-gray-500">Comments</p>
                  <p className="text-base font-medium text-gray-100">{review.comments}</p>
                </div>)}
              </div>
              
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
}
