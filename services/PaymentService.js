// services/PaymentService.js
import CreditCardPaymentStrategy from './CreditCardPaymentStrategy';
import DebitPaymentStrategy from './DebitPaymentStrategy';

class PaymentService {
  constructor(paymentMethod) {
    this.strategy = this.getStrategy(paymentMethod);
  }

  getStrategy(paymentMethod) {
    switch (paymentMethod) {
      case 'credit_card':
        return new CreditCardPaymentStrategy();
      case 'debit':
        return new DebitPaymentStrategy();
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }

  async processPayment(amount, requestID, paymentInfo) {
    return await this.strategy.processPayment(amount, requestID, paymentInfo);
  }
}

export default PaymentService;
