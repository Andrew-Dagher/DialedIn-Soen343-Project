
import { nanoid } from 'nanoid';

let temporaryRequests = {}; // temp storage of form answers

export async function POST(req) {
    const { contactName, phoneNumber, email, country, addressLine, postalCode, city, packageType, width, length, height, weight, serviceType, pickUpLocation, notificationPreference } = await req.json();

    if (!contactName || !phoneNumber || !email || !country || !addressLine || !postalCode || !city || !packageType || !width || !length || !height || !weight || !serviceType || !pickUpLocation || !notificationPreference) {
        return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }
//Here the status is what is pending since payment is pending once the user pays we have to change to paid
    const requestId = nanoid();
    temporaryRequests[requestId] = {
        contactName,
        phoneNumber,
        email,
        country,
        addressLine,
        postalCode,
        city,
        packageType,
        width,
        length,
        height,
        weight,
        serviceType,
        pickUpLocation,
        notificationPreference,
        status: "pending",
    };

    return new Response(JSON.stringify({ message: "Temporary delivery request created", requestId }), { status: 200 });
}
