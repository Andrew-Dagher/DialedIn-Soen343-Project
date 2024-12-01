// utils/paymentUtils.js
import Payment from '../models/Payment';
import { v4 as uuidv4 } from 'uuid';

export async function createPayment(requestID, amount, paymentMethod) {
  const payment = new Payment({
    paymentID: uuidv4(),
    requestID,
    paymentMethod,
    amount,
    status: 'completed',
    transactionDate: new Date(),
  });

  await payment.save();
  return payment;
}