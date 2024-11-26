// components/AddressAutocomplete.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript';

export default function AddressAutocomplete({ label, value, onChange, placeholder, required }) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const { isLoaded, loadError } = useGoogleMapsScript(['places']);

  useEffect(() => {
    if (isLoaded && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.AutocompleteService();
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (value?.formatted_address) {
      setInputValue(value.formatted_address);
    }
  }, [value?.formatted_address]);

  const handleInput = async e => {
    const input = e.target.value;
    setInputValue(input);

    if (!isLoaded || !autocompleteRef.current || input.length <= 2) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    try {
      const request = {
        input,
        types: ['address'],
        componentRestrictions: {
          country: [
            'us',
            'ca',
            'gb',
            'mx',
            'fr',
            'de',
            'es',
            'it',
            'pt',
            'nl',
            'be',
            'ch',
            'at',
            'se',
            'no',
            'dk',
            'fi',
            'ie',
            'au',
            'nz',
            'jp',
            'kr',
            'sg',
            'ae',
            'sa',
            'br',
            'ar',
            'cl',
            'co',
            'pe'
          ]
        }
      };

      autocompleteRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setIsOpen(true);
        } else {
          setPredictions([]);
          setIsOpen(false);
        }
      });
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = async prediction => {
    try {
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

      const getAddressComponent = type => {
        const component = result.address_components.find(c => c.types.includes(type));
        return component ? component.long_name : '';
      };

      const addressObject = {
        formatted_address: result.formatted_address,
        address: `${getAddressComponent('street_number')} ${getAddressComponent('route')}`.trim(),
        city:
          getAddressComponent('locality') ||
          getAddressComponent('sublocality') ||
          getAddressComponent('administrative_area_level_2'),
        country: result.address_components.find(c => c.types.includes('country'))?.short_name || '',
        zipcode: getAddressComponent('postal_code'),
        coordinates: {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        }
      };

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
      <div className="absolute left-3 top-1/2 -translate-y-1/2"></div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInput}
        placeholder={loadError ? `${placeholder} (Autocomplete unavailable)` : placeholder}
        required={required}
        className={inputClassName}
        autoComplete="off"
        disabled={!isLoaded}
      />
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border-2 border-gray-800 bg-gray-900 py-1 shadow-lg">
          {predictions.map(prediction => (
            <div
              key={prediction.place_id}
              onClick={() => handleSelect(prediction)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
              {prediction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
