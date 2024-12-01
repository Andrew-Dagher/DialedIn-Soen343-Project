import PaymentStrategy from './PaymentStrategy';
import { createPayment } from '../utils/paymentUtils';

export default class DebitPaymentStrategy extends PaymentStrategy {
  async processPayment(amount, requestID, paymentInfo) {
    return createPayment(requestID, amount, 'debit');
  }
}