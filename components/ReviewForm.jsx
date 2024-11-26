import React, { useState, useEffect } from 'react';
import { Star} from 'lucide-react';

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
      setError('Please provide a star rating before submitting.');
      return;
    }

    
    handleSubmit();
  };

  const inputClassName = `
    w-full border-gray-800 border-2 rounded-xl bg-transparent 
    p-2 sm:p-3 text-sm sm:text-base text-gray-100 
    placeholder-gray-500 transition-colors 
    focus:border-violet-400 focus:outline-none
    hover:border-gray-700
  `;
  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={24}
            color={index < rating ? '#facc15' : '#4b5563'} 
            className="cursor-pointer"
            onClick={() => onRatingChange(index + 1)}
          />
        ))}
      </div>
    );
  };
  
  useEffect(() => {
    setFormData(prevData => ({ ...prevData, orderID }));
  }, [orderID, setFormData]);

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
      
       {/* Star Rating */}
       <div>
        <h2 className="text-lg font-medium text-gray-100 mb-2">Rate Us</h2>
        <StarRating
          rating={formData.rating || 0}
          onRatingChange={handleRatingChange}
        />
         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Comment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
          
            <h2 className="text-lg font-medium text-gray-100">Comments</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="comment"
                placeholder="Comments"
                value={formData.comment}
                onChange={handleChange}
                
                className={inputClassName}
              />
              
          </div>
        </div>
        </div>
        </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          rounded-xl bg-violet-400 px-6 py-4
          text-base font-medium text-white 
          transition-colors hover:bg-violet-600 
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-violet-400 
          focus:ring-offset-2 focus:ring-offset-gray-950
          mt-4
        "
      >
        {isSubmitting ? 'Submitting Review' : 'Submit Review'}
      </button>
      
    </form>
  );
}