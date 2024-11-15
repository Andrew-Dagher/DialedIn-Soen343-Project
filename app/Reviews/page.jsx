'use client';

import { useState } from 'react';

const ReviewPage = () => {
  const [review, setReview] = useState('');

  const handleInputChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submit functionality
    alert('Submit functionality will be added here.');
  };

  const inputClassName =
    'w-full border-gray-800 border-2 rounded-xl bg-transparent p-3 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:border-violet-400 focus:outline-none';
  const buttonClassName =
    'rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700';

  return (
    <div className="mx-4 sm:mx-6 md:mx-8 mt-6 sm:mt-8 md:mt-10 rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-100 text-center">
          Leave a Review
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="Write your review here..."
            value={review}
            onChange={handleInputChange}
            className={inputClassName + ' h-32'}
          />
          <button type="submit" className={buttonClassName}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
