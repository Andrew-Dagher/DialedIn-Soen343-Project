import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const ReviewsComponent = () => {
  const { user, isLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchReviews = async () => {
        const port = window.location.port;
        const response = await fetch(`http://localhost:${port}/api/view-reviews?userId=${user.sub}`);
        const data = await response.json();
        setReviews(data);
      };
      fetchReviews();
    }
  }, [user]);

  const StarDisplay = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(value => (
        <Star
          key={value}
          size={16}
          className={value <= rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-500'}
        />
      ))}
      <span className="ml-1.5 text-sm text-gray-400">({rating}/5)</span>
    </div>
  );

  const toggleExpand = reviewId => {
    setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
  };

  return (
    <div className="rounded-xl border-2 border-gray-800 bg-gray-950">
      {/* Header */}
      <div className="border-b-2 border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-medium text-gray-100">Reviews History</h3>
          </div>
          <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-400">{reviews.length} reviews</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-800">
        {reviews.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No reviews yet</p>
            <p className="text-sm text-gray-500">Your delivery reviews will appear here</p>
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review._id}
              className="cursor-pointer border-b border-gray-800 transition-colors last:border-b-0 hover:bg-gray-800/10">
              <div className="p-4">
                <div className="flex flex-col gap-3">
                  {/* Order ID and Expand Icon */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="mb-1 block text-xs text-gray-500">Order ID</span>
                      <span className="font-mono text-sm text-gray-100">#{review.orderID}</span>
                    </div>
                    <button onClick={() => toggleExpand(review._id)} className="focus:outline-none">
                      {expandedReviewId === review._id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <span className="mb-1 block text-xs text-gray-500">Rating</span>
                    <StarDisplay rating={review.rating} />
                  </div>

                  {/* Comment */}
                  <div>
                    <span className="mb-1 block text-xs text-gray-500">Comment</span>
                    {review.comments ? (
                      <div className="relative">
                        <p
                          className={`text-sm text-gray-100 ${
                            expandedReviewId === review._id ? 'break-words' : 'truncate'
                          }`}>
                          {review.comments}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-500">No comment provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsComponent;
