'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DeliveryRequestService from '../services/DeliveryRequestService';
import AddressAutocomplete from './AddressAutocomplete';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  User,
  Phone,
  Mail,
  Package,
  Box,
  Truck,
  ArrowRight,
  ArrowLeft,
  Send
} from 'lucide-react';

const RequestDeliveryForm = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contactName: '',
    phoneNumber: '',
    email: '',
    billingAddress: '',
    billingCity: '',
    billingZipcode: '',
    billingCountry: '',
    billingCoordinates: { lat: null, lng: null },
    weight: '',
    length: '',
    width: '',
    height: '',
    pickupAddress: '',
    pickupCity: '',
    pickupZipcode: '',
    pickupCountry: '',
    pickupCoordinates: { lat: null, lng: null },
    pickupFormattedAddress: '',
    dropoffAddress: '',
    dropoffCity: '',
    dropoffZipcode: '',
    dropoffCountry: '',
    dropoffCoordinates: { lat: null, lng: null },
    dropoffFormattedAddress: '',
    shippingMethod: '',
    userId: user?.sub,
  });

  // Add the pricing constants to the top of RequestDeliveryForm
const PRICING_CONSTANTS = {
  SIZE_LIMITS: {
    minLength: 10,
    maxLength: 200,
    minWidth: 10,
    maxWidth: 200,
    minHeight: 10,
    maxHeight: 200
  },
  WEIGHT_LIMITS: {
    min: 0.1,
    max: 100
  }
};


  const [completedSteps, setCompletedSteps] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      const parsedData = JSON.parse(decodeURIComponent(data));

      setFormData((prevData) => ({
        ...prevData,
        ...parsedData,
        userId: user?.sub,
      }));
    }
  }, [searchParams]);

  const handleAddressChange = (type) => (e) => {
    const addressData = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      [`${type}Address`]: addressData.address,
      [`${type}City`]: addressData.city,
      [`${type}Country`]: addressData.country,
      [`${type}Zipcode`]: addressData.zipcode,
      [`${type}Coordinates`]: {
        lat: addressData.lat,
        lng: addressData.lng
      },
      [`${type}FormattedAddress`]: addressData.formatted_address
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
      userId: user?.sub,
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        // Billing validation with email and phone format checks
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex to match desired phone number format
  
        return (
          formData.contactName &&
          phoneRegex.test(formData.phoneNumber) &&
          emailRegex.test(formData.email) &&
          formData.billingFormattedAddress
        );
  
      case 2:
      // Validate dimensions and weight with min/max checks
      const { minLength, maxLength, minWidth, maxWidth, minHeight, maxHeight } = PRICING_CONSTANTS.SIZE_LIMITS;
      const { min: minWeight, max: maxWeight } = PRICING_CONSTANTS.WEIGHT_LIMITS;

      if (!formData.weight || formData.weight < minWeight || formData.weight > maxWeight) {
        alert(`Weight must be between ${minWeight}kg and ${maxWeight}kg.`);
        return false;
      }

      if (!formData.length || formData.length < minLength || formData.length > maxLength) {
        alert(`Length must be between ${minLength}cm and ${maxLength}cm.`);
        return false;
      }

      if (!formData.width || formData.width < minWidth || formData.width > maxWidth) {
        alert(`Width must be between ${minWidth}cm and ${maxWidth}cm.`);
        return false;
      }

      if (!formData.height || formData.height < minHeight || formData.height > maxHeight) {
        alert(`Height must be between ${minHeight}cm and ${maxHeight}cm.`);
        return false;
      }

      return true;

  
      case 3:
        return formData.pickupFormattedAddress;
  
      case 4:
        // Drop-off validation with check to ensure pickup and dropoff are not the same
        if (formData.dropoffFormattedAddress === formData.pickupFormattedAddress) {
          alert('Pickup and dropoff locations cannot be the same. Please enter different addresses.');
          return false;
        }
  
        return formData.dropoffFormattedAddress;
  
      case 5:
        return formData.shippingMethod;
  
      default:
        return true;
    }
  };
  
  

  const nextStep = () => {
    if (validateStep()) {
      setCompletedSteps({ ...completedSteps, [currentStep]: true });
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please complete all required fields.');
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const deliveryService = DeliveryRequestService.getInstance();
      const response = await deliveryService.createTemporaryDeliveryRequest(formData);
      localStorage.setItem('tempRequestID', response.requestID);
      localStorage.setItem('requestData', JSON.stringify(formData));
      router.push('/confirmation');
    } catch (error) {
      console.error('Error in submitting delivery request:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    'Billing Information',
    'Package dimensions',
    'Pickup location',
    'Drop-off location',
    'Shipping method'
  ];

  const inputBaseClassName = `
    w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 
    border-2 border-gray-800 text-sm text-gray-100 
    placeholder-gray-500 focus:border-violet-500 
    focus:outline-none transition-colors
  `;

  const buttonBaseClassName = `
    px-6 py-2.5 rounded-lg font-medium text-sm
    flex items-center gap-2 transition-all duration-200
  `;

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={`h-1 w-full ${index === 0 ? 'hidden' : ''} ${
                    index <= currentStep - 1 ? 'bg-violet-400' : 'bg-gray-800'
                  }`}
                />
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep === index + 1
                      ? 'bg-violet-400 text-white'
                      : completedSteps[index + 1]
                      ? 'border-2 border-violet-400 bg-violet-400/20 text-violet-400'
                      : 'bg-gray-800 text-gray-400'
                  } transition-colors`}>
                  {completedSteps[index + 1] ? '✓' : index + 1}
                </div>
                <div
                  className={`h-1 w-full ${index === steps.length - 1 ? 'hidden' : ''} ${
                    index < currentStep - 1 ? 'bg-violet-400' : 'bg-gray-800'
                  }`}
                />
              </div>
              <span
                className={`mt-2 hidden text-center text-xs sm:block sm:text-sm ${
                  currentStep === index + 1
                    ? 'text-violet-400'
                    : completedSteps[index + 1]
                    ? 'text-violet-400'
                    : 'text-gray-500'
                }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="divide-y divide-gray-800/50">
        {/* Step 1: Billing Information */}
        {currentStep === 1 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Billing Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Contact Name"
                  className={inputBaseClassName}
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={inputBaseClassName}
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={inputBaseClassName}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <AddressAutocomplete
                value={formData.billingFormattedAddress}
                onChange={handleAddressChange('billing')}
                placeholder={formData.billingFormattedAddress || 'Enter billing address'}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Package Dimensions */}
        {currentStep === 2 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Package className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Package Dimensions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <input
                type="number"
                placeholder="Weight (kg)"
                className={inputBaseClassName}
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
              <input
                type="number"
                placeholder="Length (cm)"
                className={inputBaseClassName}
                value={formData.length}
                onChange={(e) => handleChange('length', e.target.value)}
              />
              <input
                type="number"
                placeholder="Width (cm)"
                className={inputBaseClassName}
                value={formData.width}
                onChange={(e) => handleChange('width', e.target.value)}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                className={inputBaseClassName}
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Pickup Location */}
        {currentStep === 3 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Box className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Pickup Location</h3>
            </div>

            <AddressAutocomplete
              value={formData.pickupFormattedAddress}
              onChange={handleAddressChange('pickup')}
              placeholder={formData.pickupFormattedAddress || 'Enter pickup address'}
              required
            />
          </div>
        )}

        {/* Step 4: Drop-off Location */}
        {currentStep === 4 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Box className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Drop-off Location</h3>
            </div>

            <AddressAutocomplete
              value={formData.dropoffFormattedAddress}
              onChange={handleAddressChange('dropoff')}
              placeholder={formData.dropoffFormattedAddress || 'Enter drop-off address'}
              required
            />
          </div>
        )}

        {/* Step 5: Shipping Method */}
        {currentStep === 5 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Truck className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Shipping Method</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleChange('shippingMethod', 'express')}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
                  formData.shippingMethod === 'express'
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                } `}
              >
                <Truck
                  className={`h-5 w-5 ${
                    formData.shippingMethod === 'express' ? 'text-violet-400' : 'text-gray-400'
                  }`}
                />
                <div className="flex flex-col items-start">
                  <span
                    className={`font-medium ${
                      formData.shippingMethod === 'express' ? 'text-violet-400' : 'text-gray-300'
                    }`}
                  >
                    Express Shipping
                  </span>
                  <span className="text-sm text-gray-500">Faster delivery with priority handling</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange('shippingMethod', 'standard')}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
                  formData.shippingMethod === 'standard'
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                } `}
              >
                <Truck
                  className={`h-5 w-5 ${
                    formData.shippingMethod === 'standard' ? 'text-violet-400' : 'text-gray-400'
                  }`}
                />
                <div className="flex flex-col items-start">
                  <span
                    className={`font-medium ${
                      formData.shippingMethod === 'standard' ? 'text-violet-400' : 'text-gray-300'
                    }`}
                  >
                    Standard Shipping
                  </span>
                  <span className="text-sm text-gray-500">Regular delivery at standard rates</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-4">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className={`${buttonBaseClassName} border-2 border-gray-800 text-gray-400 hover:bg-gray-800/50`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <button
            onClick={currentStep === 5 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className={`${buttonBaseClassName} bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-violet-500`}
          >
            {currentStep === 5 ? (
              isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Processing...
                </>
              ) : (
                <>
                  Submit Request
                  <Send className="h-4 w-4" />
                </>
              )
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDeliveryForm;