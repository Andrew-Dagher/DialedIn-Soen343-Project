import { nanoid as defaultNanoid, customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', 21);

let temporaryRequests = {}; // Temporary storage of form answers

export async function POST(req) {
    const {
        contactName,
        phoneNumber,
        email,
        country,
        addressLine,
        postalCode,
        city,
        width,
        length,
        height,
        weight,
        pickupCountry,
        pickupAddress,
        pickupZipcode,
        pickupCity,
        dropoffCountry,
        dropoffAddress,
        dropoffZipcode,
        dropoffCity,
        shippingMethod,
        userId
    } = await req.json();

    // Validate that all required fields are provided
    if (
        !contactName ||
        !phoneNumber ||
        !email ||
        !country ||
        !addressLine ||
        !postalCode ||
        !city ||
        !width ||
        !length ||
        !height ||
        !weight ||
        !pickupCountry ||
        !pickupAddress ||
        !pickupZipcode ||
        !pickupCity ||
        !dropoffCountry ||
        !dropoffAddress ||
        !dropoffZipcode ||
        !dropoffCity ||
        !shippingMethod
    ) {
        return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Create a temporary request ID
    const requestId = nanoid();
    temporaryRequests[requestId] = {
        contactName,
        phoneNumber,
        email,
        country,
        addressLine,
        postalCode,
        city,
        width,
        length,
        height,
        weight,
        pickupCountry,
        pickupAddress,
        pickupZipcode,
        pickupCity,
        dropoffCountry,
        dropoffAddress,
        dropoffZipcode,
        dropoffCity,
        shippingMethod,
        status: "pending", // Payment status set to pending until paid
        userId
    };

    return new Response(JSON.stringify({ message: "Temporary delivery request created", requestId }), { status: 200 });
}
