export default class PaymentStrategy {
  async processPayment(amount, requestID, paymentInfo) {
    throw new Error("processPayment() must be implemented by each strategy");
  }
}
