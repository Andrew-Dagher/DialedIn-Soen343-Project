'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CreditCard } from 'lucide-react';

const PaymentPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [totalPayment, setTotalPayment] = useState(null);
  const [requestId, setRequestId] = useState(null); // Define requestId state here

  useEffect(() => {
    const storedRequestId = localStorage.getItem('tempRequestID');
    const storedAmount = localStorage.getItem('quotationPrice');

    if (storedRequestId && storedAmount) {
      setTotalPayment(parseFloat(storedAmount));
      setRequestId(storedRequestId); // Set requestId state here
    } else {
      console.error('No request ID or amount found');
      setError('No request ID or amount found');
    }
  }, []);

  const validateCardNumber = number => number.length === 16 && /^\d+$/.test(number);
  const validateExpiryDate = date => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const validateCVV = cvv => cvv.length === 3 && /^\d+$/.test(cvv);

  const handleChange = e => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async e => {
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
      const response = await axios.post('/api/payment', {
        requestID: requestId, 
        paymentInfo: {
          cardNumber: paymentDetails.cardNumber,
          expiryDate: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv,
          paymentMethod: paymentMethod
        },
        amount: totalPayment
      });
  
      if (response.status === 200 && response.data.success) {
        setSuccess('Payment authorized. Your payment has been successfully processed.');
        setPaymentDetails({ cardNumber: '', expiryDate: '', cvv: '' });
      } else {
        setError('Payment authorization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment authorization failed. Please try again.');
    }
  };
  

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard },
    { id: 'debit_card', name: 'Debit Card', icon: CreditCard }
  ];

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl px-4 sm:mt-8 sm:px-6 md:mt-10 md:px-8">
      <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-100 sm:text-3xl">Payment Details</h1>

        {error && (
          <div className="mb-6 rounded-xl border-2 border-red-800 bg-red-900/20 p-4">
            <p className="text-sm text-red-400 sm:text-base">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border-2 border-green-800 bg-green-900/20 p-4">
            <p className="text-sm text-green-400 sm:text-base">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {totalPayment !== null && (
            <div className="rounded-xl bg-gray-800/50 p-4 text-center">
              <p className="text-lg font-semibold text-violet-400 sm:text-xl">
                Total Payment: ${totalPayment.toFixed(2)}
              </p>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Card Type</label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === method.id
                      ? 'border-violet-400 bg-violet-400/10'
                      : 'border-gray-800 hover:border-gray-700'
                  } `}>
                  <method.icon
                    className={`h-6 w-6 ${paymentMethod === method.id ? 'text-violet-400' : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-medium ${paymentMethod === method.id ? 'text-violet-400' : 'text-gray-400'}`}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Card Number</label>
            <input
              className="w-full rounded-xl border-2 border-gray-800 bg-transparent p-2 text-sm text-gray-100 placeholder-gray-500 focus:border-violet-400 focus:outline-none sm:p-3 sm:text-base"
              placeholder="1234 5678 9012 3456"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Expiry Date</label>
              <input
                className="w-full rounded-xl border-2 border-gray-800 bg-transparent p-2 text-sm text-gray-100 placeholder-gray-500 focus:border-violet-400 focus:outline-none sm:p-3 sm:text-base"
                placeholder="MM/YY"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">CVV</label>
              <input
                className="w-full rounded-xl border-2 border-gray-800 bg-transparent p-2 text-sm text-gray-100 placeholder-gray-500 focus:border-violet-400 focus:outline-none sm:p-3 sm:text-base"
                placeholder="123"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                required
                type="password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-400 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 sm:text-base">
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
