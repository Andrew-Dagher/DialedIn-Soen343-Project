import sendgridClient from '@sendgrid/mail';

class EmailSubscriber {
  constructor() {
    sendgridClient.setApiKey(process.env.SENDGRID_API_KEY); 
  }


  async update(trackingData) {
    try {

      const msg = {
        to: trackingData.clientContact, 
        from: 'kevshi15@gmail.com', 
        subject: `Tracking Update for Package: ${trackingData.packageId}`,
        text: `Your package with ID: ${trackingData.packageId} has been updated.` +
          `\nCurrent Location: ${trackingData.locationDetails.location}` +
          `\nStatus: ${trackingData.locationDetails.description}` +
          `\nDelivery Progress: ${trackingData.deliveryProgress}%`,
        html: `<strong>Your package with ID: ${trackingData.packageId} has been updated.</strong>` +
          `<p>Current Location: ${trackingData.locationDetails.location}</p>` +
          `<p>Status: ${trackingData.locationDetails.description}</p>` +
          `<p>Delivery Progress: ${trackingData.deliveryProgress}%</p>`,
      };


      await sendgridClient.send(msg);
      console.log(`Email sent to ${trackingData.clientContact}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export { EmailSubscriber };
