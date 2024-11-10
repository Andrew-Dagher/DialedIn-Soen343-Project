"use client"
//Temporati quoatation page
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DeliveryRequestService from '../../services/DeliveryRequestService';

const Quotation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestId = searchParams.get('requestId');
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const service = DeliveryRequestService.getInstance();
                const result = await service.getQuotation(requestId);
                setQuotation(result);
            } catch (error) {
                console.error("Failed to retrieve quotation:", error);
            }
        };

        if (requestId) {
            fetchQuotation();
        }
    }, [requestId]);

    return (
        <div className="container">
            <h1>Quotation and Payment</h1>
            {quotation ? (
                <div>
                    <p>Estimated Cost: {quotation.estimatedCost}</p>
                    <button className="btn btn-primary">Proceed to Payment</button>
                </div>
            ) : (
                <p>Loading quotation details... temporary</p>
            )}
        </div>
    );
};

export default Quotation;
