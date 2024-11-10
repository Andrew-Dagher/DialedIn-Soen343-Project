// services/DebitPaymentStrategy.js
import PaymentStrategy from './PaymentStrategy';
import Payment from '../models/Payment';
import { v4 as uuidv4 } from 'uuid';

export default class DebitPaymentStrategy extends PaymentStrategy {
  async processPayment(amount, requestID, paymentInfo) {
    // Process Debit payment logic
    const payment = new Payment({
      paymentID: uuidv4(),
      requestID,
      paymentMethod: 'debit',
      amount,
      status: 'completed',
      transactionDate: new Date(),
    });

    await payment.save();
    return payment;
  }
}
