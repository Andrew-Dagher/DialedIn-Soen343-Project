"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservation = searchParams.get('request'); // Get request ID from URL
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [totalPayment, setTotalPayment] = useState(null);

  useEffect(() => {
    if (!reservation) {
      console.error('No reservation ID provided');
      setError('No reservation ID provided');
      return;
    }
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.post('/api/lookup_reservation', { reservationID: reservation });

        if (response.data && response.data.reservationDetails) {
          setTotalPayment(response.data.reservationDetails.totalPayment);
        }
      } catch (error) {
        console.error('Error fetching reservation details:', error);
      }
    };

    fetchReservationDetails();
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input fields
    if (!validateCardNumber(paymentDetails.cardNumber)) {
      setError('Credit card number must be 16 numerical digits.');
      return;
    }
    if (!validateExpiryDate(paymentDetails.expiryDate)) {
      setError('Invalid expiry date format. Use MM/YY.');
      return;
    }
    if (!validateCVV(paymentDetails.cvv)) {
      setError('CVV must be 3 numerical digits.');
      return;
    }

    try {
      // Call to API endpoint to save payment information in the database
      const response = await axios.post('/api/update_paymentDetails', {
        deliveryId: reservation, // Map reservation ID to deliveryId
        paymentInfo: {
          cardNumber: paymentDetails.cardNumber,
          expiryDate: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv,
        },
      });

      if (response.status === 200 && response.data.success) {
        setSuccess('Payment authorized. Your payment has been successfully processed.');
        setPaymentDetails({ cardNumber: '', expiryDate: '', cvv: '' });

        // Optional: Send email confirmation
        await axios.post('/api/email_confirmation', {
          recipientEmail: email, // Replace with actual email
          recipientName: first_name, // Replace with actual first name
          reservationID: reservation,
        });

        router.push('/managereservation');
      } else {
        setError('Payment authorization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment authorization failed. Please try again.');
    }
  };

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form">
        {totalPayment !== null && <p className="totalPayment">Total Payment: ${totalPayment}</p>}
        <input
          className="input"
          placeholder="Card Number"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="Expiry Date (MM/YY)"
          name="expiryDate"
          value={paymentDetails.expiryDate}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="CVV"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleChange}
          required
        />
        <button className="button" type="submit" onClick={handleSubmit}>
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
