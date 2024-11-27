import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function ReviewForm({ formData, setFormData, handleSubmit, isSubmitting, orderID }) {
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleRatingChange = rating => {
    setFormData(prevData => ({ ...prevData, rating }));
    setError(null);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (!formData.rating) {
      setError('Please select a rating');
      return;
    }
    handleSubmit();
  };

  useEffect(() => {
    setFormData(prevData => ({ ...prevData, orderID }));
  }, [orderID, setFormData]);

  const ratingLabels = {
    1: 'Bad (1/5)',
    2: 'So-so (2/5)',
    3: 'Ok (3/5)',
    4: 'Good (4/5)',
    5: 'Great (5/5)'
  };

  return (
    <div className="mt-6 rounded-xl border-2 border-gray-800 bg-transparent p-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-6">
          {/* Star Rating */}
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
            {[1, 2, 3, 4, 5].map(value => (
              <div key={value} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRatingChange(value)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    formData.rating === value
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}>
                  <Star className={`h-6 w-6 ${formData.rating === value ? 'fill-current' : ''}`} />
                </button>
                <span className={`text-sm ${formData.rating === value ? 'text-violet-400' : 'text-gray-500'}`}>
                  {ratingLabels[value]}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-center">
              <p className="inline-block rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="space-y-4">
          {/* Review */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">Review</label>
            <textarea
              name="comment"
              placeholder="Share the details of your delivery experience..."
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-xl border-2 border-gray-800 bg-gray-800/20 p-3 text-gray-100 transition-colors placeholder:text-gray-600 hover:border-gray-700 focus:border-violet-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
