import PaymentStrategy from './PaymentStrategy';
import { createPayment } from '../utils/paymentUtils';

export default class CreditCardPaymentStrategy extends PaymentStrategy {
  async processPayment(amount, requestID, paymentInfo) {
    return createPayment(requestID, amount, 'credit_card');
  }
}