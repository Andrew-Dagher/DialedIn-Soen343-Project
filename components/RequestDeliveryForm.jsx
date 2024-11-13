'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DeliveryRequestService from '../services/DeliveryRequestService';
import {
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building,
  Package,
  Box,
  Truck,
  Scale,
  Home,
  ArrowRight,
  ArrowLeft,
  Send
} from 'lucide-react';

const RequestDeliveryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
      contactName: '',
      phoneNumber: '',
      email: '',
      country: '',
      addressLine: '',
      postalCode: '',
      city: '',
      width: '',
      length: '',
      height: '',
      weight: '',
      pickupCountry: '',
      pickupAddress: '',
      pickupZipcode: '',
      pickupCity: '',
      dropoffCountry: '',
      dropoffAddress: '',
      dropoffZipcode: '',
      dropoffCity: '',
      shippingMethod: '',
  });
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      setFormData(JSON.parse(decodeURIComponent(data)));
    }
  }, [searchParams]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.contactName &&
          formData.phoneNumber &&
          formData.email &&
          formData.country &&
          formData.addressLine &&
          formData.postalCode &&
          formData.city
        );
      case 2:
        return formData.width && formData.length && formData.height && formData.weight;
      case 3:
        return formData.pickupCountry && formData.pickupAddress && formData.pickupZipcode && formData.pickupCity;
      case 4:
        return formData.dropoffCountry && formData.dropoffAddress && formData.dropoffZipcode && formData.dropoffCity;
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

  const handleSubmit = async event => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const deliveryService = DeliveryRequestService.getInstance();
      const response = await deliveryService.createTemporaryDeliveryRequest(formData);
      localStorage.setItem('tempRequestID', response.requestId);
      localStorage.setItem('requestData', JSON.stringify(formData));
      router.push('/confirmation');
    } catch (error) {
      console.error('Error in submitting delivery request:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Shipping', 'Package dimensions', 'Pickup location', 'Drop-off location', 'Shipping method'];

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
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Shipping Information</h3>
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
                  onChange={e => handleChange('contactName', e.target.value)}
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
                  onChange={e => handleChange('phoneNumber', e.target.value)}
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
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Globe className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  className={inputBaseClassName}
                  value={formData.country}
                  onChange={e => handleChange('country', e.target.value)}
                />
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  className={inputBaseClassName}
                  value={formData.addressLine}
                  onChange={e => handleChange('addressLine', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Building className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="City"
                  className={inputBaseClassName}
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Home className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className={inputBaseClassName}
                  value={formData.postalCode}
                  onChange={e => handleChange('postalCode', e.target.value)}
                />
              </div>
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
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Box className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Width (cm)"
                  className={inputBaseClassName}
                  value={formData.width}
                  onChange={e => handleChange('width', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Box className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Length (cm)"
                  className={inputBaseClassName}
                  value={formData.length}
                  onChange={e => handleChange('length', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Box className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Height (cm)"
                  className={inputBaseClassName}
                  value={formData.height}
                  onChange={e => handleChange('height', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Scale className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className={inputBaseClassName}
                  value={formData.weight}
                  onChange={e => handleChange('weight', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pickup Location */}
        {currentStep === 3 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <MapPin className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Pickup Location</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Globe className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  className={inputBaseClassName}
                  value={formData.pickupCountry}
                  onChange={e => handleChange('pickupCountry', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Building className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="City"
                  className={inputBaseClassName}
                  value={formData.pickupCity}
                  onChange={e => handleChange('pickupCity', e.target.value)}
                />
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  className={inputBaseClassName}
                  value={formData.pickupAddress}
                  onChange={e => handleChange('pickupAddress', e.target.value)}
                />
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Home className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className={inputBaseClassName}
                  value={formData.pickupZipcode}
                  onChange={e => handleChange('pickupZipcode', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Drop-off Location */}
        {currentStep === 4 && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <MapPin className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100">Drop-off Location</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Globe className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  className={inputBaseClassName}
                  value={formData.dropoffCountry}
                  onChange={e => handleChange('dropoffCountry', e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Building className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="City"
                  className={inputBaseClassName}
                  value={formData.dropoffCity}
                  onChange={e => handleChange('dropoffCity', e.target.value)}
                />
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  className={inputBaseClassName}
                  value={formData.dropoffAddress}
                  onChange={e => handleChange('dropoffAddress', e.target.value)}
                />
              </div>

              <div className="relative sm:col-span-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Home className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className={inputBaseClassName}
                  value={formData.dropoffZipcode}
                  onChange={e => handleChange('dropoffZipcode', e.target.value)}
                />
              </div>
            </div>
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
                } `}>
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <Truck
                    className={`h-5 w-5 ${formData.shippingMethod === 'express' ? 'text-violet-400' : 'text-gray-400'}`}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={`font-medium ${formData.shippingMethod === 'express' ? 'text-violet-400' : 'text-gray-300'}`}>
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
                } `}>
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <Truck
                    className={`h-5 w-5 ${formData.shippingMethod === 'standard' ? 'text-violet-400' : 'text-gray-400'}`}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={`font-medium ${formData.shippingMethod === 'standard' ? 'text-violet-400' : 'text-gray-300'}`}>
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
              className={`${buttonBaseClassName} border-2 border-gray-800 text-gray-400 hover:bg-gray-800/50`}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <button
            onClick={currentStep === 5 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className={`${buttonBaseClassName} bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-violet-500`}>
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
