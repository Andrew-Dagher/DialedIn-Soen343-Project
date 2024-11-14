class TrackingSubject {
    constructor() {
      this.observers = [];
    }
  
    subscribe(observer) {
      this.observers.push(observer);
    }
  
    unsubscribe(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }
  
    // Notify all observers about an update
    notify(trackingData) {
      this.observers.forEach(observer => observer.update(trackingData));
    }
  }
  
  export { TrackingSubject };
  