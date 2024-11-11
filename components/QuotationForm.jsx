import React from 'react';

export default function QuotationForm({ formData, setFormData, handleSubmit }) {
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const inputClassName = "w-full border-gray-800 border-2 rounded-xl bg-transparent p-3 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:border-violet-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-gray-300">Package Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
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

      <div>
        <label className="mb-1 block text-sm text-gray-300">Pickup Location</label>
        <div className="grid grid-cols-2 gap-2">
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
          <input
            type="text"
            name="pickupProvince"
            placeholder="Province"
            value={formData.pickupProvince}
            onChange={handleChange}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-300">Drop-off Location</label>
        <div className="grid grid-cols-2 gap-2">
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
          <input
            type="text"
            name="dropoffProvince"
            placeholder="Province"
            value={formData.dropoffProvince}
            onChange={handleChange}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-300">Shipping Method</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={formData.shippingMethod === 'express'}
              onChange={handleChange}
            />
            <span className="text-gray-300">Express Shipping</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={formData.shippingMethod === 'standard'}
              onChange={handleChange}
            />
            <span className="text-gray-300">Standard Shipping</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700">
        Calculate Quote
      </button>
    </form>
  );
}