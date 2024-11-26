import { nanoid as defaultNanoid, customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', 21);

let temporaryRequests = {}; // Temporary storage of form answers

export async function POST(req) {
    const {
        contactName,
        phoneNumber,
        email,
        billingAddress,
        billingCity,
        billingZipcode,
        billingCountry,
        billingCoordinates,
        weight,
        length,
        width,
        height,
        pickupAddress,
        pickupCity,
        pickupZipcode,
        pickupCountry,
        pickupCoordinates,
        pickupFormattedAddress,
        dropoffAddress,
        dropoffCity,
        dropoffZipcode,
        dropoffCountry,
        dropoffCoordinates,
        dropoffFormattedAddress,
        shippingMethod,
        userId
    } = await req.json();

    const billing = {
        address: billingAddress,
        city: billingCity,
        zipcode: billingZipcode,
        country: billingCountry,
        coordinates: billingCoordinates
    };

    const pickup = {
        address: pickupAddress,
        city: pickupCity,
        zipcode: pickupZipcode,
        country: pickupCountry,
        coordinates: pickupCoordinates,
        formatted_address: pickupFormattedAddress
    };

    const dropoff = {
        address: dropoffAddress,
        city: dropoffCity,
        zipcode: dropoffZipcode,
        country: dropoffCountry,
        coordinates: dropoffCoordinates,
        formatted_address: dropoffFormattedAddress
    };

    const dimensions = {
        length,
        width,
        height
    };

    // Validate that all required fields are provided
    if (
        !contactName ||
        !phoneNumber ||
        !email ||
        !billing ||
        !pickup ||
        !dropoff ||
        !weight ||
        !dimensions ||
        !shippingMethod
    ) {
        return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Validate coordinates presence
    if (!pickup.coordinates || !dropoff.coordinates || !billing.coordinates) {
        return new Response(JSON.stringify({ message: "Invalid address coordinates" }), { status: 400 });
    }

    // Create a temporary request ID
    const requestID = nanoid(); // Rename to be consistent

    // Store request data in a nested structure
    temporaryRequests[requestID] = {
        requestID,
        contactName,
        phoneNumber,
        email,
        billing,
        pickup,
        dropoff,
        weight,
        dimensions,
        shippingMethod,
        status: "pending", // Payment status set to pending until paid
        userId
    };

    return new Response(JSON.stringify({ message: "Temporary delivery request created", requestID }), { status: 200 });
}
