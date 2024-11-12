import React from 'react';
import { Package, MapPin, Truck } from 'lucide-react';

export default function QuotationForm({ formData, setFormData, handleSubmit, isSubmitting }) {
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const inputClassName = `
    w-full border-gray-800 border-2 rounded-xl bg-transparent 
    p-2 sm:p-3 text-sm sm:text-base text-gray-100 
    placeholder-gray-500 transition-colors 
    focus:border-violet-400 focus:outline-none
    hover:border-gray-700
  `;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Package Dimensions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
          <Package className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-medium text-gray-100">Package Details</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <input
            type="number"
            name="length"
            placeholder="Length (cm)"
            value={formData.length}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <input
            type="number"
            name="width"
            placeholder="Width (cm)"
            value={formData.width}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
            required
            className={inputClassName}
          />
        </div>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pickup Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
            <MapPin className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-medium text-gray-100">Pickup Location</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="pickupCountry"
                placeholder="Country"
                value={formData.pickupCountry}
                onChange={handleChange}
                required
                className={inputClassName}
              />
              <input
                type="text"
                name="pickupCity"
                placeholder="City"
                value={formData.pickupCity}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>
            <input
              type="text"
              name="pickupAddress"
              placeholder="Address"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
              className={inputClassName}
            />
            <input
              type="text"
              name="pickupZipcode"
              placeholder="Zipcode"
              value={formData.pickupZipcode}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
            <MapPin className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-medium text-gray-100">Drop-off Location</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="dropoffCountry"
                placeholder="Country"
                value={formData.dropoffCountry}
                onChange={handleChange}
                required
                className={inputClassName}
              />
              <input
                type="text"
                name="dropoffCity"
                placeholder="City"
                value={formData.dropoffCity}
                onChange={handleChange}
                required
                className={inputClassName}
              />
            </div>
            <input
              type="text"
              name="dropoffAddress"
              placeholder="Address"
              value={formData.dropoffAddress}
              onChange={handleChange}
              required
              className={inputClassName}
            />
            <input
              type="text"
              name="dropoffZipcode"
              placeholder="Zipcode"
              value={formData.dropoffZipcode}
              onChange={handleChange}
              required
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-800">
          <Truck className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-medium text-gray-100">Shipping Method</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange({ target: { name: 'shippingMethod', value: 'express' }})}
            className={`
              p-4 rounded-xl border-2 transition-all
              flex items-center justify-center gap-3
              ${formData.shippingMethod === 'express'
                ? 'border-violet-400 bg-violet-400/10 text-violet-400'
                : 'border-gray-800 text-gray-400 hover:bg-gray-800/50'}
            `}
          >
            <Truck className="w-5 h-5" />
            <span className="font-medium">Express Shipping</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange({ target: { name: 'shippingMethod', value: 'standard' }})}
            className={`
              p-4 rounded-xl border-2 transition-all
              flex items-center justify-center gap-3
              ${formData.shippingMethod === 'standard'
                ? 'border-violet-400 bg-violet-400/10 text-violet-400'
                : 'border-gray-800 text-gray-400 hover:bg-gray-800/50'}
            `}
          >
            <Truck className="w-5 h-5" />
            <span className="font-medium">Standard Shipping</span>
          </button>
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
        {isSubmitting ? 'Calculating...' : 'Calculate Quote'}
      </button>
    </form>
  );
}