// components/AddressAutocomplete.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function AddressAutocomplete({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required 
}) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google?.maps?.places) {
      console.log('Google Maps already loaded');
      initAutocomplete();
      setScriptLoaded(true);
      return;
    }

    console.log('Loading Google Maps script...');
    const script = document.createElement('script');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps script loaded');
      initAutocomplete();
      setScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (value?.formatted_address) {
      setInputValue(value.formatted_address);
    }
  }, [value?.formatted_address]);

  const initAutocomplete = () => {
    try {
      if (window.google?.maps?.places) {
        autocompleteRef.current = new window.google.maps.places.AutocompleteService();
        console.log('Autocomplete service initialized');
      } else {
        console.error('Google Maps Places service not available');
      }
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  };

  const handleInput = async (e) => {
    const input = e.target.value;
    setInputValue(input);
    console.log('Input value:', input);

    if (!scriptLoaded) {
      console.log('Google Maps script not yet loaded');
      return;
    }

    if (!autocompleteRef.current) {
      console.error('Autocomplete service not initialized');
      return;
    }

    if (input.length > 2) {
      try {
        console.log('Fetching predictions for:', input);
        const request = {
          input,
          types: ['address'],
          componentRestrictions: { country: ['us', 'ca'] } // Add more countries as needed
        };

        autocompleteRef.current.getPlacePredictions(
          request,
          (predictions, status) => {
            console.log('Predictions status:', status);
            console.log('Predictions:', predictions);

            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setPredictions(predictions);
              setIsOpen(true);
            } else {
              console.log('No predictions found or error:', status);
              setPredictions([]);
              setIsOpen(false);
            }
          }
        );
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictions([]);
        setIsOpen(false);
      }
    } else {
      setPredictions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = async (prediction) => {
    try {
      console.log('Selected prediction:', prediction);
      const geocoder = new window.google.maps.Geocoder();
      
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      console.log('Geocoding result:', result);

      // Extract components
      const getAddressComponent = (type) => {
        const component = result.address_components.find(c => c.types.includes(type));
        return component ? component.long_name : '';
      };

      const addressObject = {
        formatted_address: result.formatted_address,
        address: `${getAddressComponent('street_number')} ${getAddressComponent('route')}`.trim(),
        city: getAddressComponent('locality') || 
              getAddressComponent('sublocality') || 
              getAddressComponent('administrative_area_level_2'),
        country: result.address_components.find(c => c.types.includes('country'))?.short_name || '',
        zipcode: getAddressComponent('postal_code'),
        coordinates: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        }
      };

      console.log('Formatted address object:', addressObject);
      setInputValue(result.formatted_address);
      onChange({ target: { value: addressObject } });
      setIsOpen(false);
      setPredictions([]);

    } catch (error) {
      console.error('Error in handleSelect:', error);
    }
  };

  const inputClassName = `
    w-full border-gray-800 border-2 rounded-xl bg-transparent 
    p-2 sm:p-3 text-sm sm:text-base text-gray-100 
    placeholder-gray-500 transition-colors 
    focus:border-violet-400 focus:outline-none
    hover:border-gray-700 pl-10
  `;

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInput}
        placeholder={placeholder}
        required={required}
        className={inputClassName}
        autoComplete="off"
      />
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border-2 border-gray-800 bg-gray-900 py-1 shadow-lg">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              onClick={() => handleSelect(prediction)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}