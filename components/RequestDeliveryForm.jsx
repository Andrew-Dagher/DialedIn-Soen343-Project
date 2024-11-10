"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeliveryRequestService from '../services/DeliveryRequestService';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

const RequestDeliveryForm = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        contactName: '',
        phoneNumber: '',
        email: '',
        country: '',
        addressLine: '',
        postalCode: '',
        city: '',
        packageType: '',
        width: '',
        length: '',
        height: '',
        weight: '',
        serviceType: '',
        pickUpLocation: '',
        notificationPreference: '',
    });
    const [completedSteps, setCompletedSteps] = useState({});
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return formData.contactName && formData.phoneNumber && formData.email && formData.country && formData.addressLine && formData.postalCode && formData.city;
            case 2:
                return formData.packageType && formData.width && formData.length && formData.height && formData.weight;
            case 3:
                return formData.serviceType;
            case 4:
                return formData.pickUpLocation;
            case 5:
                return formData.notificationPreference;
            default:
                return true;
        }
    };

    //Ask user to complete form before going to the next step form, the user can go back but not forward in step-form if not completed
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

            // Save data to localStorage
            localStorage.setItem("tempRequestID", response.requestId);
            localStorage.setItem("requestData", JSON.stringify(data));

            // Redirect to quotation page
            router.push('/quotation');
        } catch (error) {
            console.error("Error in submitting delivery request:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
    {/* Sidebar Navigation inspired by fedex*/}
                <div className="col-md-4">
                    <div className="list-group">
                        {['Shipping', 'Package details', 'Service', 'Pickup/drop-off', 'Notifications'].map((label, index) => (
                            <button
                                key={index}
                                className={`list-group-item list-group-item-action ${currentStep === index + 1 && 'active'} ${completedSteps[index + 1] ? 'list-group-item-success' : ''}`}
                                onClick={() => completedSteps[index] && setCurrentStep(index + 1)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

    {/* Forms for all the steps */}
                <div className="col-md-8">
                    {currentStep === 1 && (
                        <div>
                            <h3>Shipping</h3>
                            <div className="form-group">
                                <label>Contact Name *</label>
                                <input type="text" className="form-control" value={formData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="text" className="form-control" value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" className="form-control" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Country/Territory *</label>
                                <input type="text" className="form-control" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Address Line *</label>
                                <input type="text" className="form-control" value={formData.addressLine} onChange={(e) => handleChange('addressLine', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Postal Code *</label>
                                <input type="text" className="form-control" value={formData.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>City *</label>
                                <input type="text" className="form-control" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} required />
                            </div>
                            <button className="btn btn-primary" onClick={nextStep}>Next</button>
                        </div>
                    )}
                    
                    {currentStep === 2 && (
                        <div>
                            <h3>Package Details</h3>
                            <div className="form-group">
                                <label>Type of Package *</label>
                                <input type="text" className="form-control" value={formData.packageType} onChange={(e) => handleChange('packageType', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Width (cm) *</label>
                                <input type="number" className="form-control" value={formData.width} onChange={(e) => handleChange('width', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Length (cm) *</label>
                                <input type="number" className="form-control" value={formData.length} onChange={(e) => handleChange('length', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Height (cm) *</label>
                                <input type="number" className="form-control" value={formData.height} onChange={(e) => handleChange('height', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Weight kg *</label>
                                <input type="number" className="form-control" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} required />
                            </div>
                            <button className="btn btn-secondary mr-2" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next</button>
                        </div>
                    )}
                    
                    {currentStep === 3 && (
                        <div>
                         <h3>Service</h3>
                            <div className="form-group">
                                <label>Service Type *</label>
                                <select className="form-control" value={formData.serviceType} onChange={(e) => handleChange('serviceType', e.target.value)} required>
                                    <option value="">Select Service</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Express">Express</option>
                                </select>
                            </div>
                            <button className="btn btn-secondary mr-2" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next</button>
                        </div>
                    )}
                    
                    {currentStep === 4 && (
                        <div>
                            <h3>Pickup/Drop-Off</h3>
                            <div className="form-group">
                                <label>Pick-Up Location *</label>
                                <input type="text" className="form-control" value={formData.pickUpLocation} onChange={(e) => handleChange('pickUpLocation', e.target.value)} required />
                            </div>
                            <button className="btn btn-secondary mr-2" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>Next</button>
                        </div>
                    )}
                
                    {currentStep === 5 && (
                        <div>
                            <h3>Notifications</h3>
                            <div className="form-group">
                                <label>Notification Preference *</label>
                                <select className="form-control" value={formData.notificationPreference} onChange={(e) => handleChange('notificationPreference', e.target.value)} required>
                                    <option value="">Select Notification</option>
                                    <option value="Email">Email</option>
                                    <option value="SMS">SMS</option>
                                </select>
                            </div>
                            <button className="btn btn-secondary mr-2" onClick={prevStep}>Back</button>
                            <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default RequestDeliveryForm;
