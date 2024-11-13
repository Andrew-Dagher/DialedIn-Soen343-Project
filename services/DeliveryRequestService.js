// This is using Singleton we just crate an instance of DeliveryRequestService();

class DeliveryRequestService {
    static instance;

    constructor() {
        if (DeliveryRequestService.instance) {
            throw new Error("Use DeliveryRequestService.getInstance()");
        }
        DeliveryRequestService.instance = this;
    }

    static getInstance() {
        if (!DeliveryRequestService.instance) {
            DeliveryRequestService.instance = new DeliveryRequestService();
        }
        return DeliveryRequestService.instance;
    }

    async createTemporaryDeliveryRequest(data) {
        try {
            const response = await fetch('/api/delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create temporary delivery request');
            }

            return await response.json(); // Return the temporary ID or other data as needed, I mean this is just an Idea, but we can create the ID till the payment is done
        } catch (error) {
            console.error("Error creating temporary delivery request:", error);
            throw error;
        }
    }
}

export default DeliveryRequestService;
