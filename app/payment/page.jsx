// PaymentPage.jsx

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
  const [requestId, setRequestId] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [couponID, setCouponID] = useState(null);

  useEffect(() => {
    const storedRequestId = localStorage.getItem('tempRequestID');
    const storedAmount = localStorage.getItem('quotationPrice');
    const storedDeliveryDetails = JSON.parse(localStorage.getItem('requestData')); // Retrieve delivery details
    const storedCouponID = localStorage.getItem('appliedCouponID'); // Retrieve coupon ID if available

    if (storedRequestId && storedAmount && storedDeliveryDetails) {
      setTotalPayment(parseFloat(storedAmount));
      setRequestId(storedRequestId);
      setDeliveryDetails(storedDeliveryDetails);
      if (storedCouponID) {
        setCouponID(storedCouponID); // Store coupon ID in state if it exists
      }
    } else {
      console.error('No request ID, amount, or delivery details found');
      setError('No request ID, amount, or delivery details found');
    }
  }, []);

  const validateCardNumber = number => number.length === 16 && /^\d+$/.test(number);
  const validateExpiryDate = date => /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const validateCVV = cvv => cvv.length === 3 && /^\d+$/.test(cvv);

  const handleChange = e => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
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
        deliveryDetails,
        couponID,
        amount: totalPayment
      });

      if (response.status === 200 && response.data.success) {
        setSuccess('Payment authorized. Redirecting to your deliveries...');
        setPaymentDetails({ cardNumber: '', expiryDate: '', cvv: '' });

        // Clear local storage
        localStorage.removeItem('tempRequestID');
        localStorage.removeItem('quotationPrice');
        localStorage.removeItem('requestData');
        localStorage.removeItem('appliedCouponID');

        // Add a small delay before redirecting to show the success message
        setTimeout(() => {
          router.push('/deliveries');
        }, 1500);
      } else {
        setError('Payment authorization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment authorization failed. Please try again.');
    }
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard, value: 'credit_card' },
    { id: 'debit', name: 'Debit Card', icon: CreditCard, value: 'debit' }
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

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Card Type</label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method.value)}
                  className={`flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === method.value
                      ? 'border-violet-400 bg-violet-400/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}>
                  <method.icon
                    className={`h-6 w-6 ${paymentMethod === method.value ? 'text-violet-400' : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-medium ${paymentMethod === method.value ? 'text-violet-400' : 'text-gray-400'}`}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
