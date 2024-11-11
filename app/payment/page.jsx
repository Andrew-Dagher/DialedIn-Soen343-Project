"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const request = searchParams.get('request');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default to credit card
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [totalPayment, setTotalPayment] = useState(null);

  useEffect(() => {
    // Retrieve amount from localStorage if available
    const storedAmount = localStorage.getItem("tempAmount");

    if (request && storedAmount) {
      setTotalPayment(parseFloat(storedAmount));
    } else {
      console.error("No request ID or amount found");
      setError("No request ID or amount found");
    }
  }, [request]);

  const validateCardNumber = (number) => number.length === 16 && /^\d+$/.test(number);
  const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const validateCVV = (cvv) => cvv.length === 3 && /^\d+$/.test(cvv);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      const response = await axios.post('/api/payment', {
        requestID: request,
        paymentInfo: {
          cardNumber: paymentDetails.cardNumber,
          expiryDate: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv,
          paymentMethod: paymentMethod,  // Pass selected payment method
        },
        amount: totalPayment,
      });

      if (response.status === 200 && response.data.success) {
        setSuccess('Payment authorized. Your payment has been successfully processed.');
        setPaymentDetails({ cardNumber: '', expiryDate: '', cvv: '' });
        console.log('Payment successful. Your payment has been successfully processed');
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
        {totalPayment !== null && <p className="totalPayment">Total Payment: ${totalPayment.toFixed(2)}</p>}
        
        <select className="input" value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="credit_card">Credit Card</option>
          <option value="debit">Debit Card</option>
        </select>

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

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f2f2f2;
        }
        .form {
          max-width: 400px;
          width: 100%;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .input {
          margin-bottom: 1.5rem;
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .button {
          margin-top: 1.5rem;
          padding: 0.75rem;
          width: 100%;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .button:hover {
          background-color: #005bb5;
        }
        .totalPayment {
          margin-bottom: 2rem;
          color: #333;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .success {
          color: green;
          margin-bottom: 1.5rem;
        }
        .error {
          color: red;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;