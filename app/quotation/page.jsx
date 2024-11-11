"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const QuotationPage = () => {
    const [tempRequestID, setTempRequestID] = useState(null);
    const [requestData, setRequestData] = useState({});
    const router = useRouter();

    useEffect(() => {
        // Retrieve data from localStorage to persist between forms
        const storedRequestID = localStorage.getItem("tempRequestID");
        const storedRequestData = localStorage.getItem("requestData");

        if (storedRequestID && storedRequestData) {
            setTempRequestID(storedRequestID);
            setRequestData(JSON.parse(storedRequestData));
        }
    }, []);

    // Mock payment handling with localStorage and navigation to Payment page
    const handleMockPayment = () => {
        if (!tempRequestID) {
            alert("No temporary request ID found. Please submit a delivery request first.");
            return;
        }

        const mockAmount = 125.50; // Mock amount for payment
        console.log("Payment completed. Final Delivery Request ID:", tempRequestID);
        console.log("Delivery request details:", requestData);


        // Store the mock amount in localStorage for use on the PaymentPage
        localStorage.setItem("tempAmount", mockAmount);

        // Navigate to Payment page and pass the request ID as a query parameter
        router.push(`/payment?request=${tempRequestID}`);

          // Clear data after payment
          localStorage.removeItem("tempRequestID");
          localStorage.removeItem("requestData");
    };

    return (
        <div className="container">
            <h1>Quotation Page</h1>
            {tempRequestID ? (
                <div>
                    <h3>Temporary Request ID: {tempRequestID}</h3>
                    <pre>{JSON.stringify(requestData, null, 2)}</pre>
                    <button onClick={handleMockPayment} className="btn btn-primary">Complete Payment</button>
                </div>
            ) : (
                <p>No delivery request data found.</p>
            )}
        </div>
    );
};

export default QuotationPage;
