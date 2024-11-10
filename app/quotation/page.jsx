"use client";

import { useEffect, useState } from 'react';

const QuotationPage = () => {
    const [tempRequestID, setTempRequestID] = useState(null);
    const [requestData, setRequestData] = useState({});

    useEffect(() => {
        // Now we Retrieve data from localStorage so we can fetch it between forms
        const storedRequestID = localStorage.getItem("tempRequestID");
        const storedRequestData = localStorage.getItem("requestData");

        if (storedRequestID && storedRequestData) {
            setTempRequestID(storedRequestID);
            setRequestData(JSON.parse(storedRequestData));
        }
    }, []);

    //This is just a mock to show that we can actually retrieve the data after payment
    const handleMockPayment = () => {
        if (!tempRequestID) {
            alert("No temporary request ID found. Please submit a delivery request first.");
            return;
        }

        console.log("Payment completed. Final Delivery Request ID:", tempRequestID);
        console.log("Delivery request details:", requestData);

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
