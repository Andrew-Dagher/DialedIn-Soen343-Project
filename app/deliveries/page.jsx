'use client'; 

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';


export default function RequestDeliveryPage() {
    const { user, isLoading } = useUser(); 
    const [deliveries, setDeliveries] = useState([]);
    

   
    useEffect(() => {
        if (user) {
            const fetchDeliveries = async () => {
                const port = window.location.port;
                const response = await fetch(`http://localhost:${port}/api/view-deliveries?userId=${user.sub}`);
                const data = await response.json();
                setDeliveries(data);
            };
            fetchDeliveries();
        }
    }, [user]);  


    if (isLoading) {
        return <div>Loading...</div>;  
    }

    if (!user) {
        return <div>Please log in to view your deliveries.</div>;  
    }
    console.log(deliveries)
    return (
        
        <div className="mx-4 sm:mx-6 md:mx-8 mt-6 sm:mt-8 md:mt-10 rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                

                <div className="mt-8">
                    <h2 className="text-xl text-gray-100">Deliveries</h2>
                    <ul className="list-disc pl-6 mt-4 text-gray-200">
                        {deliveries.map((delivery) => (
                            <li key={delivery._id} className="mb-4">
                                <p><strong>Order ID: {delivery.requestID}</strong></p>
                                <p>{delivery.contactName}</p>
                                <p>{delivery.phoneNumber}</p>
                                <p>{delivery.email}</p>
                                <p>{delivery.country}</p>
                                <p>{delivery.addressLine}</p>
                                <p>{delivery.postalCode}</p>
                                <p>{delivery.city}</p>
                                <p>{delivery.shippingMethod}</p>
                                <p>Payment: {delivery.paymentStatus}</p>
                                <p>Delivery: {delivery.deliveryStatus}</p>
                                <p>Order Created at: {delivery.createdAt}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
