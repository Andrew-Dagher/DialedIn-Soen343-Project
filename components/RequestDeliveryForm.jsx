'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DeliveryRequestService from '../services/DeliveryRequestService';

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
                return formData.contactName && formData.phoneNumber && formData.email && formData.country && formData.addressLine && formData.postalCode && formData.city;
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
            alert("Please complete the required fields.");
        }
    };

  const prevStep = () => setCurrentStep(currentStep - 1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { ...formData };

        try {
            const deliveryService = DeliveryRequestService.getInstance();
            const response = await deliveryService.createTemporaryDeliveryRequest(data);

            localStorage.setItem("tempRequestID", response.requestId);
            localStorage.setItem("requestData", JSON.stringify(data));

            router.push('/confirmation');
        } catch (error) {
            console.error("Error in submitting delivery request:", error);
        }
    };

    const inputClassName = "w-full border-gray-800 border-2 rounded-xl bg-transparent p-3 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:border-violet-400 focus:outline-none";
    const buttonClassName = "rounded-lg bg-violet-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700";
    const secondaryButtonClassName = "rounded-lg border-2 border-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <div className="flex flex-col gap-2">
                        {['Shipping', 'Package dimensions', 'Pickup location', 'Drop-off location', 'Shipping method'].map((label, index) => (
                            <button
                                key={index}
                                className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                                    currentStep === index + 1
                                        ? 'bg-violet-400 text-white'
                                        : completedSteps[index + 1]
                                        ? 'bg-violet-400/20 text-violet-400'
                                        : 'bg-gray-800 text-gray-300'
                                }`}
                                onClick={() => completedSteps[index] && setCurrentStep(index + 1)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-3">
                    {currentStep === 1 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-gray-100">Shipping</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Contact Name" className={inputClassName} value={formData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} />
                                <input type="text" placeholder="Phone Number" className={inputClassName} value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
                                <input type="email" placeholder="Email" className={inputClassName} value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                                <input type="text" placeholder="Country/Territory" className={inputClassName} value={formData.country} onChange={(e) => handleChange('country', e.target.value)} />
                                <input type="text" placeholder="Address Line" className={inputClassName} value={formData.addressLine} onChange={(e) => handleChange('addressLine', e.target.value)} />
                                <input type="text" placeholder="Postal Code" className={inputClassName} value={formData.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} />
                                <input type="text" placeholder="City" className={inputClassName} value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
                            </div>
                            <button className={buttonClassName} onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-gray-100">Package Dimensions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Width (cm)" className={inputClassName} value={formData.width} onChange={(e) => handleChange('width', e.target.value)} />
                                <input type="number" placeholder="Length (cm)" className={inputClassName} value={formData.length} onChange={(e) => handleChange('length', e.target.value)} />
                                <input type="number" placeholder="Height (cm)" className={inputClassName} value={formData.height} onChange={(e) => handleChange('height', e.target.value)} />
                                <input type="number" placeholder="Weight (kg)" className={inputClassName} value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={secondaryButtonClassName} onClick={prevStep}>Back</button>
                                <button className={buttonClassName} onClick={nextStep}>Next</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-gray-100">Pickup Location</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Country" className={inputClassName} value={formData.pickupCountry} onChange={(e) => handleChange('pickupCountry', e.target.value)} />
                                <input type="text" placeholder="Address" className={inputClassName} value={formData.pickupAddress} onChange={(e) => handleChange('pickupAddress', e.target.value)} />
                                <input type="text" placeholder="Zipcode" className={inputClassName} value={formData.pickupZipcode} onChange={(e) => handleChange('pickupZipcode', e.target.value)} />
                                <input type="text" placeholder="City" className={inputClassName} value={formData.pickupCity} onChange={(e) => handleChange('pickupCity', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={secondaryButtonClassName} onClick={prevStep}>Back</button>
                                <button className={buttonClassName} onClick={nextStep}>Next</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-gray-100">Drop-off Location</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Country" className={inputClassName} value={formData.dropoffCountry} onChange={(e) => handleChange('dropoffCountry', e.target.value)} />
                                <input type="text" placeholder="Address" className={inputClassName} value={formData.dropoffAddress} onChange={(e) => handleChange('dropoffAddress', e.target.value)} />
                                <input type="text" placeholder="Zipcode" className={inputClassName} value={formData.dropoffZipcode} onChange={(e) => handleChange('dropoffZipcode', e.target.value)} />
                                <input type="text" placeholder="City" className={inputClassName} value={formData.dropoffCity} onChange={(e) => handleChange('dropoffCity', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={secondaryButtonClassName} onClick={prevStep}>Back</button>
                                <button className={buttonClassName} onClick={nextStep}>Next</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-gray-100">Shipping Method</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2 text-sm">
                                    <input type="radio" name="shippingMethod" value="express" checked={formData.shippingMethod === 'express'} onChange={(e) => handleChange('shippingMethod', e.target.value)} />
                                    <span className="text-gray-300">Express Shipping</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm">
                                    <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={(e) => handleChange('shippingMethod', e.target.value)} />
                                    <span className="text-gray-300">Standard Shipping</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={secondaryButtonClassName} onClick={prevStep}>Back</button>
                                <button type="button" className={buttonClassName} onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDeliveryForm;
